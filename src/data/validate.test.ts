import { describe, expect, it } from "vitest";
import { splitCitation } from "./canon";
import { CHARACTERS } from "./characters";
import { LEVELS } from "./levels";

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe("character roster", () => {
  it("gives every character a unique id, alignment, and at least one scripture reference", () => {
    const ids = new Set<string>();
    for (const character of CHARACTERS) {
      expect(character.id, character.name).toMatch(idPattern);
      expect(ids.has(character.id), character.id).toBe(false);
      ids.add(character.id);
      expect(["good", "evil"]).toContain(character.alignment);
      expect(character.description.length).toBeGreaterThan(40);
      expect(character.references.length).toBeGreaterThan(0);
      for (const citation of character.references) {
        expect(() => splitCitation(citation), citation).not.toThrow();
      }
    }
  });

  it("gives combatants battle stats and keeps story figures out of combat", () => {
    const abilityIds = new Set<string>();
    for (const character of CHARACTERS) {
      if (character.role === "story") {
        expect(character.stats, character.id).toBeUndefined();
        expect(character.alignment, character.id).toBe("good");
        continue;
      }
      expect(character.stats, character.id).toBeDefined();
      const stats = character.stats!;
      expect(stats.maxHp).toBeGreaterThan(0);
      expect(stats.attack).toBeGreaterThan(0);
      expect(stats.defense).toBeGreaterThan(0);
      expect(stats.abilities.length).toBeGreaterThanOrEqual(2);
      expect(stats.abilities.some((ability) => ability.kind === "strike"), character.id).toBe(true);
      for (const ability of stats.abilities) {
        expect(abilityIds.has(ability.id), ability.id).toBe(false);
        abilityIds.add(ability.id);
        expect(ability.power).toBeGreaterThan(0);
        expect(ability.description.length).toBeGreaterThan(8);
      }
    }
  });

  it("honors Jesus and Mary as story figures and covers the deuterocanonical cast", () => {
    const byId = new Map(CHARACTERS.map((character) => [character.id, character]));
    for (const id of ["jesus", "mary"]) {
      const character = byId.get(id);
      expect(character, id).toBeDefined();
      expect(character?.role).toBe("story");
      expect(character?.tone).toBe("honored");
      expect(character?.stats).toBeUndefined();
    }
    for (const id of [
      "raphael",
      "tobias",
      "asmodeus",
      "judith",
      "holofernes",
      "judas-maccabeus",
      "antiochus-iv",
      "susanna",
      "esther",
      "baruch",
      "solomon",
    ]) {
      expect(byId.has(id), id).toBe(true);
    }
    expect(CHARACTERS.filter((character) => character.alignment === "good").length).toBeGreaterThan(20);
    expect(CHARACTERS.filter((character) => character.alignment === "evil").length).toBeGreaterThan(15);
  });
});

describe("story levels", () => {
  const characters = new Map(CHARACTERS.map((character) => [character.id, character]));

  it("unlocks in a contiguous order and cites scripture", () => {
    const orders = LEVELS.map((level) => level.order);
    expect(orders).toEqual(LEVELS.map((_, index) => index + 1));
    const ids = new Set<string>();
    for (const level of LEVELS) {
      expect(ids.has(level.id)).toBe(false);
      ids.add(level.id);
      expect(level.intro.length).toBeGreaterThan(80);
      expect(level.victoryText.length).toBeGreaterThan(20);
      expect(level.playableIds.length).toBeGreaterThan(0);
      expect(level.enemyIds.length).toBeGreaterThan(0);
      for (const citation of level.references) {
        expect(() => splitCitation(citation), `${level.id} ${citation}`).not.toThrow();
      }
    }
  });

  it("references existing combatants on the correct side", () => {
    for (const level of LEVELS) {
      for (const id of level.playableIds) {
        const character = characters.get(id);
        expect(character, `${level.id} playable ${id}`).toBeDefined();
        expect(character?.alignment).toBe("good");
        expect(character?.role).toBe("combatant");
      }
      for (const id of level.enemyIds) {
        const character = characters.get(id);
        expect(character, `${level.id} enemy ${id}`).toBeDefined();
        expect(character?.alignment).toBe("evil");
        expect(character?.role).toBe("combatant");
      }
    }
    for (const character of CHARACTERS.filter((item) => item.role === "story")) {
      for (const level of LEVELS) {
        expect(level.playableIds, character.id).not.toContain(character.id);
        expect(level.enemyIds, character.id).not.toContain(character.id);
      }
    }
  });
});
