import { useState } from "react";
import { References } from "../components/References";
import { getLevel, LEVELS, levelRoster } from "../data/levels";
import { canPlayLevel, type Progress } from "../game/progress";

export function StoryScreen({ levelId, progress }: { levelId: string; progress: Progress }) {
  const level = getLevel(levelId);
  if (!level) {
    return (
      <section className="panel">
        <h1>Unknown story</h1>
        <p>That level is not in the starter set.</p>
        <a className="button" href="#/levels">
          Back to stories
        </a>
      </section>
    );
  }
  if (!canPlayLevel(level, LEVELS, progress)) {
    return (
      <section className="panel">
        <h1>{level.title} is still locked</h1>
        <p>Complete the previous story to open this one.</p>
        <a className="button" href="#/levels">
          Back to stories
        </a>
      </section>
    );
  }
  return <StoryBody level={level} />;
}

function StoryBody({ level }: { level: NonNullable<ReturnType<typeof getLevel>> }) {
  const { playable, enemies } = levelRoster(level);
  const [chosen, setChosen] = useState(playable[0]?.id ?? "");

  return (
    <section className="stack">
      <p className="kicker">Story {String(level.order).padStart(2, "0")}</p>
      <div className="panel">
        <h1>{level.title}</h1>
        <p className="prose">{level.intro}</p>
        <References citations={level.references} />
      </div>
      <div className="panel">
        <h2>Choose your champion</h2>
        <div className="hero-pick" role="radiogroup" aria-label="Playable characters">
          {playable.map((character) => (
            <button
              key={character.id}
              type="button"
              className="choice"
              role="radio"
              aria-checked={chosen === character.id}
              onClick={() => setChosen(character.id)}
            >
              {character.name}
            </button>
          ))}
        </div>
        <p>
          Facing {enemies.map((enemy) => enemy.name).join(", then ")}.
        </p>
        <p className="fine">
          On your turn, choose a strike, a guard, or a recovery. The enemy answers.
          Bring their health to zero.
        </p>
        <div className="button-row">
          <a
            className="button primary"
            href={`#/battle/${level.id}/${chosen}`}
            data-testid="begin-battle"
          >
            Begin battle
          </a>
          <a className="button ghost" href="#/levels">
            Back to stories
          </a>
        </div>
      </div>
    </section>
  );
}
