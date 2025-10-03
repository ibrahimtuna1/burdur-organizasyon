import "server-only";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  const res = NextResponse.json({ ok: true });

  // admin oturum cookie’sini temizle
  res.cookies.set("admin_session", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  return res;
}
