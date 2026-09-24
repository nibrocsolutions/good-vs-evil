export type Alignment = "good" | "evil";

/** Combatants can enter a battle. Story figures are roster-only. */
export type Role = "combatant" | "story";

export type AbilityKind = "strike" | "guard" | "heal";

/**
 * Jesus and Mary use "honored": they stay in the roster and out of combat.
 * Other story figures use the default tone.
 */
export type CharacterTone = "honored";

export interface Ability {
  id: string;
  name: string;
  description: string;
  kind: AbilityKind;
  /** Base strength before attack, defense, and the small battle roll. */
  power: number;
}

export interface CombatStats {
  maxHp: number;
  attack: number;
  defense: number;
  abilities: Ability[];
}

export interface Character {
  id: string;
  name: string;
  alignment: Alignment;
  role: Role;
  epithet: string;
  description: string;
  /** Book chapter:verse citations, using modern Catholic book names. */
  references: string[];
  tone?: CharacterTone;
  stats?: CombatStats;
}

export interface Level {
  id: string;
  /** 1-based position in the unlock sequence. */
  order: number;
  title: string;
  intro: string;
  victoryText: string;
  defeatText: string;
  references: string[];
  /** Good combatants the player may choose. */
  playableIds: string[];
  /** Evil combatants, fought in order. */
  enemyIds: string[];
}
