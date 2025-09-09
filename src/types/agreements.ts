// src/agreements.ts
export const AGREEMENTS = [
  { id: "terms", title: "Terms of Service", required: true, route: "AgreementViewer" },
  { id: "privacy", title: "Privacy Policy", required: true, route: "AgreementViewer" },
  { id: "age14", title: "Age 14+ Confirmation", required: true, route: "AgreementViewer" },
  { id: "marketing", title: "Marketing Consent", required: false, route: "AgreementViewer" }
] as const;
