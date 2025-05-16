import { fetchAllUsers, fetchUserDetail } from "~/appwrite/auth";
import {
  fetchUserAndTripStats,
  getTripsByTravelStyle,
  getTripsCreatedPerDay,
  getUserGrowthPerDay,
} from "~/appwrite/dashboard";
import type { Route } from "./+types/dashboard";
import { Header, StatsCard, TripCard } from "components";
import { fetchAllTrips } from "~/appwrite/trips";
import { parseTripData } from "lib/utils";
import {
  Category,
  ChartComponent,
  ColumnSeries,
  DataLabel,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { tripXAxis, tripYAxis, userXAxis, userYAxis } from "~/constants";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";

// Route loader (client)
export async function clientLoader() {
  try {
    const [
      user,
      dashboardStats,
      trips,
      allUsers,
      userGrowth,
      tripsPerDay,
      tripsByTravelStyle,
    ] = await Promise.all([
      fetchUserDetail(),
      fetchUserAndTripStats(),
      fetchAllTrips(4, 0),
      fetchAllUsers(4, 0),
      getUserGrowthPerDay(),
      getTripsCreatedPerDay(),
      getTripsByTravelStyle(),
    ]);

    const allTrips = trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetail),
      imageUrls: imageUrls || [],
    }));

    const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
      name: user.name,
      imageUrl: user.imageUrl,
      count: user.itineraryCount ?? Math.trunc(Math.random() * 10),
    }));

    return {
      user,
      dashboardStats,
      allTrips,
      mappedUsers,
      userGrowth,
      tripsPerDay,
      tripsByTravelStyle,
    };
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
  }
}

function Dashboard({ loaderData }: Route.ComponentProps) {
  const user = loaderData?.user as User | null;
  const dashboardStats = loaderData?.dashboardStats as DashboardStats | null;
  const allTrips = loaderData?.allTrips;
  const users = loaderData?.mappedUsers;
  const userGrowth = loaderData?.userGrowth;
  // const tripsPerDay = loaderData?.tripsPerDay;
  const tripsByTravelStyle = loaderData?.tripsByTravelStyle;

  const trips = allTrips?.map((trip) => ({
    name: trip.name,
    imageUrl: trip.imageUrls[0],
    interest: trip.interests,
  }));

  const userAndTrips = [
    {
      title: "Latest user signups",
      dataSource: users,
      field: "count",
      headerText: "Trips created",
    },
    {
      title: "Trips based on interests",
      dataSource: trips,
      field: "interest",
      headerText: "Interests",
    },
  ];

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
            total={dashboardStats?.totalUsers ?? 0}
            currentMonthCount={dashboardStats?.usersJoined.currentMonth ?? 0}
            lastMonthCount={dashboardStats?.usersJoined.lastMonth ?? 0}
          />

          {/* Total trips */}
          <StatsCard
            title="Total trips"
            total={dashboardStats?.totalTrips ?? 0}
            currentMonthCount={dashboardStats?.tripsCreated.currentMonth ?? 0}
            lastMonthCount={dashboardStats?.tripsCreated.lastMonth ?? 0}
          />

          {/* Active users */}
          <StatsCard
            title="Active users today"
            total={dashboardStats?.userRole.total ?? 0}
            currentMonthCount={dashboardStats?.userRole.currentMonth ?? 0}
            lastMonthCount={dashboardStats?.userRole.lastMonth ?? 0}
          />
        </div>
      </div>

      {/* Trip cards */}
      <section className="container">
        <h2 className="text-dark-100 text-xl font-semibold capitalize">
          Created trips
        </h2>

        {allTrips && allTrips.length > 0 && (
          <div className="trip-grid">
            {allTrips.map(
              ({
                id,
                name,
                imageUrls,
                itinerary,
                interests,
                travelStyle,
                estimatedPrice,
              }) => (
                <TripCard
                  key={id}
                  id={id.toString()}
                  name={name ?? ""}
                  location={itinerary?.[0]?.location ?? ""}
                  imageUrl={imageUrls?.[0] ?? ""}
                  tags={[interests ?? "", travelStyle ?? ""]}
                  price={estimatedPrice ?? ""}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartComponent
          id="chart-1"
          primaryXAxis={userXAxis}
          primaryYAxis={userYAxis}
          title="User Growth"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              type="Column"
              name="Column"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />

            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              type="SplineArea"
              name="Wave"
              fill="rgba(71, 132, 238, 0.3)"
              border={{ width: 2, color: "#4784ee" }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>

        <ChartComponent
          id="chart-2"
          primaryXAxis={tripXAxis}
          primaryYAxis={tripYAxis}
          title="Trip Trends"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={tripsByTravelStyle}
              xName="travelStyle"
              yName="count"
              type="Column"
              name="Day"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>

      <div className="user-trip wrapper">
        {userAndTrips.map(({ title, dataSource, field, headerText }, index) => (
          <section key={index} className="flex flex-col gap-5">
            <h3 className="text-dark-100 p-20-semibold">{title}</h3>

            <GridComponent dataSource={dataSource} gridLines="None">
              <ColumnsDirective>
                <ColumnDirective
                  field="name"
                  headerText="Name"
                  width={200}
                  textAlign="Left"
                  template={(props: UserData) => (
                    <div className="px-4 flex items-center gap-1.5">
                      <img
                        src={props.imageUrl}
                        alt={props.name}
                        referrerPolicy="no-referrer"
                        className="aspect-square size-8 rounded-full"
                      />

                      <span>{props.name}</span>
                    </div>
                  )}
                />

                <ColumnDirective
                  field={field}
                  headerText={headerText}
                  width={150}
                  textAlign="Left"
                />
              </ColumnsDirective>
            </GridComponent>
          </section>
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
