import { fetchUserDetail } from "~/appwrite/auth";
import { dashboardStats, trips } from "~/constants";
import type { Route } from "./+types/dashboard";
import { Header, StatsCard, TripCard } from "components";

// Route loader
export const clientLoader = async () => await fetchUserDetail();

const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } =
  dashboardStats;

function Dashboard({ loaderData }: Route.ComponentProps) {
  const user = loaderData as User | null;

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome, ${user?.name ?? "Guest"}!👋`}
        desc="Track activity, trends, and popular destinations in real time"
      />

      {/* Stats cards */}
      <div className="flex flex-col gap-6">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total users */}
          <StatsCard
            title="Total users"
            total={totalUsers}
            currentMonthCount={usersJoined.currentMonth}
            lastMonthCount={usersJoined.lastMonth}
          />

          {/* Total trips */}
          <StatsCard
            title="Total trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />

          {/* Active users */}
          <StatsCard
            title="Active users today"
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            lastMonthCount={userRole.lastMonth}
          />
        </div>
      </div>

      {/* Trip cards */}
      <section className="container">
        <h2 className="text-dark-100 text-xl font-semibold capitalize">
          Created trips
        </h2>

        <div className="trip-grid">
          {trips
            .slice(0, 4)
            .map(({ id, name, imageUrls, itinerary, tags, estimatedPrice }) => (
              <TripCard
                key={id}
                id={id.toString()}
                name={name}
                location={itinerary?.[0]?.location ?? ""}
                imageUrl={imageUrls?.[0] ?? ""}
                tags={tags}
                price={estimatedPrice}
              />
            ))}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
