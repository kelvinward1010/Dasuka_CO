export const getName = (
  inputName: string,
  array: any[],
  similarityThreshold: number,
  key: string | number,
) => {
  let result = null;
  let maxSimilarity = 0;

  const str1Words = inputName
    .trim()
    .split(" ")
    .map(omitPunctuations)
    .map(toLowercase);
  array.forEach((item) => {
    const str2Words = item[key]
      .trim()
      .split(" ")
      .map(omitPunctuations)
      .map(toLowercase);
    const allWordsUnique = Array.from(new Set(str1Words.concat(str2Words)));

    //
    // Calculate IF-IDF algorithm vectors
    //

    const str1Vector = calcTfIdfVectorForDoc(
      str1Words,
      [str2Words],
      allWordsUnique,
    );
    const str2Vector = calcTfIdfVectorForDoc(
      str2Words,
      [str1Words],
      allWordsUnique,
    );

    const similarity = cosineSimilarity(str1Vector, str2Vector);

    if (similarity >= similarityThreshold && similarity > maxSimilarity) {
      maxSimilarity = similarity;
      result = item;
    }
  });

  return result;
};

function cosineSimilarity(vec1: any[], vec2: any[]) {
  const dotProduct = vec1
    .map((val, i) => val * vec2[i])
    .reduce((accum, curr) => accum + curr, 0);
  const vec1Size = calcVectorSize(vec1);
  const vec2Size = calcVectorSize(vec2);

  return dotProduct / (vec1Size * vec2Size);
}

//
// tf-idf algorithm implementation (https://en.wikipedia.org/wiki/Tf%E2%80%93idf)
//

function calcTfIdfVectorForDoc(doc: any, otherDocs: any, allWordsSet: any) {
  return Array.from(allWordsSet).map((word) => {
    return tf(word, doc) * idf(word, doc, otherDocs);
  });
}

function tf(word: any, doc: any) {
  const wordOccurences = doc.filter((w: any) => w === word).length;
  return wordOccurences / doc.length;
}

function idf(word: any, doc: any, otherDocs: any) {
  const docsContainingWord = [doc].concat(otherDocs).filter((doc) => {
    return !!doc.find((w: any) => w === word);
  });

  return (1 + otherDocs.length) / docsContainingWord.length;
}

//
// Helper functions
//

function omitPunctuations(word: any) {
  return word.replace(/[\!\.\,\?\-\?]/gi, "");
}

function toLowercase(word: any) {
  return word.toLowerCase();
}

function calcVectorSize(vec: any[]) {
  return Math.sqrt(vec.reduce((accum, curr) => accum + Math.pow(curr, 2), 0));
}
