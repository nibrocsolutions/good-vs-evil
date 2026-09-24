import { useEffect, useState } from "react";
import { Shell } from "./components/Shell";
import { useProgress } from "./game/useProgress";
import { BattleScreen } from "./screens/BattleScreen";
import { LevelSelectScreen } from "./screens/LevelSelectScreen";
import { RosterScreen } from "./screens/RosterScreen";
import { StoryScreen } from "./screens/StoryScreen";
import { TitleScreen } from "./screens/TitleScreen";

type Screen =
  | { name: "title" }
  | { name: "roster" }
  | { name: "levels" }
  | { name: "story"; levelId: string }
  | { name: "battle"; levelId: string; characterId: string };

function parseHash(hash: string): Screen {
  const path = hash.replace(/^#/, "") || "/";
  if (path === "/" || path === "/title") return { name: "title" };
  if (path === "/roster") return { name: "roster" };
  if (path === "/levels") return { name: "levels" };
  const story = path.match(/^\/story\/([a-z0-9-]+)$/);
  if (story) return { name: "story", levelId: story[1] };
  const battle = path.match(/^\/battle\/([a-z0-9-]+)\/([a-z0-9-]+)$/);
  if (battle) return { name: "battle", levelId: battle[1], characterId: battle[2] };
  return { name: "title" };
}

export function App() {
  const [screen, setScreen] = useState<Screen>(() => parseHash(window.location.hash));
  const { progress, markComplete, reset } = useProgress();

  useEffect(() => {
    const onChange = () => setScreen(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const showNav = screen.name !== "title";

  return (
    <Shell showNav={showNav}>
      {screen.name === "title" ? <TitleScreen /> : null}
      {screen.name === "roster" ? <RosterScreen /> : null}
      {screen.name === "levels" ? <LevelSelectScreen progress={progress} onReset={reset} /> : null}
      {screen.name === "story" ? <StoryScreen levelId={screen.levelId} progress={progress} /> : null}
      {screen.name === "battle" ? (
        <BattleScreen
          levelId={screen.levelId}
          characterId={screen.characterId}
          progress={progress}
          onVictory={markComplete}
        />
      ) : null}
    </Shell>
  );
}
