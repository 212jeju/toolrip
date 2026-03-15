"use client";

import { useEffect } from "react";

export interface AdSenseScriptProps {
  publisherId: string;
}

/**
 * Loads the Google AdSense script. Place this component once in your root layout.
 *
 * Usage:
 *   <AdSenseScript publisherId="ca-pub-XXXXXXXXXXXXXXXX" />
 */
export function AdSenseScript({ publisherId }: AdSenseScriptProps) {
  useEffect(() => {
    // Avoid loading the script multiple times
    if (document.querySelector(`script[src*="adsbygoogle"]`)) return;

    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, [publisherId]);

  return null;
}
