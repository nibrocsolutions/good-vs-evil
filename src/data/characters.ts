import type { Ability, Alignment, Character, CharacterTone } from "../types";

interface CombatantInput {
  id: string;
  name: string;
  alignment: Alignment;
  epithet: string;
  description: string;
  references: string[];
  maxHp: number;
  attack: number;
  defense: number;
  abilities: Ability[];
}

interface StoryInput {
  id: string;
  name: string;
  epithet: string;
  description: string;
  references: string[];
  tone?: CharacterTone;
}

/**
 * Final battle numbers differ slightly from the literals below: good
 * combatants gain 12 health, 2 attack, and 4 healing; evil combatants lose
 * 8 health and 1 strike strength. The roster shows the numbers used in battle,
 * so a careful player can win and a careless one can still lose.
 */
function combatant(input: CombatantInput): Character {
  const { maxHp, attack, defense, abilities, alignment, ...rest } = input;
  const villain = alignment === "evil";
  return {
    ...rest,
    alignment,
    role: "combatant",
    stats: {
      maxHp: villain ? Math.max(60, maxHp - 8) : maxHp + 12,
      attack: villain ? Math.max(6, attack - 1) : attack + 2,
      defense,
      abilities: abilities.map((item) => {
        if (item.kind === "strike" && villain) {
          return { ...item, power: Math.max(6, item.power - 1) };
        }
        if (item.kind === "heal" && !villain) {
          return { ...item, power: item.power + 4 };
        }
        return item;
      }),
    },
  };
}

function story(input: StoryInput): Character {
  return { ...input, alignment: "good", role: "story" };
}

function ability(
  id: string,
  name: string,
  kind: Ability["kind"],
  power: number,
  description: string,
): Ability {
  return { id, name, kind, power, description };
}

/**
 * Starter roster from the Catholic Bible (73 books). It is a broad sample,
 * not a complete list of every person in Scripture. Add another object here.
 */
export const CHARACTERS: Character[] = [
  combatant({
    id: "michael",
    name: "Michael",
    alignment: "good",
    epithet: "Archangel",
    description:
      "Michael is called a chief prince and the great prince who stands for the people. He leads the angels against the dragon, and when he contends with the devil he leaves the judgment to the Lord.",
    references: ["Daniel 10:13", "Daniel 12:1", "Jude 9", "Revelation 12:7-9"],
    maxHp: 112,
    attack: 16,
    defense: 10,
    abilities: [
      ability("michael-standard", "Heavenly Standard", "strike", 14, "The host rallies under Michael's lead."),
      ability("michael-rebuke", "Left to the Lord", "strike", 12, "He contends, and the rebuke belongs to the Lord."),
      ability("michael-heal", "Prince's Watch", "heal", 18, "The great prince stands, and courage returns."),
    ],
  }),
  combatant({
    id: "gabriel",
    name: "Gabriel",
    alignment: "good",
    epithet: "Archangel and messenger",
    description:
      "Gabriel stands in the presence of God. He explains visions to Daniel and announces the births of John the Baptist and Jesus. Scripture presents him as a messenger, so he is not given a starter duel.",
    references: ["Daniel 8:16", "Daniel 9:21", "Luke 1:19", "Luke 1:26-38"],
    maxHp: 90,
    attack: 9,
    defense: 8,
    abilities: [
      ability("gabriel-word", "Named and Sent", "strike", 9, "A clear word that unmasks confusion."),
      ability("gabriel-guard", "Standing in the Presence", "guard", 11, "He stands before God and shelters the one he is sent to."),
      ability("gabriel-heal", "Word of Annunciation", "heal", 18, "A message of favor restores the heart."),
    ],
  }),
  combatant({
    id: "raphael",
    name: "Raphael",
    alignment: "good",
    epithet: "Archangel, guide of Tobias",
    description:
      "Raphael travels with Tobias under the name Azariah, shows him how the fish will help, and binds Asmodeus. He then reveals himself as one of the seven angels who stand before the Lord.",
    references: ["Tobit 5", "Tobit 8:3", "Tobit 12:15"],
    maxHp: 98,
    attack: 11,
    defense: 8,
    abilities: [
      ability("raphael-bind", "Binding the Demon", "strike", 14, "Raphael binds Asmodeus and sends him far away."),
      ability("raphael-guard", "Smoke of the Fish", "guard", 10, "The incense he prescribed drives the threat back."),
      ability("raphael-heal", "Healing of Tobit", "heal", 20, "The same journey that frees Sarah heals Tobit's eyes."),
    ],
  }),
  story({
    id: "noah",
    name: "Noah",
    epithet: "Builder of the ark",
    description:
      "Noah did as God commanded and built the ark. After the flood, God set a bow in the clouds as a covenant sign.",
    references: ["Genesis 6:22", "Genesis 9:13"],
  }),
  combatant({
    id: "abraham",
    name: "Abraham",
    alignment: "good",
    epithet: "Father of the faithful",
    description:
      "God called Abraham to leave his country. When raiders carried Lot away, Abraham led a night rescue and then blessed God Most High.",
    references: ["Genesis 12:1-4", "Genesis 14:14-16"],
    maxHp: 96,
    attack: 12,
    defense: 7,
    abilities: [
      ability("abraham-rescue", "Night Rescue", "strike", 13, "He arms his household and brings Lot home."),
      ability("abraham-blessing", "God Most High", "strike", 11, "He refuses plunder and blesses the One who delivered him."),
      ability("abraham-heal", "Covenant Hope", "heal", 16, "The promise steadies him."),
    ],
  }),
  combatant({
    id: "moses",
    name: "Moses",
    alignment: "good",
    epithet: "Prophet of the Exodus",
    description:
      "The Lord called Moses at the burning bush and sent him to bring Israel out of Egypt. At the sea, Moses stretched out his hand and the waters opened.",
    references: ["Exodus 3:1-12", "Exodus 14:21-28"],
    maxHp: 108,
    attack: 14,
    defense: 8,
    abilities: [
      ability("moses-staff", "Outstretched Staff", "strike", 14, "He stretches out his hand over the sea."),
      ability("moses-word", "Let My People Go", "strike", 12, "The demand the Lord gave him to speak."),
      ability("moses-heal", "Raised Hands", "heal", 18, "While his hands are raised, the people hold."),
    ],
  }),
  combatant({
    id: "aaron",
    name: "Aaron",
    alignment: "good",
    epithet: "Priest and brother of Moses",
    description:
      "Aaron spoke for Moses and stood before Pharaoh. His staff became a sign the magicians could not match, and later it budded as a priestly sign.",
    references: ["Exodus 7:8-13", "Numbers 17"],
    maxHp: 92,
    attack: 10,
    defense: 7,
    abilities: [
      ability("aaron-staff", "Budding Staff", "strike", 11, "A sign of the calling God gave him."),
      ability("aaron-guard", "Priestly Intercession", "guard", 10, "He stands between the people and harm."),
      ability("aaron-heal", "Brother's Support", "heal", 16, "He holds up the work when Moses tires."),
    ],
  }),
  combatant({
    id: "joshua",
    name: "Joshua",
    alignment: "good",
    epithet: "Successor of Moses",
    description:
      "Joshua led Israel across the Jordan. At Jericho the ark and the trumpets circled the city, and the walls fell.",
    references: ["Joshua 1:1-9", "Joshua 6:20"],
    maxHp: 104,
    attack: 14,
    defense: 8,
    abilities: [
      ability("joshua-trumpets", "Trumpets and the Ark", "strike", 14, "The city is circled at the Lord's command."),
      ability("joshua-courage", "Be Strong", "strike", 12, "The charge given him: be strong and steadfast."),
      ability("joshua-heal", "Camp Rest", "heal", 16, "The people gather their strength for the next day."),
    ],
  }),
  combatant({
    id: "caleb",
    name: "Caleb",
    alignment: "good",
    epithet: "Scout who trusted",
    description:
      "Caleb was one of the twelve scouts. He urged Israel to trust that the Lord could give the land, and Joshua later blessed his inheritance.",
    references: ["Numbers 13:30", "Joshua 14:6-12"],
    maxHp: 100,
    attack: 13,
    defense: 9,
    abilities: [
      ability("caleb-report", "Good Report", "strike", 12, "He speaks faith when the other scouts shrink back."),
      ability("caleb-hill", "The Hill Country", "strike", 13, "He asks for the ridge he was promised and takes it."),
      ability("caleb-heal", "Wholehearted", "heal", 15, "He followed the Lord fully, and his strength holds."),
    ],
  }),
  story({
    id: "rahab",
    name: "Rahab",
    epithet: "Of Jericho",
    description:
      "Rahab hid the Israelite scouts and was spared with her household when Jericho fell.",
    references: ["Joshua 2:1-21", "Joshua 6:22-25"],
  }),
  combatant({
    id: "deborah",
    name: "Deborah",
    alignment: "good",
    epithet: "Prophet and judge",
    description:
      "Deborah judged Israel under the palm of Deborah. She summoned Barak, went with him against Sisera, and sang of the victory.",
    references: ["Judges 4:4-9", "Judges 5:1-7"],
    maxHp: 94,
    attack: 12,
    defense: 7,
    abilities: [
      ability("deborah-muster", "Word of Muster", "strike", 13, "She sends Barak: this is the day."),
      ability("deborah-guard", "Under the Palm", "guard", 9, "The people came to her for judgment, and she steadies the line."),
      ability("deborah-heal", "Song of Deborah", "heal", 16, "Her song keeps the deed in memory."),
    ],
  }),
  combatant({
    id: "barak",
    name: "Barak",
    alignment: "good",
    epithet: "Commander with Deborah",
    description:
      "Barak led Israel's fighters at Deborah's word. He would not go to Mount Tabor unless she went with him.",
    references: ["Judges 4:6-14"],
    maxHp: 102,
    attack: 13,
    defense: 7,
    abilities: [
      ability("barak-descent", "Down from Tabor", "strike", 13, "Ten thousand follow him off the mountain."),
      ability("barak-rout", "Rout of the Chariots", "strike", 12, "Sisera's chariots give way."),
      ability("barak-heal", "Shared Command", "heal", 14, "He draws strength from the prophet beside him."),
    ],
  }),
  combatant({
    id: "jael",
    name: "Jael",
    alignment: "good",
    epithet: "Of the Kenites",
    description:
      "Jael received the fleeing Sisera into her tent. He did not leave alive. The Song of Deborah calls her blessed among women.",
    references: ["Judges 4:17-22", "Judges 5:24-27"],
    maxHp: 88,
    attack: 15,
    defense: 5,
    abilities: [
      ability("jael-tent", "Courage in the Tent", "strike", 16, "She acts while the commander sleeps, and he does not rise."),
      ability("jael-blessed", "Blessed among Women", "strike", 12, "The song honors the deed that ended the pursuit."),
      ability("jael-heal", "Milk and a Moment", "heal", 12, "A brief calm before she chooses her side."),
    ],
  }),
  combatant({
    id: "gideon",
    name: "Gideon",
    alignment: "good",
    epithet: "Judge with three hundred",
    description:
      "Gideon thought himself the least in his family. With three hundred men, trumpets, and torches, he watched the Midianite camp fall into confusion.",
    references: ["Judges 6:11-16", "Judges 7:19-22"],
    maxHp: 96,
    attack: 13,
    defense: 7,
    abilities: [
      ability("gideon-torches", "Trumpets and Torches", "strike", 14, "Jars break, torches blaze, and the camp panics."),
      ability("gideon-three", "Three Hundred", "strike", 11, "The Lord thins the army so the victory is clearly his."),
      ability("gideon-heal", "Fleece and Fire", "heal", 15, "The signs he asked for settle his fear."),
    ],
  }),
  combatant({
    id: "samson",
    name: "Samson",
    alignment: "good",
    epithet: "Nazirite judge",
    description:
      "Samson's strength was tied to his Nazirite vow. After Delilah's betrayal he was blinded, and he prayed for strength one last time.",
    references: ["Judges 13:5", "Judges 16:28-30"],
    maxHp: 124,
    attack: 16,
    defense: 8,
    abilities: [
      ability("samson-gates", "Gates of Gaza", "strike", 13, "He lifts what shut him in and carries it away."),
      ability("samson-prayer", "Final Prayer", "strike", 16, "He asks the Lord to remember him and strengthen him once more."),
      ability("samson-heal", "Nazirite Vow", "heal", 16, "The vow is the source of his strength, not the boast."),
    ],
  }),
  story({
    id: "ruth",
    name: "Ruth",
    epithet: "Of Moab, of Bethlehem",
    description:
      "Ruth stayed with Naomi and made Naomi's people and God her own. In Bethlehem she became part of David's line.",
    references: ["Ruth 1:16", "Ruth 4:13-17"],
  }),
  combatant({
    id: "jonathan-saul",
    name: "Jonathan, son of Saul",
    alignment: "good",
    epithet: "Prince and friend of David",
    description:
      "Jonathan climbed to a Philistine outpost with his armor-bearer, trusting that the Lord could save by many or by few. He loved David and protected him.",
    references: ["1 Samuel 14:6-14", "1 Samuel 18:1-4"],
    maxHp: 98,
    attack: 14,
    defense: 6,
    abilities: [
      ability("jonathan-climb", "Climb at Michmash", "strike", 14, "A steep path, and a trust that numbers are not the point."),
      ability("jonathan-few", "By Many or by Few", "strike", 12, "Nothing hinders the Lord from saving either way."),
      ability("jonathan-heal", "Covenant Friendship", "heal", 14, "The bond with David gives him a reason to stand."),
    ],
  }),
  combatant({
    id: "david",
    name: "David",
    alignment: "good",
    epithet: "Shepherd and king",
    description:
      "David faced Goliath with a sling and five stones, in the name of the Lord of hosts. He refused Saul's armor and used the tools he knew.",
    references: ["1 Samuel 17:40-50"],
    maxHp: 92,
    attack: 15,
    defense: 6,
    abilities: [
      ability("david-sling", "Shepherd's Sling", "strike", 15, "A stone from the wadi, slung in the Lord's name."),
      ability("david-name", "In the Lord's Name", "strike", 13, "He answers the mockery by naming the God of Israel's armies."),
      ability("david-heal", "Quiet Trust", "heal", 16, "He remembers the lion and the bear, and is not shaken."),
    ],
  }),
  story({
    id: "solomon",
    name: "Solomon",
    epithet: "King who asked for wisdom",
    description:
      "Solomon asked for a listening heart to govern the people. The book of Wisdom, read in the Church, prays in that same key.",
    references: ["1 Kings 3:5-14", "Wisdom 9"],
  }),
  combatant({
    id: "elijah",
    name: "Elijah",
    alignment: "good",
    epithet: "Prophet of Carmel",
    description:
      "On Mount Carmel Elijah challenged the prophets of Baal. Fire fell on his offering, and the people saw whose God answers.",
    references: ["1 Kings 18:20-39"],
    maxHp: 100,
    attack: 15,
    defense: 7,
    abilities: [
      ability("elijah-fire", "Fire from Heaven", "strike", 16, "The Lord answers by fire, and the offering is consumed."),
      ability("elijah-altar", "Altar of Twelve Stones", "strike", 12, "He repairs the Lord's altar before he prays."),
      ability("elijah-heal", "Prayer on Carmel", "heal", 16, "A short, earnest prayer after the long taunts."),
    ],
  }),
  combatant({
    id: "elisha",
    name: "Elisha",
    alignment: "good",
    epithet: "Prophet who spared an army",
    description:
      "When an Aramean army came to seize Elisha, he prayed they would be dazzled, led them to Samaria, and told the king to feed them rather than kill them.",
    references: ["2 Kings 6:15-23"],
    maxHp: 96,
    attack: 11,
    defense: 8,
    abilities: [
      ability("elisha-dazzle", "Open His Eyes", "strike", 12, "The servant sees the hills full of horses and chariots of fire."),
      ability("elisha-guard", "Dazzled Army", "guard", 11, "Elisha asks that the raiders be blinded to their errand."),
      ability("elisha-heal", "A Table in Samaria", "heal", 18, "He sets food before enemies and sends them home."),
    ],
  }),
  story({
    id: "baruch",
    name: "Baruch",
    epithet: "Scribe of Jeremiah",
    description:
      "Baruch wrote for Jeremiah and stood with him. The book of Baruch calls exiles to repentance and speaks hope to a scattered people.",
    references: ["Jeremiah 36:4", "Baruch 1", "Baruch 4"],
  }),
  combatant({
    id: "three-young-men",
    name: "Hananiah, Mishael, and Azariah",
    alignment: "good",
    epithet: "The three in the furnace",
    description:
      "Also called Shadrach, Meshach, and Abednego, they refused the golden statue and were thrown into the furnace. A fourth figure walked with them, and the fire did not master them. Catholic Bibles include their prayer and canticle in Daniel 3.",
    references: ["Daniel 3"],
    maxHp: 104,
    attack: 11,
    defense: 11,
    abilities: [
      ability("three-refuse", "We Will Not Serve", "strike", 12, "They will not worship the statue, whatever the furnace costs."),
      ability("three-guard", "Fourth in the Fire", "guard", 12, "One like a son of God walks with them in the flame."),
      ability("three-heal", "Song of the Three", "heal", 18, "The canticle preserved in Daniel 3 rises from the furnace."),
    ],
  }),
  combatant({
    id: "daniel",
    name: "Daniel",
    alignment: "good",
    epithet: "Exile and seer",
    description:
      "Daniel served in Babylon, kept his prayer when it was outlawed, and was kept safe among the lions. In the Greek additions he exposes the idol Bel and the dragon the people worshiped.",
    references: ["Daniel 6", "Daniel 14"],
    maxHp: 98,
    attack: 13,
    defense: 8,
    abilities: [
      ability("daniel-lions", "Among the Lions", "strike", 12, "The den is shut, and he is found whole in the morning."),
      ability("daniel-idol", "The Idol Exposed", "strike", 14, "He shows that Bel does not eat, and that the dragon is no god."),
      ability("daniel-heal", "Windows toward Jerusalem", "heal", 16, "He prays as before, facing the holy city."),
    ],
  }),
  story({
    id: "susanna",
    name: "Susanna",
    epithet: "Vindicated in Babylon",
    description:
      "Susanna refused two corrupt elders, was falsely accused, and was cleared when Daniel questioned the men apart. Her story is Daniel 13 in Catholic Bibles.",
    references: ["Daniel 13"],
  }),
  combatant({
    id: "esther",
    name: "Esther",
    alignment: "good",
    epithet: "Queen of Persia",
    description:
      "Esther risked her life to plead for her people before the king. Haman's plot failed. The Greek additions to Esther preserve her prayer.",
    references: ["Esther 4:16", "Esther 7:3-10"],
    maxHp: 90,
    attack: 12,
    defense: 7,
    abilities: [
      ability("esther-approach", "If I Perish", "strike", 14, "She goes to the king unbidden, accepting the risk."),
      ability("esther-plea", "Plea for Her People", "strike", 12, "She names Haman's plot in the banquet hall."),
      ability("esther-heal", "Fast of the Queen", "heal", 16, "She asks the city to fast with her before she goes."),
    ],
  }),
  combatant({
    id: "mordecai",
    name: "Mordecai",
    alignment: "good",
    epithet: "Cousin of Esther",
    description:
      "Mordecai refused to bow to Haman, uncovered a plot against the king, and urged Esther to speak for her people.",
    references: ["Esther 2:21-23", "Esther 4:13-14"],
    maxHp: 94,
    attack: 11,
    defense: 8,
    abilities: [
      ability("mordecai-gate", "Watch at the Gate", "strike", 11, "He hears a plot and sends word in time."),
      ability("mordecai-guard", "Sackcloth and a Charge", "guard", 10, "He will not bow, and he will not let Esther stay silent."),
      ability("mordecai-heal", "For Such a Time", "heal", 16, "He tells Esther she may have come to the throne for this."),
    ],
  }),
  combatant({
    id: "judith",
    name: "Judith",
    alignment: "good",
    epithet: "Widow of Bethulia",
    description:
      "Judith rebuked the elders who would hand the town over, prayed, and went into the camp of Holofernes. Bethulia was delivered.",
    references: ["Judith 8", "Judith 13"],
    maxHp: 96,
    attack: 15,
    defense: 6,
    abilities: [
      ability("judith-prayer", "Prayer before the Act", "heal", 16, "She asks God to see the pride of the invaders."),
      ability("judith-nerve", "Steady Nerve", "strike", 13, "She walks into the camp with a plan and a calm face."),
      ability("judith-deliver", "Deliverance of Bethulia", "strike", 16, "The general falls, and the town is saved."),
    ],
  }),
  combatant({
    id: "tobias",
    name: "Tobias",
    alignment: "good",
    epithet: "Son of Tobit",
    description:
      "Tobias travels with Raphael, catches a fish in the Tigris, marries Sarah, and returns with medicine for his father's eyes.",
    references: ["Tobit 6", "Tobit 11"],
    maxHp: 90,
    attack: 12,
    defense: 6,
    abilities: [
      ability("tobias-fish", "Fish of the Tigris", "strike", 13, "He keeps the heart, liver, and gall as Raphael taught him."),
      ability("tobias-wedding", "Wedding Prayer", "heal", 16, "He and Sarah pray on the wedding night, and the threat passes."),
      ability("tobias-home", "Gall for His Father", "strike", 11, "He anoints Tobit's eyes, and the old man sees his son."),
    ],
  }),
  combatant({
    id: "mattathias",
    name: "Mattathias",
    alignment: "good",
    epithet: "Priest of Modein",
    description:
      "Mattathias refused the king's sacrifice at Modein and called everyone zealous for the law to follow him into the hills.",
    references: ["1 Maccabees 2:15-28"],
    maxHp: 100,
    attack: 13,
    defense: 8,
    abilities: [
      ability("mattathias-refuse", "Refusal at Modein", "strike", 14, "He will not offer the forbidden sacrifice."),
      ability("mattathias-call", "Zealous for the Law", "strike", 12, "His cry gathers those who will not abandon the covenant."),
      ability("mattathias-heal", "Father's Blessing", "heal", 14, "Before he dies he charges his sons to show courage."),
    ],
  }),
  combatant({
    id: "judas-maccabeus",
    name: "Judas Maccabeus",
    alignment: "good",
    epithet: "Leader of the revolt",
    description:
      "Judas took command after Mattathias, defeated the king's commanders, and cleansed and rededicated the temple.",
    references: ["1 Maccabees 3:1-9", "1 Maccabees 4:36-59"],
    maxHp: 110,
    attack: 16,
    defense: 8,
    abilities: [
      ability("judas-hammer", "Hammer of the Revolt", "strike", 15, "He strikes the armies sent to crush Judea."),
      ability("judas-temple", "Cleansing of the Temple", "strike", 13, "The sanctuary is purified and the lamps lit again."),
      ability("judas-heal", "Camp Prayer", "heal", 16, "He asks the Lord to look on the oppressed people."),
    ],
  }),
  combatant({
    id: "jonathan-maccabeus",
    name: "Jonathan Maccabeus",
    alignment: "good",
    epithet: "Brother of Judas",
    description:
      "After Judas fell, Jonathan led the people and won room for Judea among the surrounding powers.",
    references: ["1 Maccabees 9:28-31", "1 Maccabees 12:1-4"],
    maxHp: 104,
    attack: 14,
    defense: 7,
    abilities: [
      ability("jonathan-mac-lead", "After His Brother", "strike", 13, "The people ask him to take Judas's place."),
      ability("jonathan-mac-treaty", "Word among Nations", "strike", 11, "He seeks allies so the small nation can stand."),
      ability("jonathan-mac-heal", "Hold the Hills", "heal", 15, "He keeps the fighters together in the wilderness."),
    ],
  }),
  combatant({
    id: "eleazar-avaran",
    name: "Eleazar Avaran",
    alignment: "good",
    epithet: "Brother of Judas",
    description:
      "Eleazar Avaran, a brother of Judas, charged a royal elephant he believed carried the king, and he did not return.",
    references: ["1 Maccabees 6:43-46"],
    maxHp: 108,
    attack: 15,
    defense: 7,
    abilities: [
      ability("eleazar-charge", "Bold Charge", "strike", 16, "He runs into the thick of the royal line."),
      ability("eleazar-name", "A Name for His People", "strike", 12, "He wants to leave a deed the people will remember."),
      ability("eleazar-heal", "Brother's Zeal", "heal", 12, "The same zeal Mattathias planted still burns."),
    ],
  }),
  story({
    id: "joseph",
    name: "Joseph of Nazareth",
    epithet: "Husband of Mary",
    description:
      "Joseph, a just man, took Mary into his home and guarded the child. He led them to Egypt and later back to Nazareth.",
    references: ["Matthew 1:18-25", "Matthew 2:13-23"],
  }),
  story({
    id: "mary",
    name: "Mary",
    epithet: "Mother of Jesus",
    description:
      "Mary consented to God's word at the Annunciation and sang the Magnificat. She is honored in this roster as the mother of the Lord, and she is not sent into battle.",
    references: ["Luke 1:26-38", "Luke 1:46-55"],
    tone: "honored",
  }),
  story({
    id: "jesus",
    name: "Jesus Christ",
    epithet: "Son of God, Lord of the Gospel",
    description:
      "Jesus Christ is the heart of the Christian Scriptures: his birth, teaching, healing, death on the cross, and resurrection fill the Gospels. Christian reading hears the promise of Genesis 3:15 fulfilled in him. He is honored here and kept out of the battle system.",
    references: ["Genesis 3:15", "Luke 2", "Mark 15", "Luke 24", "John 20"],
    tone: "honored",
  }),
  story({
    id: "john-the-baptist",
    name: "John the Baptist",
    epithet: "Voice in the wilderness",
    description:
      "John prepared the way and baptized Jesus. Herod Antipas imprisoned him, and Mark 6 tells of his death. He is remembered here as a witness, not as a fighter.",
    references: ["Luke 1:13-17", "Mark 1:4-11", "Mark 6:17-29"],
  }),
  story({
    id: "peter",
    name: "Peter",
    epithet: "Apostle",
    description:
      "Peter confessed Jesus as the Christ, failed in the courtyard, was restored, and preached at Pentecost. He belongs to the story of the Church, not to the battle list.",
    references: ["Matthew 16:16-18", "John 21:15-19", "Acts 2:14"],
  }),
  story({
    id: "paul",
    name: "Paul",
    epithet: "Apostle to the nations",
    description:
      "Paul persecuted the Church until the road to Damascus turned him around. He later wrote of the armor of God as a picture of faith, not as a call to fight people.",
    references: ["Acts 9:1-19", "Ephesians 6:11-17"],
  }),
  story({
    id: "mary-magdalene",
    name: "Mary Magdalene",
    epithet: "Witness of the resurrection",
    description:
      "Mary Magdalene followed Jesus, was delivered from seven demons, and in John's Gospel is the first to meet him risen.",
    references: ["Luke 8:2", "John 20:11-18"],
  }),

  combatant({
    id: "satan",
    name: "Satan, the Ancient Serpent",
    alignment: "evil",
    epithet: "The dragon of Revelation",
    description:
      "Genesis tells of a serpent who deceived the first humans. Revelation names the dragon as that ancient serpent, called the Devil and Satan, and describes Michael's war against him.",
    references: ["Genesis 3:1-6", "Genesis 3:15", "Revelation 12:7-9"],
    maxHp: 124,
    attack: 15,
    defense: 9,
    abilities: [
      ability("satan-lie", "Ancient Lie", "strike", 12, "A twisted question meant to unmake trust."),
      ability("satan-pride", "Pride's Weight", "strike", 13, "The will to be above every gift."),
      ability("satan-guard", "Coiling Dark", "guard", 8, "He twists aside and strikes again."),
    ],
  }),
  combatant({
    id: "cain",
    name: "Cain",
    alignment: "evil",
    epithet: "Who turned on his brother",
    description:
      "Cain killed his brother Abel and was sent away from the ground he had farmed. The story is told with grief, not as a boast.",
    references: ["Genesis 4:3-12"],
    maxHp: 86,
    attack: 12,
    defense: 5,
    abilities: [
      ability("cain-turn", "Turning Away", "strike", 11, "Anger he will not master."),
      ability("cain-ground", "Restless Ground", "strike", 10, "The soil no longer answers him."),
      ability("cain-guard", "Mark of Exile", "guard", 7, "He goes out from the Lord's presence."),
    ],
  }),
  combatant({
    id: "chedorlaomer",
    name: "Chedorlaomer",
    alignment: "evil",
    epithet: "King of Elam",
    description:
      "Chedorlaomer and allied kings defeated the cities of the plain and carried off Lot. Abraham pursued them and brought the captives back.",
    references: ["Genesis 14:1-16"],
    maxHp: 100,
    attack: 13,
    defense: 7,
    abilities: [
      ability("chedor-raid", "Raid of the Kings", "strike", 12, "Four kings sweep the cities of the plain."),
      ability("chedor-captive", "Captives Taken", "strike", 10, "Lot is among those led away."),
      ability("chedor-guard", "Allied Shields", "guard", 7, "The kings stand together on the field."),
    ],
  }),
  combatant({
    id: "pharaoh",
    name: "Pharaoh of the Exodus",
    alignment: "evil",
    epithet: "King of Egypt",
    description:
      "Scripture does not name this Pharaoh. He refused to let Israel go, through plague after plague, until the sea closed on his chariots.",
    references: ["Exodus 5:1-2", "Exodus 14:5-9", "Exodus 14:26-28"],
    maxHp: 114,
    attack: 14,
    defense: 8,
    abilities: [
      ability("pharaoh-refuse", "Hardened Refusal", "strike", 12, "He will not let the people go."),
      ability("pharaoh-chariots", "Chariots in Pursuit", "strike", 13, "He regrets their leaving and chases them to the sea."),
      ability("pharaoh-guard", "Throne of Egypt", "guard", 8, "The power of the palace, for a time."),
    ],
  }),
  combatant({
    id: "magicians-of-egypt",
    name: "The Magicians of Egypt",
    alignment: "evil",
    epithet: "Pharaoh's wonder-workers",
    description:
      "Pharaoh's magicians opposed Moses and Aaron. They copied the first signs, until Aaron's staff swallowed theirs and they could no longer keep up.",
    references: ["Exodus 7:10-12", "Exodus 8"],
    maxHp: 72,
    attack: 9,
    defense: 4,
    abilities: [
      ability("magicians-copy", "Copied Sign", "strike", 8, "They imitate the wonder, for a moment."),
      ability("magicians-secret", "Secret Arts", "strike", 9, "The arts of the court, empty against the Lord."),
      ability("magicians-guard", "Court Smoke", "guard", 5, "A show of power that thins quickly."),
    ],
  }),
  combatant({
    id: "og",
    name: "Og of Bashan",
    alignment: "evil",
    epithet: "King of the Rephaim",
    description:
      "Og, king of Bashan, came out to battle Israel at Edrei. Moses records his defeat and the great size of his iron bed.",
    references: ["Numbers 21:33-35", "Deuteronomy 3:1-11"],
    maxHp: 128,
    attack: 15,
    defense: 9,
    abilities: [
      ability("og-edrei", "Advance at Edrei", "strike", 12, "He and his army march out to the fight."),
      ability("og-rephaim", "Last of the Rephaim", "strike", 13, "A giant king, and still not beyond the Lord's reach."),
      ability("og-guard", "Iron Bed", "guard", 8, "The fame of his strength, told to the next generation."),
    ],
  }),
  combatant({
    id: "king-of-jericho",
    name: "The King of Jericho",
    alignment: "evil",
    epithet: "Unnamed in the text",
    description:
      "Jericho was shut tight against Israel. Scripture tells of the city's king without recording his personal name. The walls fell after the ark and the trumpets.",
    references: ["Joshua 6:1-5", "Joshua 6:20"],
    maxHp: 96,
    attack: 11,
    defense: 8,
    abilities: [
      ability("jericho-shut", "City Shut Tight", "guard", 9, "No one goes out and no one comes in."),
      ability("jericho-wall", "High Wall", "strike", 10, "The rampart that looks impossible."),
      ability("jericho-watch", "Watchmen", "strike", 9, "Guards on a wall that will not stand."),
    ],
  }),
  combatant({
    id: "sisera",
    name: "Sisera",
    alignment: "evil",
    epithet: "Commander of the chariots",
    description:
      "Sisera commanded the army of Jabin of Hazor, nine hundred iron chariots. He fled on foot after the rout and died in Jael's tent.",
    references: ["Judges 4:2-3", "Judges 4:15-22"],
    maxHp: 108,
    attack: 14,
    defense: 7,
    abilities: [
      ability("sisera-chariots", "Iron Chariots", "strike", 12, "The chariots that oppressed Israel for twenty years."),
      ability("sisera-flight", "Flight on Foot", "strike", 10, "When the army breaks, he runs."),
      ability("sisera-guard", "Captain's Helm", "guard", 7, "A commander's confidence, about to fail."),
    ],
  }),
  combatant({
    id: "zebah",
    name: "Zebah",
    alignment: "evil",
    epithet: "King of Midian",
    description:
      "Zebah and Zalmunna were kings of Midian. After the night battle, Gideon pursued them across the Jordan.",
    references: ["Judges 8"],
    maxHp: 100,
    attack: 13,
    defense: 6,
    abilities: [
      ability("zebah-camp", "Midianite Camp", "strike", 11, "Camels and raiders spread across the valley."),
      ability("zebah-flight", "Flight beyond the Jordan", "strike", 10, "The kings run, and Gideon follows."),
      ability("zebah-guard", "Paired Kings", "guard", 7, "Zebah and Zalmunna still have their guard."),
    ],
  }),
  combatant({
    id: "delilah",
    name: "Delilah",
    alignment: "evil",
    epithet: "Who learned the secret",
    description:
      "Delilah pressed Samson until he told her the secret of his strength, then called the Philistine lords. The battle here is a picture of that betrayal and of the strength he later prayed to receive again.",
    references: ["Judges 16:4-21", "Judges 16:28"],
    maxHp: 78,
    attack: 12,
    defense: 4,
    abilities: [
      ability("delilah-press", "Wheedling Persistence", "strike", 11, "Day after day she asks for the secret."),
      ability("delilah-secret", "The Secret Drawn Out", "strike", 12, "He tells her at last, and the vow is broken."),
      ability("delilah-guard", "Philistine Silver", "guard", 6, "The lords have promised her payment."),
    ],
  }),
  combatant({
    id: "philistine-garrison",
    name: "The Philistine Garrison",
    alignment: "evil",
    epithet: "Outpost near Michmash",
    description:
      "A Philistine outpost watched the pass near Michmash. Jonathan and his armor-bearer climbed up to it.",
    references: ["1 Samuel 14:1-14"],
    maxHp: 90,
    attack: 12,
    defense: 6,
    abilities: [
      ability("garrison-crag", "Crag Watch", "strike", 10, "They taunt the climbers from the rocks."),
      ability("garrison-spears", "Outpost Spears", "strike", 11, "A garrison sure of its height."),
      ability("garrison-guard", "Rocky Hold", "guard", 7, "The cliff itself is their shield."),
    ],
  }),
  combatant({
    id: "philistine-lords",
    name: "The Philistine Lords",
    alignment: "evil",
    epithet: "Gathered in the hall",
    description:
      "The lords of the Philistines gathered to sacrifice and to mock the captured Samson. Judges 16 tells how the hall came down when his strength returned.",
    references: ["Judges 16:23-30"],
    maxHp: 110,
    attack: 14,
    defense: 7,
    abilities: [
      ability("lords-mock", "Mockery in the Hall", "strike", 11, "They call for the prisoner to amuse them."),
      ability("lords-pillars", "Pillars of the House", "strike", 12, "The feast rests on columns that will not hold."),
      ability("lords-guard", "Five Lords", "guard", 7, "The rulers of the five cities sit in state."),
    ],
  }),
  combatant({
    id: "goliath",
    name: "Goliath",
    alignment: "evil",
    epithet: "Champion of Gath",
    description:
      "Goliath of Gath came out morning and evening to defy the ranks of Israel. David answered him with a sling.",
    references: ["1 Samuel 17:4-11", "1 Samuel 17:41-50"],
    maxHp: 132,
    attack: 16,
    defense: 8,
    abilities: [
      ability("goliath-defy", "Forty Days of Defiance", "strike", 12, "The champion repeats his challenge."),
      ability("goliath-spear", "Bronze Spear", "strike", 13, "A shaft like a weaver's beam."),
      ability("goliath-guard", "Scale Armor", "guard", 8, "Bronze from helmet to greave."),
    ],
  }),
  combatant({
    id: "ahab",
    name: "Ahab",
    alignment: "evil",
    epithet: "King of Israel",
    description:
      "Ahab did evil and married Jezebel. He coveted Naboth's vineyard and let Naboth be killed for it. He is in the roster so a later level can use him; a starter win would flatten a long story.",
    references: ["1 Kings 16:30-33", "1 Kings 21:1-16"],
    maxHp: 96,
    attack: 11,
    defense: 6,
    abilities: [
      ability("ahab-ivory", "Ivory House", "guard", 7, "A fine palace, and a weak conscience."),
      ability("ahab-field", "Coveted Field", "strike", 11, "He sulks until he gets what is not his."),
      ability("ahab-consent", "Weak Consent", "strike", 10, "He lets Jezebel do what he wants done."),
    ],
  }),
  combatant({
    id: "jezebel",
    name: "Jezebel",
    alignment: "evil",
    epithet: "Queen who fed the prophets of Baal",
    description:
      "Jezebel promoted the worship of Baal, opposed Elijah, and arranged Naboth's death by false letters. Elijah fled her threat; her end is told later, under Jehu. She is ready for a level that can tell that honestly.",
    references: ["1 Kings 18:4", "1 Kings 19:1-3", "1 Kings 21:5-15", "2 Kings 9"],
    maxHp: 90,
    attack: 13,
    defense: 5,
    abilities: [
      ability("jezebel-letters", "False Letters", "strike", 13, "She writes in the king's name and seals the lie."),
      ability("jezebel-baal", "Table of Baal", "strike", 11, "She feeds hundreds of prophets of a god who does not answer."),
      ability("jezebel-guard", "Palace Threat", "guard", 6, "A queen's anger that sends a prophet running."),
    ],
  }),
  combatant({
    id: "prophets-of-baal",
    name: "The Prophets of Baal",
    alignment: "evil",
    epithet: "At Mount Carmel",
    description:
      "Hundreds of prophets of Baal cried out on Carmel from morning until evening. There was no voice and no answer.",
    references: ["1 Kings 18:19-29"],
    maxHp: 108,
    attack: 12,
    defense: 5,
    abilities: [
      ability("baal-cry", "Cries till Evening", "strike", 11, "They shout and dance, and nothing answers."),
      ability("baal-blades", "Limping Dance", "strike", 10, "A long ritual around a silent altar."),
      ability("baal-guard", "Number of Prophets", "guard", 6, "There are many of them, and still no fire."),
    ],
  }),
  combatant({
    id: "army-of-aram",
    name: "The Army of Aram",
    alignment: "evil",
    epithet: "Sent to seize Elisha",
    description:
      "The king of Aram sent horses and chariots to Dothan to capture Elisha. They were dazzled, led into Samaria, fed, and sent home.",
    references: ["2 Kings 6:13-23"],
    maxHp: 100,
    attack: 12,
    defense: 6,
    abilities: [
      ability("aram-night", "Night March on Dothan", "strike", 11, "The town is surrounded by morning."),
      ability("aram-king", "The King's Order", "strike", 10, "They came to take one prophet."),
      ability("aram-guard", "Chariot Screen", "guard", 7, "Horses and chariots ring the city."),
    ],
  }),
  combatant({
    id: "nebuchadnezzar",
    name: "Nebuchadnezzar",
    alignment: "evil",
    epithet: "King of Babylon",
    description:
      "Nebuchadnezzar took Judah into exile and ordered the furnace for the three who would not bow. Daniel 4 tells how he was later humbled and came to honor the Most High. The battle pictures the furnace, not his death.",
    references: ["Daniel 1:1-2", "Daniel 3", "Daniel 4"],
    maxHp: 116,
    attack: 13,
    defense: 8,
    abilities: [
      ability("nebu-statue", "Golden Statue", "strike", 11, "He demands worship of the image he set up."),
      ability("nebu-furnace", "Heat the Furnace", "strike", 13, "The fire is raised seven times over."),
      ability("nebu-guard", "Crown of Babylon", "guard", 8, "An empire's pride, soon to be humbled."),
    ],
  }),
  combatant({
    id: "dragon-of-babylon",
    name: "The Dragon of Babylon",
    alignment: "evil",
    epithet: "Worshiped as a god",
    description:
      "In the Greek addition called Bel and the Dragon, the people of Babylon worship a great dragon. Daniel shows that it is no god. This is not the dragon of Revelation.",
    references: ["Daniel 14"],
    maxHp: 104,
    attack: 14,
    defense: 6,
    abilities: [
      ability("babylon-dragon-awe", "Worshiped Beast", "strike", 12, "The crowd believes the creature is divine."),
      ability("babylon-dragon-breath", "Living Idol", "strike", 11, "It eats and moves, and still it is not God."),
      ability("babylon-dragon-guard", "Temple Honor", "guard", 6, "Priests and people guard its reputation."),
    ],
  }),
  combatant({
    id: "haman",
    name: "Haman",
    alignment: "evil",
    epithet: "Plotter against the Jews",
    description:
      "Haman, raised high in the Persian court, plotted to destroy the Jewish people because Mordecai would not bow. His plot collapsed on him.",
    references: ["Esther 3:1-11", "Esther 7:9-10"],
    maxHp: 98,
    attack: 13,
    defense: 5,
    abilities: [
      ability("haman-lot", "The Lot Called Pur", "strike", 12, "He casts the lot for a day of destruction."),
      ability("haman-gallows", "Gallows for Mordecai", "strike", 11, "He builds a tall gallows in his pride."),
      ability("haman-guard", "Royal Favor", "guard", 6, "The king's ring, for as long as the king is deceived."),
    ],
  }),
  combatant({
    id: "holofernes",
    name: "Holofernes",
    alignment: "evil",
    epithet: "General in the book of Judith",
    description:
      "Holofernes is the chief general sent to punish the western peoples in the book of Judith. He camps against Bethulia and falls there.",
    references: ["Judith 2", "Judith 13"],
    maxHp: 118,
    attack: 15,
    defense: 7,
    abilities: [
      ability("holofernes-siege", "Siege of Bethulia", "strike", 12, "He cuts off the spring and waits for thirst to win."),
      ability("holofernes-boast", "Boast of the Camp", "strike", 13, "He trusts his army and his tent."),
      ability("holofernes-guard", "Assyrian Guard", "guard", 8, "A general's screen of soldiers."),
    ],
  }),
  combatant({
    id: "antiochus-iv",
    name: "Antiochus IV Epiphanes",
    alignment: "evil",
    epithet: "Seleucid persecutor",
    description:
      "Antiochus IV banned Jewish practice, looted the temple, and set up a desolating sacrifice. He died away from Judea. The battle pictures the revolt against his persecution, not a duel that killed him.",
    references: ["1 Maccabees 1:10", "1 Maccabees 1:41-50", "1 Maccabees 6", "2 Maccabees 9"],
    maxHp: 120,
    attack: 15,
    defense: 8,
    abilities: [
      ability("antiochus-decree", "Decree against the Law", "strike", 13, "He forbids circumcision, Sabbath, and sacrifice."),
      ability("antiochus-altar", "Desolating Sacrifice", "strike", 12, "An altar is raised over the altar of the Lord."),
      ability("antiochus-guard", "Royal Army", "guard", 8, "The king's forces occupy the land."),
    ],
  }),
  combatant({
    id: "nicanor",
    name: "Nicanor",
    alignment: "evil",
    epithet: "General against Judea",
    description:
      "Nicanor was sent against Judea and threatened the temple. Judas defeated him, and the day was kept with joy.",
    references: ["1 Maccabees 7"],
    maxHp: 112,
    attack: 14,
    defense: 7,
    abilities: [
      ability("nicanor-threat", "Threat against the Temple", "strike", 12, "He stretches out his hand against the sanctuary."),
      ability("nicanor-host", "Hired Host", "strike", 11, "A large force marches to Beth-horon."),
      ability("nicanor-guard", "General's Guard", "guard", 7, "Armor around a man who will not listen."),
    ],
  }),
  combatant({
    id: "asmodeus",
    name: "Asmodeus",
    alignment: "evil",
    epithet: "Demon in the book of Tobit",
    description:
      "Asmodeus had killed seven husbands of Sarah on their wedding nights. Raphael binds him, and Sarah is free.",
    references: ["Tobit 3:8", "Tobit 8:1-3"],
    maxHp: 114,
    attack: 15,
    defense: 7,
    abilities: [
      ability("asmodeus-night", "Wedding-Night Terror", "strike", 13, "A jealous demon who will not let Sarah live in peace."),
      ability("asmodeus-grip", "Sevenfold Grief", "strike", 12, "The sorrow of seven burials."),
      ability("asmodeus-guard", "Clinging Shade", "guard", 7, "He holds on until Raphael binds him."),
    ],
  }),
  combatant({
    id: "herod",
    name: "Herod the Great",
    alignment: "evil",
    epithet: "King in Jerusalem",
    description:
      "Herod the Great feared the child born king of the Jews and is remembered for the slaughter of the infants of Bethlehem. No starter battle casts a hero against that crime. He can be added later with care.",
    references: ["Matthew 2:1-8", "Matthew 2:16-18"],
    maxHp: 102,
    attack: 12,
    defense: 8,
    abilities: [
      ability("herod-fear", "Royal Suspicion", "strike", 12, "News of a newborn king unsettles the palace."),
      ability("herod-guard", "Palace Guard", "guard", 8, "Soldiers at a nervous king's command."),
      ability("herod-decree", "Decree of Fear", "strike", 11, "A frightened ruler reaches for force."),
    ],
  }),
  combatant({
    id: "judas-iscariot",
    name: "Judas Iscariot",
    alignment: "evil",
    epithet: "The disciple who betrayed Jesus",
    description:
      "Judas Iscariot arranged to hand Jesus over and led the arresting party to him. The Gospels tell it soberly. He is not a boss in the starter stories, because Jesus is not a combatant here.",
    references: ["Matthew 26:14-16", "Matthew 26:47-50", "Acts 1:15-20"],
    maxHp: 84,
    attack: 13,
    defense: 4,
    abilities: [
      ability("iscariot-plot", "Secret Plot", "strike", 12, "He goes to the chief priests in the dark."),
      ability("iscariot-sign", "The Arranged Sign", "strike", 11, "A kiss marks the one they should seize."),
      ability("iscariot-guard", "Hardened Heart", "guard", 5, "He stays with the plan he has made."),
    ],
  }),
];

const byId = new Map(CHARACTERS.map((character) => [character.id, character]));

export function findCharacter(id: string): Character | undefined {
  return byId.get(id);
}

export function getCharacter(id: string): Character {
  const found = findCharacter(id);
  if (!found) {
    throw new Error(`Unknown character: ${id}`);
  }
  return found;
}

export function charactersByAlignment(alignment: Alignment): Character[] {
  return CHARACTERS.filter((character) => character.alignment === alignment);
}
