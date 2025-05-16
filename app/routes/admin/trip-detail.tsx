import type { LoaderFunctionArgs } from "react-router";
import { fetchAllTrips, fetchTripById } from "~/appwrite/trips";
import type { Route } from "./+types/trip-detail";
import { cn, parseTripData } from "lib/utils";
import { Header, InfoPill, TripCard } from "components";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";

export async function loader({ params }: LoaderFunctionArgs) {
  const { tripId } = params;

  if (!tripId) throw new Error("Trip ID is required!");

  try {
    return await Promise.all([fetchTripById(tripId), fetchAllTrips(4, 0)]);
  } catch (err) {
    console.error("Error fetching trip data:", err);
  }
}

function TripDetail({ loaderData }: Route.ComponentProps) {
  // Single trip
  const tripData = parseTripData(loaderData?.[0]?.tripDetail);
  const imageUrls = (loaderData?.[0]?.imageUrls ?? []) as string[] | [];

  // Multiple trips
  const allTrips = loaderData?.[1]?.allTrips.map(
    ({ $id, tripDetail, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetail),
      imageUrls: imageUrls ?? [],
    })
  );

  const {
    country,
    name,
    duration,
    itinerary,
    budget,
    interests,
    estimatedPrice,
    bestTimeToVisit,
    groupType,
    travelStyle,
    weatherInfo,
    description,
  } = tripData ?? {};

  const chipItems = [
    { text: travelStyle, classStr: "!bg-pink-50 !text-pink-500" },
    { text: groupType, classStr: "!bg-primary-50 !text-primary-500" },
    { text: budget, classStr: "!bg-success-50 !text-success-700" },
    { text: interests, classStr: "!bg-navy-50 !text-navy-500" },
  ];

  const visitTimeAndWeatherInfo = [
    {
      title: "Best Time to Visit:",
      items: bestTimeToVisit,
    },
    {
      title: "Weather:",
      items: weatherInfo,
    },
  ];

  return (
    <main className="travel-detail wrapper">
      <Header
        title="Trip details"
        desc="View and edit AI-generated travel plans"
      />

      <article className="container wrapper-md">
        <section className="header">
          <h1 className="p-40-semibold text-dark-100">{name}</h1>

          <div className="flex items-center gap-5">
            <InfoPill
              text={`${duration} day trip`}
              image="/assets/icons/calendar.svg"
            />

            <InfoPill
              text={
                itinerary
                  ?.slice(0, 4)
                  .map((item) => item.location)
                  .join(", ") ?? ""
              }
              image="/assets/icons/location-mark.svg"
            />
          </div>
        </section>

        <ul className="gallery">
          {imageUrls.map((url: string, index: number) => (
            <li
              key={index}
              className={cn(
                "w-full rounded-xl overflow-hidden",
                index === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]"
              )}
            >
              <img
                src={url}
                alt={`Location picture ${index + 1}`}
                className="size-full object-cover"
              />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 md:gap-5 flex-wrap">
          <ChipListComponent id="travel-chip">
            <ChipsDirective>
              {chipItems.map((chip, index) => (
                <ChipDirective
                  key={index}
                  text={chip.text}
                  cssClass={cn(chip.classStr, "!text-base !font-medium !px-4")}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>

          <ul className="flex items-center gap-1">
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <li key={index}>
                  <img
                    src="/assets/icons/star.svg"
                    alt="Star icon"
                    className="size-[18px]"
                  />
                </li>
              ))}

            <li>
              <ChipListComponent>
                <ChipsDirective>
                  <ChipDirective
                    text="4.9/5"
                    cssClass="!bg-yellow-50 !text-yellow-700"
                  />
                </ChipsDirective>
              </ChipListComponent>
            </li>
          </ul>
        </div>

        <section className="title">
          <div className="article">
            <h2>
              {duration}-Day {country} {travelStyle} Trip
            </h2>

            <p>
              {budget}, {groupType}, and {interests}
            </p>
          </div>

          <span className="h2">{estimatedPrice}</span>
        </section>

        <p className="text-dark-400 text-sm md:text-lg font-normal">
          {description}
        </p>

        <>
          {itinerary && itinerary.length > 0 && (
            <ul className="itinerary">
              {itinerary.map((dayPlan: DayPlan, index) => (
                <li key={index}>
                  <h3>
                    Day {dayPlan.day}: {dayPlan.location}
                  </h3>

                  <ul>
                    {dayPlan.activities.map((activity, index) => (
                      <li key={index}>
                        <span className="flex-shrink-0 p-18-semibold">
                          {activity.time}
                        </span>

                        <p className="flex-grow">{activity.description}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </>

        <>
          {visitTimeAndWeatherInfo.map((section) => (
            <section key={section.title} className="visit">
              <div>
                <h2>{section.title}</h2>

                {section.items && section.items.length > 0 && (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item} className="flex-grow">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </>
      </article>

      <section className="flex flex-col gap-6">
        <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>

        <ul className="trip-grid">
          {allTrips?.map(
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
      </section>
    </main>
  );
}

export default TripDetail;
