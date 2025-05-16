import { useSearchParams, type LoaderFunctionArgs } from "react-router";
import { fetchAllTrips } from "~/appwrite/trips";
import type { Route } from "./+types/trips";
import { parseTripData } from "lib/utils";
import { useState } from "react";
import { Header, TripCard } from "components";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

export async function loader({ request }: LoaderFunctionArgs) {
  // Handle pagination
  const limit = 8;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const offset = (page - 1) * limit;

  try {
    const { allTrips, total } = await fetchAllTrips(limit, offset);

    return {
      trips: allTrips.map(({ $id, tripDetail, imageUrls }) => ({
        id: $id,
        ...parseTripData(tripDetail),
        imageUrls: imageUrls || [],
      })),
      total,
    };
  } catch (err) {
    console.error("Error fetching trip data:", err);
  }
}

function Trips({ loaderData }: Route.ComponentProps) {
  const trips = (loaderData?.trips ?? []) as Trip[] | [];
  const total = loaderData?.total ?? 0;

  const [searchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1");

  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePagination = (page: number) => {
    setCurrentPage(page);
    window.location.search = `?page=${page}`;
  };

  return (
    <main className="users wrapper">
      <Header
        title="Trips"
        desc="View and edit AI-generated travel plans"
        ctaText="Generate Trip"
        ctaUrl="/trips/create"
      />

      <section className="grid grid-cols-1 gap-4 md:gap-6">
        <h1 className="p-24-semibold text-dark-100 capitalize">
          Manage created trips
        </h1>

        <ul className="trip-grid">
          {trips?.map(
            ({
              id,
              name,
              imageUrls,
              travelStyle,
              interests,
              itinerary,
              estimatedPrice,
            }) => (
              <li key={id}>
                <TripCard
                  id={id}
                  name={name ?? ""}
                  imageUrl={imageUrls[0]}
                  location={itinerary?.[0].location ?? ""}
                  tags={[travelStyle ?? "", interests ?? ""]}
                  price={estimatedPrice ?? ""}
                />
              </li>
            )
          )}
        </ul>

        <PagerComponent
          totalRecordsCount={total}
          pageSize={8}
          currentPage={currentPage}
          click={(args) => handlePagination(args.currentPage)}
          cssClass="!mb-4"
        />
      </section>
    </main>
  );
}

export default Trips;
