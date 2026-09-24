# Good vs. Evil

A small browser game of Bible stories. Good characters and evil characters, drawn from the Catholic Bible, meet in short turn-based battles. The Catholic Bible here means the 73-book canon: the books shared with most Protestant Bibles, plus Tobit, Judith, Wisdom, Sirach, Baruch, 1 and 2 Maccabees, and the Greek additions to Esther and Daniel (including Susanna, and Bel and the Dragon).

The starter roster and the starter levels are a broad sample, not a complete cast of Scripture.

Battles are dramatizations. The story text says what the passage actually records when a scene is not a duel, when someone is spared, or when a king is humbled rather than killed. Jesus Christ and Mary are on the roster as honored story figures and are not combatants.

## Stack

Vite, React, and TypeScript. The game is a sequence of screens — title, roster, level select, story, battle — so a small React UI is a better fit than a full game engine. There is no server. `npm run build` writes a static `dist/` folder that any static host can serve. Vitest checks the data: scripture citations, character ids, and that every level can be won.

Scripture citations use the book names of current English Catholic Bibles such as the NABRE and the RSV-2CE (1 Samuel and 1 Kings, not the older Douay titles 1 Kings and 3 Kings). Where verse numbering differs between editions, a citation stays at the chapter.

## Run and build

```bash
npm install
npm run dev      # local play
npm test         # data checks and a scripted fight of every level
npm run build    # typecheck and static build
npm run preview  # serve the build
```

Progress is stored in `localStorage` under `good-vs-evil.progress.v1`. The first story is open. Finishing a story unlocks the next one. Reset lives at the bottom of the story list.

## Project structure

```
index.html
src/main.tsx                 # app entry
src/App.tsx                  # hash routes: #/roster, #/levels, #/story/…, #/battle/…/…
src/types.ts                 # Character and Level shapes
src/data/canon.ts            # Catholic book names and citation parsing
src/data/characters.ts       # roster
src/data/levels.ts           # stories, in unlock order
src/game/battle.ts           # turn resolution
src/game/progress.ts         # localStorage progress
src/screens/                 # title, roster, level select, story, battle
src/data/validate.test.ts    # roster and level checks
```

## How to add a character

Add an object in `src/data/characters.ts`.

- `id`: unique kebab-case string.
- `name`, `epithet`, `description`, `alignment` (`good` or `evil`).
- `references`: at least one citation like `Judith 13` or `1 Samuel 17:40-50`. The book must be one of `CATHOLIC_CANON_BOOKS` in `src/data/canon.ts`. If you are unsure of a verse, cite the chapter.
- Combatants set `role` through the `combatant()` helper and need `maxHp`, `attack`, `defense`, and abilities. Include at least one `strike`. `guard` reduces the next hit. `heal` restores health up to the maximum. The helper nudges the final stats (good characters gain a little health, attack, and healing; evil strikes are trimmed by one) so the roster numbers match the fight and a careful player can win.
- Story figures use the `story()` helper and have no battle stats. Reserve `tone: "honored"` for figures who should never be sent into a fight.

A few combatants are fully statted and intentionally not bosses of a starter story, because a simple win would distort the account: Cain, Ahab, Jezebel, Herod the Great, and Judas Iscariot. Gabriel has support-leaning stats and is not placed in a starter duel, because Scripture presents him as a messenger. To use any of them, add the id to a level whose intro and victory text can tell the truth.

## How to add a level

Add an object at the end of `LEVELS` in `src/data/levels.ts`.

- Give it the next `order` number. Completing order *n* unlocks order *n + 1*.
- `playableIds` must be existing **good combatant** ids. `enemyIds` must be existing **evil combatant** ids, fought in that order. Health carries between foes, with a short recovery between them.
- Write `intro`, `victoryText`, and `defeatText` in a family-friendly voice. If the biblical ending is not “the hero slew the foe,” say so in the victory text.
- Add `references`.

`npm test` fails if a level points at a missing id, if a story figure is placed in a fight, if a citation uses an unknown book, or if a scripted fight cannot win a level.

## Roadmap

- Portraits and a small set of scene illustrations, still restrained.
- Audio: a quiet modal line and a few soft cues, with a mute control.
- More stories (further prophets, the return from exile, scenes from Acts) without turning witnesses into duelists.
- A readable “passages” view that shows the citation next to a short paraphrase.
- Installable phone play: a PWA manifest, then a thin wrapper if a store build is wanted.
- Multiplayer sketches: shared story progress, or an asynchronous challenge where two players clear the same story and compare how they spent their turns. Real-time combat is a poor fit for these texts.

## Tone

Keep descriptions reverent and suitable for a family. Do not quote long passages from copyrighted translations; paraphrase, and cite the reference. Do not add a battle whose victory would teach something the passage does not say.
