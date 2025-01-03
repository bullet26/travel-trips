import { literal } from 'sequelize';
import { City } from 'src/cities';
import { Country } from 'src/countries';
import { Place } from 'src/places';

const uniqueArray = (array: string[]): string[] => Array.from(new Set(array));

const getSynonyms = async (word: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `https://api.datamuse.com/words?rel_syn=${word}`,
    );
    const data = await response.json();
    return [...data].slice(0, 4).map((entry: { word: string }) => entry.word);
  } catch (error) {
    console.error('Error fetching synonyms:', error);
    return [];
  }
};

const getSimilarWords = async (word: string): Promise<string[]> => {
  try {
    const response = await fetch(`https://api.datamuse.com/words?sl=${word}`);
    const data = await response.json();
    return [...data].slice(0, 4).map((entry: { word: string }) => entry.word);
  } catch (error) {
    console.error('Error fetching similar words:', error);
    return [];
  }
};

const generateSynonyms = async (
  name: string,
  translations: string[],
): Promise<string[]> => {
  const words = name
    .split(/\s+/)
    .concat(translations.flatMap((t) => t.split(/\s+/)));
  const uniqueWords = uniqueArray(words);

  const synonymsArrays = await Promise.all(uniqueWords.map(getSynonyms));
  const synonyms = synonymsArrays.flat();

  const similarWordsArrays = await Promise.all(
    uniqueWords.map(getSimilarWords),
  );
  const similarWords = similarWordsArrays.flat();

  return uniqueArray([...synonyms, ...similarWords]);
};

export const generateTsvector = async ({
  name,
  translations,
}: {
  name: string;
  translations: string[];
}): Promise<any> => {
  const synonyms = await generateSynonyms(name, translations);
  const searchTerms = [name, ...translations, ...synonyms].join(' ');

  return literal(`to_tsvector('simple', '${searchTerms}')`);
};

export const shouldUpdateTsvector = ({
  name,
  translations,
  itemFromDB,
}: {
  name: string;
  translations: string[];
  itemFromDB: Country | City | Place;
}): boolean =>
  (name && name !== itemFromDB.name) ||
  (translations &&
    JSON.stringify(translations) !== JSON.stringify(itemFromDB.translations));
