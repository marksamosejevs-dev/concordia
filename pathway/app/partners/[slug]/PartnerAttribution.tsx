"use client";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

export function PartnerAttribution({ slug, code }: { slug: string; code: string }) {
  useEffect(() => { captureAttribution({ partner: slug, ref: code }); }, [slug, code]);
  return null;
}
