"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, Settings } from "lucide-react";

function SidebarLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white px-4 py-6">
      <h2 className="mb-8 text-lg font-bold text-gray-800">Burdur Organizasyon</h2>
      <nav className="flex flex-col gap-1">
        <SidebarLink href="/admin/hizmetler" icon={Palette} label="Hizmetlerimiz" />
        <SidebarLink href="/admin/packages" icon={Palette} label="paketler" />
        <SidebarLink href="/admin/settings" icon={Settings} label="Ayarlar" />
      </nav>
    </aside>
  );
}
