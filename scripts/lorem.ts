import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
  sentencesPerParagraph: { min: 4, max: 8 },
  wordsPerSentence: { min: 4, max: 16 },
});

/** a number [ 0...N-1 ] */
export function randInt(N: number) {
  return Math.floor(Math.random() * N);
}

export function randUniqueInts(N: number, len: number) {
  if (len > N) throw "randUniqueInts args must have len <= N";
  const nums = new Set<number>();
  while (nums.size < len) {
    nums.add(randInt(N));
  }
  return Array.from(nums);
}

export function randomText(maxLen = 280) {
  const r = Math.random();
  if (r < 0.33) {
    return lorem.generateWords(randInt(10) + 1).slice(0, maxLen);
  } else if (r < 0.66) {
    return lorem.generateSentences(randInt(5) + 1).slice(0, maxLen);
  } else {
    return lorem.generateParagraphs(2).slice(0, maxLen);
  }
}

export function uniqueWords(n: number) {
  const words: string[] = [];
  while (words.length < n) {
    const word = lorem.generateWords(1);
    if (!words.includes(word)) {
      words.push(word);
    }
  }
  return words;
}

const fromDate = new Date(2021, 0, 1);
const toDate = new Date(2022, 0, 1);
export function randomDate(a: Date = fromDate, b: Date = toDate) {
  return new Date(a.getTime() + Math.random() * (b.getTime() - a.getTime()));
}
