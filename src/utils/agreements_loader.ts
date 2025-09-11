// constants/dummyAgreementLoader.ts
import termsKo from '@/assets/agreements/terms.ko';

export async function loadDummyAgreement(docId: string) {
  let content = '';

  if (docId === 'terms') {
    content = termsKo;
  }

  return {
    docId,
    version: 'dummy-v1.0',
    title:
      docId === 'terms' ? 'Terms of Service (Dummy)' : 'Privacy Policy (Dummy)',
    updatedAt: new Date().toISOString(),
    required: true,
    format: 'markdown',
    body: content,
  };
}
