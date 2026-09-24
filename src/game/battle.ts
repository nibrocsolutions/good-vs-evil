import type { Ability, Character, CombatStats } from "../types";

export interface CombatantState {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  abilities: Ability[];
  /** Incoming damage is reduced by this much once, then the guard clears. */
  guard: number;
}

export type BattlePhase = "player" | "enemy" | "wave" | "victory" | "defeat";

export interface BattleState {
  hero: CombatantState;
  enemies: CombatantState[];
  enemyIndex: number;
  phase: BattlePhase;
  log: string[];
}

export type BattleCommand =
  | { type: "player-ability"; abilityId: string; roll: number }
  | { type: "enemy-ability"; abilityId: string; roll: number }
  | { type: "advance-wave" }
  | { type: "reset"; initial: BattleState };

const MIN_STRIKE = 4;

export function combatantFromCharacter(character: Character): CombatantState {
  if (character.role !== "combatant" || !character.stats) {
    throw new Error(`${character.name} has no battle stats`);
  }
  return combatantFromStats(character.id, character.name, character.stats);
}

export function combatantFromStats(id: string, name: string, stats: CombatStats): CombatantState {
  return {
    id,
    name,
    hp: stats.maxHp,
    maxHp: stats.maxHp,
    attack: stats.attack,
    defense: stats.defense,
    abilities: stats.abilities,
    guard: 0,
  };
}

export function createBattle(hero: CombatantState, enemies: CombatantState[]): BattleState {
  if (enemies.length === 0) {
    throw new Error("A battle needs an enemy");
  }
  return {
    hero,
    enemies,
    enemyIndex: 0,
    phase: "player",
    log: [`${hero.name} faces ${enemies[0].name}.`],
  };
}

/** 0 through 3, so identical stats still vary a little. */
export function damageRoll(random: () => number): number {
  return Math.floor(random() * 4);
}

export function strikeDamage(
  actor: CombatantState,
  target: CombatantState,
  power: number,
  roll: number,
): number {
  const raw =
    power + Math.floor(actor.attack / 2) + roll - Math.floor(target.defense / 3);
  return Math.max(MIN_STRIKE, raw);
}

interface StepResult {
  actor: CombatantState;
  target: CombatantState;
  log: string;
}

export function applyAbility(
  actor: CombatantState,
  target: CombatantState,
  ability: Ability,
  roll: number,
): StepResult {
  if (ability.kind === "heal") {
    const healed = Math.min(actor.maxHp, actor.hp + ability.power) - actor.hp;
    const next = { ...actor, hp: actor.hp + healed };
    const log =
      healed > 0
        ? `${actor.name} uses ${ability.name} and regains ${healed} health.`
        : `${actor.name} uses ${ability.name}, already at full health.`;
    return { actor: next, target, log };
  }

  if (ability.kind === "guard") {
    const next = { ...actor, guard: ability.power };
    return {
      actor: next,
      target,
      log: `${actor.name} uses ${ability.name} and takes a guarded stance.`,
    };
  }

  let damage = strikeDamage(actor, target, ability.power, roll);
  let guardNote = "";
  let nextTarget = { ...target };
  if (nextTarget.guard > 0) {
    const reduced = Math.max(1, damage - nextTarget.guard);
    guardNote = " The guard softens the blow.";
    damage = reduced;
    nextTarget = { ...nextTarget, guard: 0 };
  }
  nextTarget = { ...nextTarget, hp: Math.max(0, nextTarget.hp - damage) };
  const fallen = nextTarget.hp === 0 ? ` ${nextTarget.name} is overcome.` : "";
  return {
    actor,
    target: nextTarget,
    log: `${actor.name} uses ${ability.name}. ${target.name} takes ${damage} damage.${guardNote}${fallen}`,
  };
}

export function currentEnemy(state: BattleState): CombatantState {
  return state.enemies[state.enemyIndex];
}

export function battleReducer(state: BattleState, command: BattleCommand): BattleState {
  if (command.type === "reset") {
    return command.initial;
  }

  if (command.type === "advance-wave") {
    if (state.phase !== "wave") return state;
    const enemyIndex = state.enemyIndex + 1;
    const next = state.enemies[enemyIndex];
    const recovered = Math.min(
      state.hero.maxHp,
      state.hero.hp + Math.round(state.hero.maxHp * 0.45),
    );
    return {
      ...state,
      hero: { ...state.hero, hp: recovered },
      enemyIndex,
      phase: "player",
      log: [
        ...state.log,
        `There is a pause, and a little strength returns.`,
        `${next.name} steps forward.`,
      ],
    };
  }

  if (command.type === "player-ability") {
    if (state.phase !== "player") return state;
    const enemy = currentEnemy(state);
    const ability = state.hero.abilities.find((item) => item.id === command.abilityId);
    if (!ability) return state;
    const step = applyAbility(state.hero, enemy, ability, command.roll);
    const enemies = state.enemies.slice();
    enemies[state.enemyIndex] = step.target;
    const more = state.enemyIndex < enemies.length - 1;
    let phase: BattlePhase = "enemy";
    if (step.target.hp === 0) {
      phase = more ? "wave" : "victory";
    }
    return {
      ...state,
      hero: step.actor,
      enemies,
      phase,
      log: [...state.log, step.log],
    };
  }

  if (state.phase !== "enemy") return state;
  const enemy = currentEnemy(state);
  const ability = enemy.abilities.find((item) => item.id === command.abilityId);
  if (!ability) return state;
  const step = applyAbility(enemy, state.hero, ability, command.roll);
  const enemies = state.enemies.slice();
  enemies[state.enemyIndex] = step.actor;
  return {
    ...state,
    hero: step.target,
    enemies,
    phase: step.target.hp === 0 ? "defeat" : "player",
    log: [...state.log, step.log],
  };
}

export function chooseEnemyAbility(
  enemy: CombatantState,
  random: () => number,
): Ability {
  const heal = enemy.abilities.find((ability) => ability.kind === "heal");
  const guard = enemy.abilities.find((ability) => ability.kind === "guard");
  const strikes = enemy.abilities.filter((ability) => ability.kind === "strike");
  if (heal && enemy.hp / enemy.maxHp < 0.34 && enemy.hp < enemy.maxHp) {
    return heal;
  }
  if (guard && enemy.guard === 0 && random() < 0.28) {
    return guard;
  }
  if (strikes.length === 0) {
    return enemy.abilities[0];
  }
  const index = Math.min(strikes.length - 1, Math.floor(random() * strikes.length));
  return strikes[index];
}
