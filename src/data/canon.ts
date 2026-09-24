/**
 * Book names as in current English Catholic Bibles (NABRE, RSV-2CE, and
 * similar editions): Samuel and Kings, not the older Douay "1–4 Kings" titles.
 * The deuterocanonical books are part of this 73-book canon.
 */
export const CATHOLIC_CANON_BOOKS = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Tobit",
  "Judith",
  "Esther",
  "1 Maccabees",
  "2 Maccabees",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Songs",
  "Wisdom",
  "Sirach",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Baruch",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
] as const;

export type CanonBook = (typeof CATHOLIC_CANON_BOOKS)[number];

const BOOK_SET = new Set<string>(CATHOLIC_CANON_BOOKS);

/** Split "1 Samuel 17:45-50" into a canon book and the chapter remainder. */
export function splitCitation(citation: string): { book: CanonBook; passage: string } {
  const match = citation.match(/^(.*)\s(\d+(?::\d+(?:-\d+)?)?)$/);
  if (!match) {
    throw new Error(`Citation needs a book and chapter: ${citation}`);
  }
  const book = match[1];
  if (!BOOK_SET.has(book)) {
    throw new Error(`Unknown Catholic book name: ${book}`);
  }
  return { book: book as CanonBook, passage: match[2] };
}

/** Roster keynote. Wording is ours; the citation points at Sirach. */
export const ROSTER_KEYNOTE = {
  citation: "Sirach 44:1",
  line: "Remember the ancestors. That call, from the book of Sirach, is the keynote of this roster.",
};
