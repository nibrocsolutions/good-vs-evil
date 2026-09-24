import { getCharacter } from "./characters";
import type { Level } from "../types";

/**
 * Starter story levels, in unlock order. Completing a level unlocks the next.
 * Battles are short dramatizations: the victory text carries the biblical outcome.
 */
export const LEVELS: Level[] = [
  {
    id: "creation-and-the-fall",
    order: 1,
    title: "Creation and the Fall",
    intro:
      "God makes the world and calls it good. A serpent questions that goodness, and the first humans turn from the command they were given. Humanity falls. Christian faith reads Genesis 3:15 as a promise that the serpent will not have the last word. Revelation later names the dragon as that ancient serpent. In this opening battle you stand with Michael, picturing that promise. It is not a claim that Eden ended in a human victory.",
    victoryText:
      "The promise stands. Evil is answered, and the last word belongs to God. The story of the Fall itself remains a human defeat, and the hope in Genesis 3:15 looks ahead.",
    defeatText:
      "The serpent's question still hangs in the air. Take a breath and try the stand again.",
    references: ["Genesis 1", "Genesis 3", "Revelation 12:9"],
    playableIds: ["michael"],
    enemyIds: ["satan"],
  },
  {
    id: "rescue-of-lot",
    order: 2,
    title: "The Rescue of Lot",
    intro:
      "Raiders led by Chedorlaomer sweep the cities of the plain and carry Lot away. Abraham arms his household, pursues by night, and brings the captives home. He then blesses God Most High and refuses to take a reward from the king of Sodom.",
    victoryText:
      "Lot is free. Abraham gives the glory to God Most High and goes home without the plunder.",
    defeatText: "The raiders still hold the road. Gather the household and ride again.",
    references: ["Genesis 14"],
    playableIds: ["abraham"],
    enemyIds: ["chedorlaomer"],
  },
  {
    id: "moses-and-pharaoh",
    order: 3,
    title: "Moses and Pharaoh",
    intro:
      "From the burning bush the Lord sends Moses, with Aaron beside him, to tell Pharaoh to let Israel go. The court magicians imitate the first signs and then fail. Pharaoh refuses until the sea turns back on his chariots. This fight pictures that contest. Scripture does not name the king.",
    victoryText:
      "The magicians fall short, and the chariots do not hold the people. Israel walks free. The sea has done what no court trick could undo.",
    defeatText: "Pharaoh's court still says no. Stand with Moses and Aaron and speak again.",
    references: ["Exodus 3", "Exodus 7", "Exodus 14"],
    playableIds: ["moses", "aaron"],
    enemyIds: ["magicians-of-egypt", "pharaoh"],
  },
  {
    id: "og-of-bashan",
    order: 4,
    title: "Og of Bashan",
    intro:
      "On the way to the land, Og, king of Bashan, marches out with his army at Edrei. Moses tells the people not to fear him. Israel defeats Og, and the story is remembered beside the great iron bed that marked his fame.",
    victoryText:
      "Og is defeated at Edrei. The frightened report about giants does not decide the day.",
    defeatText: "The king of Bashan still holds the field. Remember the word: do not fear him.",
    references: ["Numbers 21:33-35", "Deuteronomy 3"],
    playableIds: ["moses", "joshua"],
    enemyIds: ["og"],
  },
  {
    id: "fall-of-jericho",
    order: 5,
    title: "The Fall of Jericho",
    intro:
      "Jericho is shut tight. Joshua has the people circle the city with the ark, and on the seventh day the trumpets sound and the walls fall. Rahab, who hid the scouts, is spared with her household. The king of the city is not named.",
    victoryText:
      "The walls fall. Rahab and her family are brought out, as the scouts promised.",
    defeatText: "The city is still shut. Walk the circuit again with the ark.",
    references: ["Joshua 2", "Joshua 6"],
    playableIds: ["joshua", "caleb"],
    enemyIds: ["king-of-jericho"],
  },
  {
    id: "deborah-and-sisera",
    order: 6,
    title: "Deborah, Barak, and Jael",
    intro:
      "Sisera's iron chariots have oppressed Israel. Deborah the prophet calls Barak, and she goes with him to Mount Tabor. The army is routed. Sisera flees on foot to Jael's tent and does not leave it. Choose any of the three. The battle is a simple picture of that deliverance.",
    victoryText:
      "The chariots break. Sisera does not escape, and Deborah's song remembers the day.",
    defeatText: "The chariots still hold the plain. Listen for Deborah's word and go again.",
    references: ["Judges 4", "Judges 5"],
    playableIds: ["deborah", "barak", "jael"],
    enemyIds: ["sisera"],
  },
  {
    id: "gideon-and-midian",
    order: 7,
    title: "Gideon and the Midianites",
    intro:
      "Midian raids the land until Gideon, who calls himself the least in his family, is sent to face them. The Lord reduces his army to three hundred. Trumpets, jars, and torches throw the camp into confusion, and Gideon pursues the kings Zebah and Zalmunna.",
    victoryText:
      "The camp falls apart at the trumpets. Midian's kings are taken, and the land grows quiet.",
    defeatText: "The raiders are still in the valley. Light the torches and sound the horns again.",
    references: ["Judges 6", "Judges 7", "Judges 8"],
    playableIds: ["gideon"],
    enemyIds: ["zebah"],
  },
  {
    id: "samson",
    order: 8,
    title: "Samson",
    intro:
      "Samson is set apart as a Nazirite, and his strength fails when Delilah draws out the secret of his hair and hands him to the Philistines. Blind and mocked in their hall, he prays, and his strength is given again. You face Delilah first, then the lords in the hall. This is a picture of the story, not a blow-by-blow of the chapters.",
    victoryText:
      "The secret is out, and still Samson calls on the Lord. Strength returns, and the oppressors' hall comes down.",
    defeatText: "The vow is frayed and the hall is loud. Pray, as he prayed, and stand up again.",
    references: ["Judges 13", "Judges 16"],
    playableIds: ["samson"],
    enemyIds: ["delilah", "philistine-lords"],
  },
  {
    id: "jonathan-at-michmash",
    order: 9,
    title: "Jonathan at Michmash",
    intro:
      "A Philistine garrison holds the rocks near Michmash. Jonathan climbs with his armor-bearer, saying that nothing hinders the Lord from saving by many or by few. The outpost gives way.",
    victoryText:
      "The garrison breaks. Jonathan's trust, not the size of his company, is what the story remembers.",
    defeatText: "The rocks are still held. Climb again. The Lord can save by few.",
    references: ["1 Samuel 14"],
    playableIds: ["jonathan-saul"],
    enemyIds: ["philistine-garrison"],
  },
  {
    id: "david-and-goliath",
    order: 10,
    title: "David and Goliath",
    intro:
      "For forty days the champion of Gath defies the ranks of Israel. David will not wear Saul's armor. He takes his staff, his sling, and five smooth stones, and he answers Goliath in the name of the Lord of hosts.",
    victoryText:
      "The Philistine champion falls. Israel takes heart, and the shepherd's sling is enough.",
    defeatText: "The challenge is still shouted across the valley. Take the sling and answer it again.",
    references: ["1 Samuel 17"],
    playableIds: ["david"],
    enemyIds: ["goliath"],
  },
  {
    id: "elijah-on-carmel",
    order: 11,
    title: "Elijah and the Prophets of Baal",
    intro:
      "On Mount Carmel Elijah sets a contest before Israel: the god who answers by fire is God. The prophets of Baal cry out all day and receive no answer. Elijah repairs the Lord's altar, prays, and fire falls. Jezebel's threat comes afterward, and Elijah flees. She is in the roster, not in this duel, so the battle does not pretend he struck her down.",
    victoryText:
      "Fire falls on the offering. The people see that the Lord is God, and Baal has no voice.",
    defeatText: "The altar is still quiet. Repair it, pray again, and wait for the fire.",
    references: ["1 Kings 18", "1 Kings 19"],
    playableIds: ["elijah"],
    enemyIds: ["prophets-of-baal"],
  },
  {
    id: "elisha-and-aram",
    order: 12,
    title: "Elisha and the Army of Aram",
    intro:
      "The king of Aram sends an army by night to seize Elisha at Dothan. Elisha prays, and his servant sees the hills full of horses and chariots of fire. The raiders are dazzled, led to Samaria, and fed. Then they are sent home. Winning here means sparing them.",
    victoryText:
      "Elisha sets a table for the army that came to capture him. They eat, they leave, and the raids stop.",
    defeatText: "The chariots still ring the town. Ask for eyes to see, and for mercy enough to feed an enemy.",
    references: ["2 Kings 6"],
    playableIds: ["elisha"],
    enemyIds: ["army-of-aram"],
  },
  {
    id: "fiery-furnace",
    order: 13,
    title: "The Fiery Furnace",
    intro:
      "Nebuchadnezzar sets up a golden statue and orders the furnace heated for anyone who will not bow. Hananiah, Mishael, and Azariah refuse. A fourth figure walks with them, and the fire does not master them. The king is humbled in this scene. Daniel 4 tells of a later humbling. The battle does not claim the three killed him.",
    victoryText:
      "The fire does not master them. Nebuchadnezzar is forced to see that their God can deliver. Catholic Bibles keep their song in Daniel 3.",
    defeatText: "The furnace is still roaring. Refuse the statue again, and trust the One who walks in the fire.",
    references: ["Daniel 3", "Daniel 4"],
    playableIds: ["three-young-men"],
    enemyIds: ["nebuchadnezzar"],
  },
  {
    id: "daniel-and-the-dragon",
    order: 14,
    title: "Daniel and the Dragon of Babylon",
    intro:
      "Daniel is kept safe in the lions' den because he will not give up prayer. In the Greek addition Bel and the Dragon, he also shows that the idol Bel does not eat and that the dragon worshiped in Babylon is no god. This dragon is not the dragon of Revelation. You face the dragon of Babylon.",
    victoryText:
      "The living idol is shown to be no god. Daniel's loyalty to the Lord of Israel holds, in the den and in the temple of Babylon.",
    defeatText: "The crowd still calls the beast divine. Tell the truth again, as Daniel did.",
    references: ["Daniel 6", "Daniel 14"],
    playableIds: ["daniel"],
    enemyIds: ["dragon-of-babylon"],
  },
  {
    id: "esther-and-haman",
    order: 15,
    title: "Esther and Haman",
    intro:
      "Haman plots to destroy the Jewish people in the Persian empire. Mordecai urges Esther not to keep silent. She asks for a fast, then goes to the king though she was not called, and Haman's plot collapses. The Greek additions preserve her prayer.",
    victoryText:
      "Esther speaks, and Haman's plot falls in on itself. The people are spared.",
    defeatText: "The decree is still sealed. Fast, then go to the king again.",
    references: ["Esther 4", "Esther 7"],
    playableIds: ["esther", "mordecai"],
    enemyIds: ["haman"],
  },
  {
    id: "judith-and-holofernes",
    order: 16,
    title: "Judith and Holofernes",
    intro:
      "Holofernes camps against Bethulia and cuts off the water. The elders are ready to surrender. Judith tells them to hold on, prays, and enters the enemy camp. The town is delivered. The battle stays restrained: it is her courage and the city's rescue, told without lingering on the violence of the night.",
    victoryText:
      "Bethulia is delivered. Judith returns, and the people bless the God who saved them.",
    defeatText: "The spring is still held and the elders are afraid. Pray, as Judith prayed, and go back.",
    references: ["Judith 8", "Judith 13"],
    playableIds: ["judith"],
    enemyIds: ["holofernes"],
  },
  {
    id: "tobias-and-asmodeus",
    order: 17,
    title: "Tobias, Raphael, and Asmodeus",
    intro:
      "Sarah has lost seven husbands, each killed on the wedding night by the demon Asmodeus. Tobias travels with Raphael, who is disguised as a kinsman named Azariah. They catch a fish in the Tigris. On the wedding night Tobias prays with Sarah, and Raphael binds the demon. Choose Tobias or Raphael.",
    victoryText:
      "Raphael binds Asmodeus, and Sarah is free. The journey will also heal Tobit's eyes when the son comes home.",
    defeatText: "The wedding night is still feared. Follow Raphael's counsel and pray again.",
    references: ["Tobit 3", "Tobit 6", "Tobit 8", "Tobit 12"],
    playableIds: ["tobias", "raphael"],
    enemyIds: ["asmodeus"],
  },
  {
    id: "maccabean-revolt",
    order: 18,
    title: "The Maccabean Revolt",
    intro:
      "Antiochus IV outlaws the law of Moses and defiles the temple. Mattathias refuses the king's sacrifice, and his son Judas takes up the fight. The temple is cleansed and rededicated. Antiochus dies away from Judea, not in a duel with Judas. Later, Judas defeats the general Nicanor. Choose a champion from the family. You face the persecution, then Nicanor. One battle cannot hold the whole history, and the victory text keeps the record straight.",
    victoryText:
      "The sanctuary is purified, and Nicanor's threat is turned back. Antiochus's death happens far from this field, as 1 Maccabees 6 and 2 Maccabees 9 tell it. The lamps of the temple are lit again.",
    defeatText: "The decree still stands over the city. Take courage from Mattathias and fight on.",
    references: ["1 Maccabees 1", "1 Maccabees 2", "1 Maccabees 4", "1 Maccabees 6", "1 Maccabees 7", "2 Maccabees 9"],
    playableIds: ["mattathias", "judas-maccabeus", "jonathan-maccabeus", "eleazar-avaran"],
    enemyIds: ["antiochus-iv", "nicanor"],
  },
  {
    id: "michael-and-the-dragon",
    order: 19,
    title: "Michael and the Dragon",
    intro:
      "War breaks out in heaven. Michael and his angels fight the dragon. The dragon is the ancient serpent, the one called the Devil and Satan, and he is thrown down. Salvation and power belong to God. Gabriel is named elsewhere as a messenger and is not placed in this battle, because this chapter names Michael.",
    victoryText:
      "The dragon is cast down. The accuser loses his place, and the victory is God's.",
    defeatText: "The dragon still accuses. Rise with Michael's host and contend again.",
    references: ["Revelation 12:7-12", "Daniel 12:1"],
    playableIds: ["michael"],
    enemyIds: ["satan"],
  },
];

export function getLevel(id: string): Level | undefined {
  return LEVELS.find((level) => level.id === id);
}

export function levelsFeaturing(characterId: string): Level[] {
  return LEVELS.filter(
    (level) =>
      level.playableIds.includes(characterId) || level.enemyIds.includes(characterId),
  );
}

export function levelRoster(level: Level): {
  playable: ReturnType<typeof getCharacter>[];
  enemies: ReturnType<typeof getCharacter>[];
} {
  return {
    playable: level.playableIds.map((id) => getCharacter(id)),
    enemies: level.enemyIds.map((id) => getCharacter(id)),
  };
}
