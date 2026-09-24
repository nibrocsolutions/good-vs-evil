export function TitleScreen() {
  return (
    <section className="title-screen">
      <svg className="title-mark" viewBox="0 0 72 72" aria-hidden="true">
        <rect x="8" y="6" width="56" height="60" fill="#f3e6c8" stroke="#c6a15a" />
        <path d="M36 6 v60" stroke="#c6a15a" />
        <circle cx="36" cy="36" r="8" fill="none" stroke="#1f6b54" strokeWidth="2" />
      </svg>
      <p className="canon-line">Catholic Bible · 73 books</p>
      <h1>
        Good <em>vs.</em> Evil
      </h1>
      <p className="subtitle">Stories of the faithful and what opposed them.</p>
      <p className="lede">
        Every figure here is drawn from the Catholic canon, including Tobit, Judith,
        the books of Maccabees, Wisdom, Sirach, Baruch, and the additions to Esther
        and Daniel. Choose a story, stand with its heroes, and face the opposition
        in a short turn-based battle.
      </p>
      <div className="button-row">
        <a className="button primary" href="#/levels" data-testid="start-stories">
          Begin the stories
        </a>
        <a className="button" href="#/roster">
          Browse the roster
        </a>
      </div>
      <ol className="steps">
        <li>
          <strong>1. Choose a story</strong>
          Levels unlock in order and stay saved on this device.
        </li>
        <li>
          <strong>2. Read the scene</strong>
          A short intro and the scripture passages sit beside the fight.
        </li>
        <li>
          <strong>3. Take a turn</strong>
          Strike, guard, or recover. The enemy answers. Health decides the scene.
        </li>
      </ol>
      <p className="footer-note">
        A respectful dramatization for play and memory. It is a companion to
        Scripture, not a replacement, and it does not claim to list every person
        in the Bible.
      </p>
    </section>
  );
}
