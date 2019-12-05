// NOTE: random function to get different covers for books.
export function getCover(edition = '42') {
  const imageId = 46276847 + parseInt(edition);
  return `https://assets.thalia.media/img/${imageId}-00-00.jpg`;
}

export const CARD_IMAGE_SIZE = 'small';
