import { redirect } from "next/navigation";
import { BHeader } from "@/components/header";
import { bPage } from "@/components/shared";
import { createClient } from "@/lib/supabase/server";
import Wizard from "./wizard";

export default async function WizardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/prihlaseni?next=/vlozit");

  return (
    <div className="ab v-b" style={bPage}>
      <BHeader />
      <Wizard user={{ id: user.id, email: user.email, full_name: user.user_metadata?.full_name || "" }} />
    </div>
  );
}
