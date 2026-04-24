import { Suspense } from "react";
import { B2Header } from "@/components/header";
import MapSearch from "@/components/map-search";
import { bPage } from "@/components/shared";

export const dynamic = "force-dynamic";

export default function NajemPage() {
  return (
    <div className="ab v-b" style={bPage}>
      <B2Header active="pronajmout" />
      <Suspense fallback={null}>
        <MapSearch
          preset={{ offer: "pronajem" }}
          title="Nabídky k pronájmu"
          subtitle="Posouvejte mapou nebo zadejte lokalitu pro filtrování."
        />
      </Suspense>
    </div>
  );
}
