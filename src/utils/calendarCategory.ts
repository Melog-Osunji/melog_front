export const KOR_TO_SERVER: Record<string, string> = {
  전체: 'ALL',
  연극: 'THEATER',
  뮤지컬: 'MUSICAL',
  오페라: 'OPERA',
  음악: 'MUSIC',
  콘서트: 'CONCERT',
  국악: 'GUGAK',
  무용: 'DANCE',
  전시: 'EXHIBITION',
  기타: 'ETC',
};

export const SERVER_TO_KOR: Record<string, string> = Object.fromEntries(
  Object.entries(KOR_TO_SERVER).map(([k, v]) => [v, k]),
);
