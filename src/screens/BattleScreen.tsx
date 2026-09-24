import { useEffect, useReducer, useRef } from "react";
import { HpBar } from "../components/HpBar";
import { findCharacter } from "../data/characters";
import { getLevel, LEVELS } from "../data/levels";
import {
  battleReducer,
  chooseEnemyAbility,
  combatantFromCharacter,
  createBattle,
  currentEnemy,
  damageRoll,
  type BattleState,
} from "../game/battle";
import { canPlayLevel, type Progress } from "../game/progress";

function buildBattle(levelId: string, characterId: string): BattleState | null {
  const level = getLevel(levelId);
  const character = findCharacter(characterId);
  if (!level || !character || !level.playableIds.includes(characterId) || character.role !== "combatant") {
    return null;
  }
  const enemies = level.enemyIds.map((id) => findCharacter(id));
  if (enemies.some((enemy) => !enemy || enemy.role !== "combatant")) return null;
  const hero = combatantFromCharacter(character);
  const foeStates = enemies.map((enemy) => combatantFromCharacter(enemy!));
  return createBattle(hero, foeStates);
}

export function BattleScreen({
  levelId,
  characterId,
  progress,
  onVictory,
}: {
  levelId: string;
  characterId: string;
  progress: Progress;
  onVictory: (levelId: string) => void;
}) {
  const level = getLevel(levelId);
  const initial = level && canPlayLevel(level, LEVELS, progress) ? buildBattle(levelId, characterId) : null;
  if (!level || !initial) {
    return (
      <section className="panel">
        <h1>This battle cannot start</h1>
        <p>The story is locked, or that figure is not a champion of this level.</p>
        <a className="button" href="#/levels">
          Back to stories
        </a>
      </section>
    );
  }
  return (
    <BattlePlay
      levelId={level.id}
      title={level.title}
      victoryText={level.victoryText}
      defeatText={level.defeatText}
      initial={initial}
      onVictory={onVictory}
    />
  );
}

function BattlePlay({
  levelId,
  title,
  victoryText,
  defeatText,
  initial,
  onVictory,
}: {
  levelId: string;
  title: string;
  victoryText: string;
  defeatText: string;
  initial: BattleState;
  onVictory: (levelId: string) => void;
}) {
  const [state, dispatch] = useReducer(battleReducer, initial);
  const saved = useRef(false);
  const logRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    logRef.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [state.log.length]);

  useEffect(() => {
    if (state.phase !== "victory" || saved.current) return;
    saved.current = true;
    onVictory(levelId);
  }, [state.phase, levelId, onVictory]);

  useEffect(() => {
    if (state.phase !== "enemy" && state.phase !== "wave") return;
    const timer = window.setTimeout(() => {
      if (state.phase === "wave") {
        dispatch({ type: "advance-wave" });
        return;
      }
      const enemy = currentEnemy(state);
      const ability = chooseEnemyAbility(enemy, Math.random);
      dispatch({
        type: "enemy-ability",
        abilityId: ability.id,
        roll: damageRoll(Math.random),
      });
    }, 700);
    return () => window.clearTimeout(timer);
  }, [state]);

  const enemy = currentEnemy(state);
  const busy = state.phase === "enemy" || state.phase === "wave";

  return (
    <section className="battle-layout">
      <p className="kicker">Battle</p>
      <h1>{title}</h1>
      <article className="fighter">
        <header>
          <h2>{enemy.name}</h2>
          <span>
            Foe {state.enemyIndex + 1} of {state.enemies.length}
          </span>
        </header>
        <HpBar hp={enemy.hp} maxHp={enemy.maxHp} tone="evil" label={`${enemy.name} health`} />
      </article>
      <ul className="log" ref={logRef} aria-live="polite">
        {state.log.map((line, index) => (
          <li key={`${index}-${line}`}>{line}</li>
        ))}
      </ul>
      <article className="fighter">
        <header>
          <h2>{state.hero.name}</h2>
          <span>
            Attack {state.hero.attack} · Defense {state.hero.defense}
          </span>
        </header>
        <HpBar hp={state.hero.hp} maxHp={state.hero.maxHp} tone="good" label={`${state.hero.name} health`} />
      </article>
      {state.phase === "victory" ? (
        <div className="banner">
          <h2>Victory</h2>
          <p>{victoryText}</p>
          <a className="button primary" href="#/levels" data-testid="victory-continue">
            Return to stories
          </a>
        </div>
      ) : null}
      {state.phase === "defeat" ? (
        <div className="banner defeat">
          <h2>Defeat</h2>
          <p>{defeatText}</p>
          <div className="button-row">
            <button
              type="button"
              className="button primary"
              onClick={() => {
                saved.current = false;
                dispatch({ type: "reset", initial });
              }}
            >
              Try again
            </button>
            <a className="button" href="#/levels">
              Return to stories
            </a>
          </div>
        </div>
      ) : null}
      {state.phase === "player" || busy ? (
        <div className="moves">
          {state.hero.abilities.map((ability) => {
            const healBlocked = ability.kind === "heal" && state.hero.hp >= state.hero.maxHp;
            return (
              <button
                key={ability.id}
                type="button"
                className="move"
                data-testid="ability"
                disabled={busy || state.phase !== "player" || healBlocked}
                onClick={() =>
                  dispatch({
                    type: "player-ability",
                    abilityId: ability.id,
                    roll: damageRoll(Math.random),
                  })
                }
              >
                <span>
                  {ability.kind} · strength {ability.power}
                </span>
                <strong>{ability.name}</strong>
                {ability.description}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
