export enum ParentType {
  ACCOUNT = 'ACCOUNT', // 서비스 문의
  SUGGESTION = 'SUGGESTION', // 기능 제안
  OTHER = 'OTHER', // 기타
}

export enum AccountChildType { // 서비스 문의
  USAGE = 'USAGE', // 이용 방법
  BUG = 'BUG', // 오류 및 버그
  ACCOUNT_PRIVACY = 'ACCOUNT_PRIVACY', // 계정/개인정보
  POLICY = 'POLICY', // 이용약관/운영정책/규정 문의
  OTHER = 'OTHER', // 기타
}

export enum SuggestionChildType { // 기능 제안
  PARTNERSHIP = 'PARTNERSHIP', // 제품 및 영업 문의
  MARKETING = 'MARKETING', // 마케팅/프로모션 제안
  CONTENT = 'CONTENT', // 콘텐츠 제공
  OTHER = 'OTHER', // 기타
}

export enum OtherChildType { // 기타
  OTHER = 'OTHER', // 기타
}

export type ChildType = AccountChildType | SuggestionChildType | OtherChildType;

export const ParentChildMap: Record<ParentType, ChildType[]> = {
  [ParentType.ACCOUNT]: [
    AccountChildType.USAGE,
    AccountChildType.BUG,
    AccountChildType.ACCOUNT_PRIVACY,
    AccountChildType.POLICY,
    AccountChildType.OTHER,
  ],
  [ParentType.SUGGESTION]: [
    SuggestionChildType.PARTNERSHIP,
    SuggestionChildType.MARKETING,
    SuggestionChildType.CONTENT,
    SuggestionChildType.OTHER,
  ],
  [ParentType.OTHER]: [OtherChildType.OTHER],
};

export const ParentTitleMap: Record<ParentType, string> = {
  [ParentType.ACCOUNT]: '서비스 문의',
  [ParentType.SUGGESTION]: '기능 제안',
  [ParentType.OTHER]: '기타 문의',
};

export const ChildLabelMap: Record<ChildType, string> = {
  [AccountChildType.USAGE]: '이용 방법',
  [AccountChildType.BUG]: '오류 및 버그',
  [AccountChildType.ACCOUNT_PRIVACY]: '계정 및 개인정보',
  [AccountChildType.POLICY]: '이용 정책 문의',
  [AccountChildType.OTHER]: '기타',
  [SuggestionChildType.PARTNERSHIP]: '제품 및 영업 문의',
  [SuggestionChildType.MARKETING]: '마케팅/프로모션 제안',
  [SuggestionChildType.CONTENT]: '콘텐츠 제공',
};

export function getChildLabel(c: ChildType): string {
  return ChildLabelMap[c] ?? '기타';
}
