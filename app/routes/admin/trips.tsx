import { Header } from "components";

function Trips() {
  return (
    <main className="users wrapper">
      <Header
        title="Trips"
        desc="View and edit AI-generated travel plans"
        ctaText="Generate Trip"
        ctaUrl="/trips/create"
      />
    </main>
  );
}

export default Trips;
