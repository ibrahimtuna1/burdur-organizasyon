import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SigninClient } from "./signinClient";

export const dynamic = "force-dynamic";

export default async function SigninPage() {
  const role = (await cookies()).get("admin_session")?.value;
  if (role === "admin") redirect("/admin");
  return <SigninClient />;
}
