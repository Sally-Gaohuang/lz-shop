/* eslint-disable react-hooks/set-state-in-effect -- consent is restored from localStorage after mount */
"use client";

import { useEffect, useState } from "react";

type Props = {
  gaId?: string;
  metaPixelId?: string;
};

type Consent = "accepted" | "declined" | null;

function addScript(id: string, source: string, content?: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  if (source) {
    script.src = source;
    script.async = true;
  }
  if (content) script.text = content;
  document.head.appendChild(script);
}

function enableAnalytics(gaId?: string, metaPixelId?: string) {
  if (gaId && /^G-[A-Z0-9]+$/i.test(gaId)) {
    addScript(
      "ga-loader",
      "https://www.googletagmanager.com/gtag/js?id=" + gaId,
    );
    addScript(
      "ga-config",
      "",
      "window.dataLayer=window.dataLayer||[];" +
        "function gtag(){dataLayer.push(arguments);}" +
        "window.gtag=gtag;gtag('js',new Date());" +
        "gtag('config','" + gaId + "',{anonymize_ip:true});",
    );
  }

  if (metaPixelId && /^\d+$/.test(metaPixelId)) {
    addScript(
      "meta-pixel",
      "",
      "!function(f,b,e,v,n,t,s){if(f.fbq)return;" +
        "n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};" +
        "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];" +
        "t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];" +
        "s.parentNode.insertBefore(t,s)}(window,document,'script'," +
        "'https://connect.facebook.net/en_US/fbevents.js');" +
        "fbq('init','" + metaPixelId + "');fbq('track','PageView');",
    );
  }
}

export default function AnalyticsConsent({ gaId, metaPixelId }: Props) {
  const [consent, setConsent] = useState<Consent>(null);
  const configured = Boolean(gaId || metaPixelId);

  useEffect(() => {
    if (!configured) return;
    const saved = localStorage.getItem("ms_riman_tracking_consent") as Consent;
    if (saved === "accepted") enableAnalytics(gaId, metaPixelId);
    setConsent(saved === "accepted" || saved === "declined" ? saved : null);
  }, [configured, gaId, metaPixelId]);

  if (!configured || consent !== null) return null;

  return (
    <aside className="consent-banner" aria-label="Analytics preference">
      <p>
        <strong>Help improve this site?</strong>
        Anonymous analytics can show which campaigns and buttons are useful.
      </p>
      <div>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem("ms_riman_tracking_consent", "declined");
            setConsent("declined");
          }}
        >
          Not now
        </button>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem("ms_riman_tracking_consent", "accepted");
            enableAnalytics(gaId, metaPixelId);
            setConsent("accepted");
          }}
        >
          Allow analytics
        </button>
      </div>
    </aside>
  );
}