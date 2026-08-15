export type InquiryInput = {
  type: string;
  language: string;
  nickname: string;
  contactMethod: string;
  contactValue: string;
  productId: string;
  message: string;
  website?: string;
  consent: boolean;
};

export function validateInquiry(
  value: unknown,
):
  | { ok: false; error: string }
  | { ok: true; data: Omit<InquiryInput, "website" | "consent"> };