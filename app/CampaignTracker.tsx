"use client";

import { useEffect } from "react";
import { captureCampaign } from "../lib/tracking";

export default function CampaignTracker() {
  useEffect(() => {
    captureCampaign();
  }, []);

  return null;
}