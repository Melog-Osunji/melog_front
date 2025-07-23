export const TAG_MAP: {[id: number]: string} = {
  1: '도서관',
  2: '공유 오피스',
  3: '스터디 카페',
  4: '청년 지원 기관',
  5: '창업지원',
  6: '취업지원',
  7: '문화공간',
};

export function tagIdsToNames(tagIds: number[]): string[] {
  return tagIds.map(id => TAG_MAP[id]).filter(Boolean);
}
