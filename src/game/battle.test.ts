import { describe, expect, it } from "vitest";
import { CHARACTERS, getCharacter } from "../data/characters";
import { LEVELS } from "../data/levels";
import type { Ability } from "../types";
import {
  applyAbility,
  battleReducer,
  chooseEnemyAbility,
  combatantFromCharacter,
  createBattle,
  currentEnemy,
  damageRoll,
  type BattleState,
  type CombatantState,
} from "./battle";

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function greedyAbility(hero: CombatantState): Ability {
  const heal = hero.abilities.find((ability) => ability.kind === "heal");
  const strikes = hero.abilities
    .filter((ability) => ability.kind === "strike")
    .sort((a, b) => b.power - a.power);
  if (hero.hp / hero.maxHp < 0.42 && heal && hero.hp < hero.maxHp) return heal;
  return strikes[0] ?? hero.abilities[0];
}

function fight(levelId: string, heroId: string, seed: number): BattleState {
  const level = LEVELS.find((item) => item.id === levelId)!;
  const random = mulberry32(seed);
  let state = createBattle(
    combatantFromCharacter(getCharacter(heroId)),
    level.enemyIds.map((id) => combatantFromCharacter(getCharacter(id))),
  );
  for (let turn = 0; turn < 60 && (state.phase === "player" || state.phase === "enemy" || state.phase === "wave"); turn += 1) {
    if (state.phase === "wave") {
      state = battleReducer(state, { type: "advance-wave" });
      continue;
    }
    if (state.phase === "player") {
      const ability = greedyAbility(state.hero);
      state = battleReducer(state, {
        type: "player-ability",
        abilityId: ability.id,
        roll: damageRoll(random),
      });
      continue;
    }
    const enemy = currentEnemy(state);
    const ability = chooseEnemyAbility(enemy, random);
    state = battleReducer(state, {
      type: "enemy-ability",
      abilityId: ability.id,
      roll: damageRoll(random),
    });
  }
  return state;
}

describe("battle resolution", () => {
  it("heals without passing max health and always lands some damage", () => {
    const hero = combatantFromCharacter(getCharacter("david"));
    const foe = combatantFromCharacter(getCharacter("goliath"));
    const heal = hero.abilities.find((ability) => ability.kind === "heal")!;
    const full = applyAbility({ ...hero, hp: hero.maxHp }, foe, heal, 0);
    expect(full.actor.hp).toBe(hero.maxHp);
    const strike = hero.abilities.find((ability) => ability.kind === "strike")!;
    const hit = applyAbility(hero, foe, strike, 0);
    expect(hit.target.hp).toBeLessThan(foe.hp);
    expect(foe.hp - hit.target.hp).toBeGreaterThan(0);
  });

  it("lets a thoughtful fight win every starter level more often than not", () => {
    const seeds = [1, 2, 3, 4, 5];
    const weak: string[] = [];
    for (const level of LEVELS) {
      for (const heroId of level.playableIds) {
        const wins = seeds.filter((seed) => fight(level.id, heroId, seed).phase === "victory").length;
        if (wins < 4) weak.push(`${level.id} as ${heroId} won ${wins}/${seeds.length}`);
      }
    }
    expect(weak, weak.join("\n")).toEqual([]);
    expect(CHARACTERS.length).toBeGreaterThan(40);
  });
});
