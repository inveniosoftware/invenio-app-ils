// NOTE: random function to get different covers for books.
export function getCover(pid = '42') {
  return `https://assets.thalia.media/img/462768${parseInt(pid) +
    46}-00-00.jpg`;
}

export const CARD_IMAGE_SIZE = 'small';
