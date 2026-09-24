import type { ReactNode } from "react";

export function Shell({
  children,
  showNav = true,
}: {
  children: ReactNode;
  showNav?: boolean;
}) {
  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <div className="shell">
        {showNav ? (
          <header className="topbar">
            <a className="brand" href="#/">
              Good <em>vs.</em> Evil
            </a>
            <nav className="nav" aria-label="Primary">
              <a href="#/levels">Stories</a>
              <a href="#/roster">Roster</a>
            </nav>
          </header>
        ) : null}
        <main id="content">{children}</main>
      </div>
    </>
  );
}
