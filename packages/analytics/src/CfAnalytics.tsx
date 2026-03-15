"use client";

import { useEffect } from "react";

export interface CfAnalyticsProps {
  /** Cloudflare Web Analytics beacon token */
  token: string;
}

/**
 * Injects the Cloudflare Web Analytics beacon script.
 * Place this component once in your root layout.
 */
export function CfAnalytics({ token }: CfAnalyticsProps) {
  useEffect(() => {
    if (!token) return;

    const existing = document.querySelector(
      'script[src*="beacon.min.js"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.defer = true;
    script.setAttribute("data-cf-beacon", JSON.stringify({ token }));
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [token]);

  return null;
}
