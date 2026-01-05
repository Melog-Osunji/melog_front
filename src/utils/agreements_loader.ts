// agreements_loader.ts
import termsKo from '@/assets/agreements/terms.ko';
import privacyKo from '@/assets/agreements/privacy.ko';
import marketingKo from '@/assets/agreements/marketing.ko';

import {AGREEMENTS} from '@/constants';

export type AgreementId = (typeof AGREEMENTS)[number]['id']; // 'terms' | 'privacy' | 'age14' | 'marketing'
export type Agreement = (typeof AGREEMENTS)[number];

/**
 * ID → Agreement 매핑 (자동 생성, 타입 안전)
 */
const AGREEMENT_MAP: Record<AgreementId, Agreement> = AGREEMENTS.reduce(
  (acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  },
  {} as Record<AgreementId, Agreement>,
);

/**
 * ID → markdown asset 매핑
 * (isFile === true 인 것만 존재)
 */
const ASSET_MAP: Partial<Record<AgreementId, string>> = {
  terms: termsKo,
  privacy: privacyKo,
  marketing: marketingKo,
};

/**
 * ID로 title 가져오기 (타입 안전)
 */
export function getAgreementTitleById(id: AgreementId): string {
  return AGREEMENT_MAP[id].title;
}

/**
 * Agreement 문서 로더
 */
export async function AgreementsLoader(docId: AgreementId) {
  const agreement = AGREEMENT_MAP[docId];

  if (!agreement) {
    throw new Error(`Unknown agreement id: ${docId}`);
  }

  let content = '';

  if (agreement.isFile) {
    content = ASSET_MAP[docId] ?? '';
  }

  return {
    docId,
    title: agreement.title,
    required: agreement.required,
    format: 'markdown' as const,
    body: content,
  };
}
