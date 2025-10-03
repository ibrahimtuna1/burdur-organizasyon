// app/admin/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Sidebar from "./Sidebar";
import MotionRoot from "./MotionRoot";

export const metadata: Metadata = {
  title: {
    default: "Admin Paneli",
    template: "%s | Admin Paneli",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get("admin_session")?.value;
  if (role !== "admin") redirect("/admin/signin");

  return (
    <div className="flex min-h-dvh bg-gray-50 text-gray-900" data-admin-root>
      {/* Eğer root layout'ta hâlâ Header/Footer/WhatsApp ekli ise kill-switch: */}
      <style>{`
        header, footer, .whatsapp-button, [data-whatsapp], #whatsappButton {
          display: none !important;
        }
      `}</style>

      <Sidebar />
      <main className="flex-1 p-6">
        <MotionRoot>{children}</MotionRoot>
      </main>
    </div>
  );
}
