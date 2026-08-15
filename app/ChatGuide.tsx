"use client";

import { FormEvent, useState } from "react";
import type { Language } from "../lib/products";
import { STORE_URL } from "../lib/products";
import { trackEvent } from "../lib/tracking";

type Props = { language: Language; onHumanQuestion: () => void };
type Message = { from: "guide" | "visitor"; text: string; storeLink?: boolean; humanLink?: boolean };

const text = {
  zh: {
    open: "问一问", close: "关闭", title: "智能问答", note: "仅回答常见问题 · 不处理付款",
    hello: "你好！我可以回答产品浏览、预订和官方下单流程问题。",
    quick: ["怎样购买？", "可以预订吗？", "怎样选择产品？", "转人工回答"],
    placeholder: "输入简短问题…", store: "打开官方商城", human: "提交人工问题",
    privacy: "不要在聊天框输入银行卡、身份证或医疗资料。",
  },
  en: {
    open: "Ask a question", close: "Close", title: "Smart guide", note: "FAQs only · no payment handling",
    hello: "Hello! I can answer questions about browsing products, reservations and official checkout.",
    quick: ["How do I buy?", "Can I reserve?", "How do I choose?", "Ask a human"],
    placeholder: "Type a short question…", store: "Open official store", human: "Submit a human question",
    privacy: "Do not enter bank, identity or medical information in this chat.",
  },
};

function answer(question: string, language: Language): Message {
  const value = question.toLowerCase();
  if (/buy|order|checkout|payment|购买|下单|付款/.test(value)) {
    return { from: "guide", text: language === "zh" ? "正式价格、库存和付款均在官方 RIMAN 商城完成；本站不收款。" : "Current prices, availability and payment are handled on the official RIMAN store. This site does not collect payment.", storeLink: true };
  }
  if (/reserve|预订|预留/.test(value)) {
    return { from: "guide", text: language === "zh" ? "可以先提交预订意向。预订不代表已付款或保证库存，人工确认后才算完成。" : "You may submit a reservation request. It is not payment or a stock guarantee until confirmed by a person.", humanLink: true };
  }
  if (/choose|recommend|skin|hair|选择|推荐|皮肤|头发/.test(value)) {
    return { from: "guide", text: language === "zh" ? "你可以按护肤、头发、身体或彩妆筛选。涉及个人情况的问题请提交人工咨询；本站不提供医疗建议。" : "Filter by skincare, hair, body or makeup. Submit personal questions for a human reply; this site does not give medical advice.", humanLink: true };
  }
  return { from: "guide", text: language === "zh" ? "这个问题需要人工回复，请使用安全咨询表单。" : "A person should answer that question. Please use the secure enquiry form.", humanLink: true };
}

export default function ChatGuide({ language, onHumanQuestion }: Props) {
  const t = text[language];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ from: "guide", text: t.hello }]);

  function ask(value: string) {
    const question = value.trim();
    if (!question) return;
    setMessages((current) => [...current, { from: "visitor", text: question }, answer(question, language)]);
    setInput("");
    trackEvent("chat_question", { topic: question.slice(0, 80) });
  }

  function submit(event: FormEvent) { event.preventDefault(); ask(input); }

  return (
    <>
      <button className="chat-launcher" type="button" aria-label={open ? t.close : t.open} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <span aria-hidden="true">{open ? "×" : "?"}</span><strong>{open ? t.close : t.open}</strong>
      </button>
      {open && (
        <section className="chat-panel" aria-label={t.title}>
          <header><div><span className="chat-avatar">RM</span><p><strong>{t.title}</strong><small>{t.note}</small></p></div><button type="button" onClick={() => setOpen(false)} aria-label={t.close}>×</button></header>
          <div className="chat-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div className={`chat-message ${message.from}`} key={`${message.from}-${index}`}>
                <p>{message.text}</p>
                {message.storeLink && <a href={STORE_URL} target="_blank" rel="noreferrer">{t.store} ↗</a>}
                {message.humanLink && <button type="button" onClick={() => { setOpen(false); onHumanQuestion(); }}>{t.human} →</button>}
              </div>
            ))}
          </div>
          {messages.length < 6 && <div className="quick-questions">{t.quick.map((item) => <button type="button" key={item} onClick={() => ask(item)}>{item}</button>)}</div>}
          <form onSubmit={submit}><label className="sr-only" htmlFor="chat-question">{t.placeholder}</label><input id="chat-question" value={input} onChange={(event) => setInput(event.target.value)} placeholder={t.placeholder} maxLength={300} autoComplete="off" /><button type="submit" disabled={!input.trim()} aria-label={t.open}>→</button></form>
          <p className="chat-note">{t.privacy}</p>
        </section>
      )}
    </>
  );
}