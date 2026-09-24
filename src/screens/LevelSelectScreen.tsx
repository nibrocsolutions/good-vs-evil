import { useState } from "react";
import { References } from "../components/References";
import { getCharacter } from "../data/characters";
import { LEVELS } from "../data/levels";
import { canPlayLevel, type Progress } from "../game/progress";

export function LevelSelectScreen({
  progress,
  onReset,
}: {
  progress: Progress;
  onReset: () => void;
}) {
  const [confirmReset, setConfirmReset] = useState(false);
  const completed = progress.completedLevelIds.length;

  return (
    <section>
      <p className="kicker">Stories</p>
      <h1>Level select</h1>
      <p className="lede">
        {completed === 0
          ? "The first story is open. Each victory unlocks the next and is kept in this browser."
          : `${completed} of ${LEVELS.length} stories kept on this device. Replay any story you have unlocked.`}
      </p>
      <div className="level-list">
        {LEVELS.map((level) => {
          const open = canPlayLevel(level, LEVELS, progress);
          const done = progress.completedLevelIds.includes(level.id);
          const heroes = level.playableIds.map((id) => getCharacter(id).name).join(", ");
          const foes = level.enemyIds.map((id) => getCharacter(id).name).join(", ");
          const body = (
            <>
              <div className="order-num">{String(level.order).padStart(2, "0")}</div>
              <div>
                <h2>{level.title}</h2>
                <p className="meta">
                  With {heroes}. Facing {foes}.
                </p>
                <References citations={level.references} />
                {done ? <p className="done-flag">Kept</p> : null}
                {open ? null : <p className="meta">Complete the previous story to unlock.</p>}
              </div>
            </>
          );
          if (!open) {
            return (
              <button key={level.id} type="button" className="level-card locked" disabled>
                {body}
              </button>
            );
          }
          return (
            <a key={level.id} className="level-card" href={`#/story/${level.id}`}>
              {body}
            </a>
          );
        })}
      </div>
      <div className="button-row" style={{ marginTop: "1rem" }}>
        {confirmReset ? (
          <>
            <button type="button" className="button" onClick={onReset}>
              Confirm reset
            </button>
            <button type="button" className="button ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" className="button ghost" onClick={() => setConfirmReset(true)}>
            Reset saved progress
          </button>
        )}
      </div>
    </section>
  );
}
