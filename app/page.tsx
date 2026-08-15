"use client";

import { useEffect, useMemo, useState } from "react";
import CampaignTracker from "./CampaignTracker";
import ChatGuide from "./ChatGuide";
import InquiryForm from "./InquiryForm";
import {
  CONTACT_EMAIL,
  officialProductUrl,
  PRODUCTS,
  STORE_URL,
  type Language,
  type Product,
} from "../lib/products";
import { trackEvent } from "../lib/tracking";

const copy = {
  zh: {
    nav: ["产品库", "购买流程", "安全咨询"],
    contact: "电邮联系",
    eyebrow: "新加坡 · 中英双语产品导览",
    heroTitle: "安心了解产品，正式下单回到官方商城。",
    heroText: "力曼小姐为你整理产品方向、回答问题和登记预订意向；价格、库存及付款由官方 RIMAN 商城处理。",
    shop: "前往官方商城",
    ask: "先提交问题",
    noPayment: "查看实时价格、库存，并在官方商城安全完成付款。",
    catalogEyebrow: "产品资料库",
    catalogTitle: "按你的需要开始浏览。",
    catalogText: "以下为产品导览，不显示可能变动的价格与库存。最终资料以官方商城为准。",
    filters: { all: "全部", skincare: "护肤", hair: "头发护理", body: "身体护理", makeup: "彩妆" },
    officialInfo: "查看官方资料",
    reserve: "咨询／预订",
    current: "价格与库存以官方商城为准",
    howEyebrow: "购买与预订流程",
    howTitle: "清楚分开咨询、预订与付款。",
    steps: [
      ["浏览", "在本站查看产品方向和基本说明。"],
      ["询问", "通过安全表单提交问题，由人工回复。"],
      ["预订", "可登记意向，但不代表付款或保证库存。"],
      ["购买", "在官方商城查看实时价格、库存并完成付款。"],
    ],
    partnerEyebrow: "合作咨询",
    partnerTitle: "想了解分享 RIMAN 的方式？",
    partnerText: "先了解实际工作、支持和责任，再决定是否适合。本站不承诺收入或结果。",
    partnerButton: "提交合作问题",
    faqEyebrow: "常见问题",
    faqTitle: "购买前先了解清楚。",
    faq: [
      ["本站可以直接付款吗？", "不可以。本站只提供产品导览、问题和预订意向；付款在官方 RIMAN 商城完成。"],
      ["预订是否保证库存？", "不保证。人工确认产品与库存后，才会提供下一步说明。"],
      ["会保存什么资料？", "只保存你主动提交的称呼、回复方式和问题，并在90天后自动删除。本站不保存付款资料。"],
      ["可以询问医疗问题吗？", "本站不提供诊断或治疗建议。有关身体状况或过敏问题，请咨询合资格专业人士。"],
    ],
    footer: "独立产品导览网站。价格、库存、付款及正式订单由官方 RIMAN 商城提供。",
  },
  en: {
    nav: ["Catalog", "How to buy", "Private enquiry"],
    contact: "Email us",
    eyebrow: "SINGAPORE · BILINGUAL PRODUCT GUIDE",
    heroTitle: "Explore with confidence. Complete your order officially.",
    heroText: "Ms Riman helps you navigate products, ask questions and register reservation interest. Current pricing, availability and payment stay with the official RIMAN store.",
    shop: "Visit official store",
    ask: "Ask a question first",
    noPayment: "Check current prices and availability, then complete payment securely on the official store.",
    catalogEyebrow: "PRODUCT LIBRARY",
    catalogTitle: "Start with what you need.",
    catalogText: "This is a product guide. Prices and availability can change, so the official store remains the final source.",
    filters: { all: "All", skincare: "Skincare", hair: "Hair", body: "Body", makeup: "Makeup" },
    officialInfo: "Official details",
    reserve: "Ask / reserve",
    current: "See official store for current price and stock",
    howEyebrow: "PURCHASE & RESERVATION FLOW",
    howTitle: "Questions, reservations and payment stay clearly separated.",
    steps: [
      ["Browse", "Review product directions and basic information here."],
      ["Ask", "Send a private form for a human reply."],
      ["Reserve", "Register interest without payment or a stock guarantee."],
      ["Buy", "Check live pricing and availability, then pay on the official store."],
    ],
    partnerEyebrow: "PARTNERSHIP ENQUIRY",
    partnerTitle: "Curious about sharing RIMAN?",
    partnerText: "Understand the actual activities, support and responsibilities before deciding. No income or outcome is promised.",
    partnerButton: "Submit a partnership question",
    faqEyebrow: "QUICK ANSWERS",
    faqTitle: "Know before you buy.",
    faq: [
      ["Can I pay on this site?", "No. This site offers product guidance, questions and reservation interest only. Payment is completed on the official RIMAN store."],
      ["Does a reservation guarantee stock?", "No. A person must confirm the product and availability before any next step."],
      ["What information is stored?", "Only the nickname, reply method and question you submit. It is deleted after 90 days. Payment data is never stored."],
      ["Can I ask for medical advice?", "This site does not diagnose or recommend treatment. Consult a qualified professional about health conditions or allergies."],
    ],
    footer: "Independent product guide. Current pricing, availability, payment and formal orders are provided by the official RIMAN store.",
  },
};

type Category = "all" | Product["category"];

export default function Home() {
  const [language, setLanguage] = useState<Language>("zh");
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [category, setCategory] = useState<Category>("all");
  const [selectedProductId, setSelectedProductId] = useState("");
  const t = copy[language];

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((result: { products?: Product[] }) => {
        if (result.products?.length) setProducts(result.products);
      })
      .catch(() => undefined);
  }, []);

  const filteredProducts = useMemo(
    () => category === "all" ? products : products.filter((product) => product.category === category),
    [category, products],
  );

  function openInquiry(productId = "") {
    setSelectedProductId(productId);
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <CampaignTracker />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Ms Riman home"><span className="brand-mark">RM</span><span><strong>力曼小姐 · Ms Riman</strong><small>{language === "zh" ? "新加坡产品导览" : "Singapore product guide"}</small></span></a>
        <nav aria-label="Primary navigation"><a href="#catalog">{t.nav[0]}</a><a href="#how">{t.nav[1]}</a><a href="#inquiry">{t.nav[2]}</a></nav>
        <div className="header-actions"><div className="language-switch" aria-label="Language"><button type="button" className={language === "zh" ? "active" : ""} onClick={() => setLanguage("zh")}>中文</button><button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button></div><a className="header-cta" href={`mailto:${CONTACT_EMAIL}`}>{t.contact}</a></div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy"><p className="eyebrow">{t.eyebrow}</p><h1>{t.heroTitle}</h1><p className="hero-lead">{t.heroText}</p><div className="hero-actions"><a className="button button-primary" href={STORE_URL} target="_blank" rel="noreferrer" onClick={() => trackEvent("riman_store_click", { location: "hero" })}>{t.shop} <span>↗</span></a><button className="button button-ghost" type="button" onClick={() => openInquiry()}>{t.ask}</button></div><p className="microcopy">{t.noPayment}</p></div>
        <div className="hero-visual" aria-label={language === "zh" ? "产品视频" : "Product videos"}>
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="hero-video-grid">
            <div className="hero-video-frame">
              <video className="hero-video" src="/videos/riman-story-1.mp4" autoPlay muted loop playsInline controls preload="metadata">
                {language === "zh" ? "你的浏览器不支持视频播放。" : "Your browser does not support video playback."}
              </video>
            </div>
            <div className="hero-video-frame">
              <video className="hero-video" src="/videos/riman-story-2.mp4" autoPlay muted loop playsInline controls preload="metadata">
                {language === "zh" ? "你的浏览器不支持视频播放。" : "Your browser does not support video playback."}
              </video>
            </div>
          </div>
        </div>
      </section>

      <section className="section catalog-section" id="catalog">
        <div className="section-heading"><p className="eyebrow">{t.catalogEyebrow}</p><h2>{t.catalogTitle}</h2><p>{t.catalogText}</p></div>
        <div className="catalog-toolbar" role="group" aria-label="Product categories">{(Object.keys(t.filters) as Category[]).map((item) => <button type="button" key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{t.filters[item]}</button>)}</div>
        <div className="product-grid">{filteredProducts.map((product, index) => <article className={`product-card tone-${index % 4}`} key={product.id}><div className="product-visual"><span>{product.category}</span><strong>{product.name.split(" ").slice(0, 2).map((word) => word[0]).join("")}</strong></div><div className="product-body"><p className="product-code">REF · {product.id}</p><h3>{language === "zh" ? product.nameZh : product.name}</h3><p>{language === "zh" ? product.descriptionZh : product.description}</p><small>{t.current}</small><div className="product-actions"><a href={officialProductUrl(product.id, language)} target="_blank" rel="noreferrer">{t.officialInfo} ↗</a><button type="button" onClick={() => openInquiry(product.id)}>{t.reserve} →</button></div></div></article>)}</div>
      </section>

      <section className="section how-section" id="how"><div className="section-heading left"><p className="eyebrow">{t.howEyebrow}</p><h2>{t.howTitle}</h2></div><ol className="steps">{t.steps.map((step, index) => <li key={step[0]}><span>{index + 1}</span><div><strong>{step[0]}</strong><p>{step[1]}</p></div></li>)}</ol></section>

      <section className="partner-section"><div className="partner-copy"><p className="eyebrow">{t.partnerEyebrow}</p><h2>{t.partnerTitle}</h2><p>{t.partnerText}</p><button className="button button-light" type="button" onClick={() => openInquiry()}>{t.partnerButton} →</button></div><div className="partner-note"><p className="quote-mark">“</p><h3>{language === "zh" ? "先了解，再决定。" : "Clarity before commitment."}</h3><p>{language === "zh" ? "合作咨询仅用于了解实际情况，不构成收入、客户需求或个人结果保证。" : "Partnership information is educational only. Earnings, demand and individual results are never guaranteed."}</p></div></section>

      <section className="section faq-section" id="faq"><div className="section-heading left"><p className="eyebrow">{t.faqEyebrow}</p><h2>{t.faqTitle}</h2></div><div className="faq-list">{t.faq.map((item) => <details key={item[0]}><summary>{item[0]}</summary><p>{item[1]}</p></details>)}</div></section>

      <InquiryForm language={language} products={products} selectedProductId={selectedProductId} onSelectedProductChange={setSelectedProductId} />

      <div className="mobile-action-bar" aria-label="Quick actions"><a href={STORE_URL} target="_blank" rel="noreferrer">{t.shop} ↗</a><button type="button" onClick={() => openInquiry()}>{t.ask}</button></div>
      <ChatGuide key={language} language={language} onHumanQuestion={() => openInquiry()} />

      <footer><div className="footer-brand"><span className="brand-mark">RM</span><p><strong>力曼小姐 · Ms Riman</strong><br />{language === "zh" ? "中英双语产品导览" : "Bilingual product guide"}</p></div><p className="disclaimer">{t.footer}</p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></footer>
    </main>
  );
}