"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Language, Product } from "../lib/products";
import { CONTACT_EMAIL } from "../lib/products";
import { trackEvent } from "../lib/tracking";

type Props = {
  language: Language;
  products: Product[];
  selectedProductId: string;
  onSelectedProductChange: (value: string) => void;
};

const copy = {
  zh: {
    eyebrow: "安全咨询与预订",
    title: "留下问题，不公开你的资料。",
    intro: "表单资料仅用于回复本次产品问题或预订；本站不收款、不索取银行资料。",
    type: "咨询类型",
    question: "产品问题",
    reservation: "产品预订",
    partnership: "合作咨询",
    product: "相关产品（可选）",
    none: "暂未指定产品",
    nickname: "姓名或称呼",
    contactMethod: "希望怎样回复",
    email: "电子邮件",
    phone: "电话",
    whatsapp: "WhatsApp（填写你的号码）",
    contact: "你的联系资料",
    message: "问题或预订说明",
    consent: "我同意本站仅为回复本次咨询而保存这些资料，最长保留90天。",
    submit: "安全提交",
    submitting: "正在提交…",
    success: "已收到。请保存查询编号：",
    failure: "暂时无法提交，请直接发送电邮。",
    direct: "也可以直接电邮",
    honeypot: "公司网站",
  },
  en: {
    eyebrow: "PRIVATE ENQUIRY & RESERVATION",
    title: "Leave a question—not your details in public.",
    intro: "Your details are used only to reply to this product enquiry or reservation. No payment or banking information is collected here.",
    type: "Enquiry type",
    question: "Product question",
    reservation: "Product reservation",
    partnership: "Partnership enquiry",
    product: "Related product (optional)",
    none: "No product selected",
    nickname: "Name or nickname",
    contactMethod: "Preferred reply method",
    email: "Email",
    phone: "Phone",
    whatsapp: "WhatsApp (your number)",
    contact: "Your contact details",
    message: "Question or reservation note",
    consent: "I agree that these details may be kept for up to 90 days only to answer this enquiry.",
    submit: "Send securely",
    submitting: "Sending…",
    success: "Received. Please save your reference: ",
    failure: "Unable to submit right now. Please email instead.",
    direct: "Or email directly",
    honeypot: "Company website",
  },
};

export default function InquiryForm({ language, products, selectedProductId, onSelectedProductChange }: Props) {
  const t = copy[language];
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (selectedProductId) document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  }, [selectedProductId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const payload = {
      type: form.get("type"),
      language,
      nickname: form.get("nickname"),
      contactMethod: form.get("contactMethod"),
      contactValue: form.get("contactValue"),
      productId: form.get("productId"),
      message: form.get("message"),
      website: form.get("website"),
      consent: form.get("consent") === "yes",
    };

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { reference?: string };
      if (!response.ok || !result.reference) throw new Error("submit failed");
      setReference(result.reference);
      setStatus("sent");
      event.currentTarget.reset();
      onSelectedProductChange("");
      trackEvent("inquiry_submitted", { type: String(payload.type) });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="inquiry-section" id="inquiry">
      <div className="inquiry-intro">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
        <p>{t.intro}</p>
        <a href={`mailto:${CONTACT_EMAIL}`} onClick={() => trackEvent("email_click", { location: "inquiry" })}>
          {t.direct}: {CONTACT_EMAIL}
        </a>
      </div>
      <form className="inquiry-form" onSubmit={submit}>
        <label><span>{t.type}</span><select name="type" defaultValue="question" required><option value="question">{t.question}</option><option value="reservation">{t.reservation}</option><option value="partnership">{t.partnership}</option></select></label>
        <label><span>{t.product}</span><select name="productId" value={selectedProductId} onChange={(event) => onSelectedProductChange(event.target.value)}><option value="">{t.none}</option>{products.map((product) => <option key={product.id} value={product.id}>{language === "zh" ? product.nameZh : product.name}</option>)}</select></label>
        <label><span>{t.nickname}</span><input name="nickname" maxLength={80} autoComplete="name" required /></label>
        <div className="form-row">
          <label><span>{t.contactMethod}</span><select name="contactMethod" defaultValue="email" required><option value="email">{t.email}</option><option value="phone">{t.phone}</option><option value="whatsapp">{t.whatsapp}</option></select></label>
          <label><span>{t.contact}</span><input name="contactValue" maxLength={160} autoComplete="email" required /></label>
        </div>
        <label><span>{t.message}</span><textarea name="message" rows={5} maxLength={1200} required /></label>
        <label className="honeypot" aria-hidden="true"><span>{t.honeypot}</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
        <label className="consent-check"><input name="consent" type="checkbox" value="yes" required /><span>{t.consent}</span></label>
        <button className="button button-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? t.submitting : t.submit}</button>
        {status === "sent" && <p className="form-status success">{t.success}<strong>{reference}</strong></p>}
        {status === "error" && <p className="form-status error">{t.failure}</p>}
      </form>
    </section>
  );
}