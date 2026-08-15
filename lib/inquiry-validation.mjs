const TYPES = new Set(["question", "reservation", "partnership"]);
const CONTACT_METHODS = new Set(["email", "phone", "whatsapp"]);

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function validateInquiry(value) {
  if (!value || typeof value !== "object") {
    return { ok: false, error: "Invalid request." };
  }

  if (clean(value.website, 100)) {
    return { ok: false, error: "Unable to submit." };
  }

  const type = clean(value.type, 24);
  const language = clean(value.language, 4) === "zh" ? "zh" : "en";
  const nickname = clean(value.nickname, 80);
  const contactMethod = clean(value.contactMethod, 24);
  const contactValue = clean(value.contactValue, 160);
  const productId = clean(value.productId, 40);
  const message = clean(value.message, 1200);

  if (!TYPES.has(type)) return { ok: false, error: "Choose an enquiry type." };
  if (!nickname) return { ok: false, error: "Enter your name or nickname." };
  if (!CONTACT_METHODS.has(contactMethod)) {
    return { ok: false, error: "Choose a contact method." };
  }
  if (!contactValue || !message) {
    return { ok: false, error: "Contact details and message are required." };
  }
  if (value.consent !== true) {
    return { ok: false, error: "Consent is required." };
  }

  return {
    ok: true,
    data: {
      type,
      language,
      nickname,
      contactMethod,
      contactValue,
      productId,
      message,
    },
  };
}