//agreements_loader.ts
import termsKo from '@/assets/agreements/terms.ko';
import privacyKo from '@/assets/agreements/privacy.ko';
import marketingKo from '@/assets/agreements/marketing.ko';

const ASSET_MAP: Record<string, string> = {
  terms: termsKo,
  privacy: privacyKo,
  marketing: marketingKo,
};

export async function AgreementsLoader(docId: string) {
  let content = '';

  content = ASSET_MAP[docId] ?? '';

  return {
    docId,
    required: true,
    format: 'markdown',
    body: content,
  };
}
