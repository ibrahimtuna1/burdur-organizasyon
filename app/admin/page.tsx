import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const role = (await cookies()).get("admin_session")?.value;
  if (role !== "admin") redirect("/admin/signin");
  redirect("/admin/services");
}
