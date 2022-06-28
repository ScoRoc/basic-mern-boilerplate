export function capitalizeFirstLetter(word) {
  return `${word[0].toUpperCase()}${word.slice(1)}`;
}

export function isFunc(func) {
  return typeof func === 'function';
}
