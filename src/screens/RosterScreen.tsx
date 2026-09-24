import { useMemo, useState } from "react";
import { References } from "../components/References";
import { ROSTER_KEYNOTE } from "../data/canon";
import { CHARACTERS } from "../data/characters";
import { levelsFeaturing } from "../data/levels";
import type { Alignment, Character } from "../types";

type Filter = "all" | Alignment;

function initial(name: string): string {
  const letter = name.trim().charAt(0);
  return letter.toUpperCase();
}

function Card({ character }: { character: Character }) {
  const stories = levelsFeaturing(character.id);
  return (
    <article className={`card ${character.alignment} ${character.tone ?? ""}`}>
      <div className="card-head">
        <div className={`medallion ${character.alignment}`} aria-hidden="true">
          {initial(character.name)}
        </div>
        <div>
          <h2>{character.name}</h2>
          <p className="epithet">{character.epithet}</p>
        </div>
      </div>
      <div className="badges">
        <span className={`badge ${character.alignment}`}>
          {character.alignment === "good" ? "Good" : "Evil"}
        </span>
        {character.tone === "honored" ? <span className="badge quiet">Honored</span> : null}
        {character.role === "story" ? <span className="badge quiet">Story figure</span> : null}
      </div>
      <p>{character.description}</p>
      <References citations={character.references} />
      {character.stats ? (
        <>
          <div className="stats">
            <span>Health {character.stats.maxHp}</span>
            <span>Attack {character.stats.attack}</span>
            <span>Defense {character.stats.defense}</span>
          </div>
          {character.stats.abilities.map((ability) => (
            <div className="ability" key={ability.id}>
              <h3>{ability.name}</h3>
              <p>
                {ability.kind} · strength {ability.power}. {ability.description}
              </p>
            </div>
          ))}
        </>
      ) : (
        <p className="fine">Present in the roster, and kept out of battle.</p>
      )}
      {stories.length > 0 ? (
        <p className="fine">
          Stories: {stories.map((level) => level.title).join(" · ")}
        </p>
      ) : character.role === "combatant" ? (
        <p className="fine">
          Statted for battle, and not placed in a starter level. Add this id to a
          level when a story can carry them honestly.
        </p>
      ) : null}
    </article>
  );
}

export function RosterScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return CHARACTERS.filter((character) => {
      if (filter !== "all" && character.alignment !== filter) return false;
      if (!needle) return true;
      return (
        character.name.toLowerCase().includes(needle) ||
        character.epithet.toLowerCase().includes(needle)
      );
    });
  }, [filter, query]);

  const good = visible.filter((character) => character.alignment === "good");
  const evil = visible.filter((character) => character.alignment === "evil");

  return (
    <section>
      <p className="kicker">Roster</p>
      <h1>Every figure in the starter set</h1>
      <p className="lede">
        {ROSTER_KEYNOTE.line} ({ROSTER_KEYNOTE.citation})
      </p>
      <div className="filters">
        <label className="search-label" htmlFor="roster-search">
          Search by name
        </label>
        <input
          id="roster-search"
          className="search"
          value={query}
          placeholder="Search by name"
          onChange={(event) => setQuery(event.target.value)}
        />
        {(
          [
            ["all", "All"],
            ["good", "Good"],
            ["evil", "Evil"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className="chip"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="count">
        Showing {visible.length} of {CHARACTERS.length}
      </p>
      {visible.length === 0 ? <p>No one matches that search.</p> : null}
      {filter !== "evil" && good.length > 0 ? (
        <>
          <h2 className="section-label">Good</h2>
          <div className="grid">
            {good.map((character) => (
              <Card key={character.id} character={character} />
            ))}
          </div>
        </>
      ) : null}
      {filter !== "good" && evil.length > 0 ? (
        <>
          <h2 className="section-label">Evil</h2>
          <div className="grid">
            {evil.map((character) => (
              <Card key={character.id} character={character} />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
