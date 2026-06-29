"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MensajesPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/explorar"); }, [router]);
  return null;
}
