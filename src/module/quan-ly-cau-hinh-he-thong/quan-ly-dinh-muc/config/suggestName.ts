export function sortNamesBySimilarity(
  inputName: string,
  namesArray: any[],
  keyName: string,
) {
  const distances = namesArray.map((item) => ({
    ...item,
    distance: levenshteinDistance(
      inputName,
      item[keyName as keyof typeof item],
    ),
  }));

  distances.sort((a, b) => a.distance - b.distance);

  return distances;
}

export function suggestName(inputName: string, availableNames: string[]) {
  let minDistance = Infinity;
  let closestName = null;

  availableNames.forEach((name) => {
    let distance = levenshteinDistance(inputName, name);
    if (distance < minDistance) {
      minDistance = distance;
      closestName = name;
    }
  });

  return closestName;
}

function levenshteinDistance(a: string, b: string) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let matrix = [];

  // Initialize the matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Calculate the distances
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // Substitution
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j] + 1, // Deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
