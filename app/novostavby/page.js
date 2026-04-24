import { Suspense } from "react";
import { B2Header } from "@/components/header";
import MapSearch from "@/components/map-search";
import { bPage } from "@/components/shared";

export const dynamic = "force-dynamic";

export default function NovostavbyPage() {
  return (
    <div className="ab v-b" style={bPage}>
      <B2Header active="novostavby" />
      <Suspense fallback={null}>
        <MapSearch
          preset={{ offer: "prodej", ptype: "novostavba" }}
          title="Novostavby"
          subtitle="Nové developerské projekty — posouvejte mapou nebo zadejte lokalitu."
        />
      </Suspense>
    </div>
  );
}
