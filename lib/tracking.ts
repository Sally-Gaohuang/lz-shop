type TrackingWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function campaignDetails() {
  if (typeof window === "undefined") return {};
  try {
    const stored = sessionStorage.getItem("ms_riman_campaign");
    return stored ? (JSON.parse(stored) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function captureCampaign() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const campaign: Record<string, string> = {};

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) campaign[key] = value;
  });

  if (Object.keys(campaign).length) {
    sessionStorage.setItem("ms_riman_campaign", JSON.stringify(campaign));
  }

  trackEvent("landing_view", {
    landing_path: window.location.pathname,
  });
}

export function trackEvent(
  name: string,
  detail: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined") return;
  const target = window as TrackingWindow;
  const payload = { ...campaignDetails(), ...detail };

  target.dataLayer = target.dataLayer || [];
  target.dataLayer.push({ event: name, ...payload });
  target.gtag?.("event", name, payload);

  if (name === "email_click" || name === "inquiry_submitted") {
    target.fbq?.("track", "Contact", payload);
  } else if (name === "partner_interest") {
    target.fbq?.("track", "Lead", payload);
  } else if (name === "riman_store_click") {
    target.fbq?.("track", "ViewContent", payload);
  } else {
    target.fbq?.("trackCustom", name, payload);
  }
}