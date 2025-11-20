// src/agreements.ts
export const AGREEMENTS = [
  {
    id: 'terms',
    title: '서비스 이용약관 동의',
    required: true,
    isFile: true,
    route: 'AgreementViewer',
  },
  {
    id: 'privacy',
    title: '개인정보 수집 이용 동의',
    required: true,
    isFile: true,
    route: 'AgreementViewer',
  },
  {
    id: 'age14',
    title: '14세 이상 이용 확인',
    required: false,
    isFile: false,
    route: 'AgreementViewer',
  },
  {
    id: 'marketing',
    title: '마케팅 알림 동의',
    required: false,
    isFile: true,
    route: 'AgreementViewer',
  },
] as const;
