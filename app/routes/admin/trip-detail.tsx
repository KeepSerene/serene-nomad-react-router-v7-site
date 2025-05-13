import type { LoaderFunctionArgs } from "react-router";
import { fetchTripById } from "~/appwrite/trips";
import type { Route } from "./+types/trip-detail";
import { cn, parseTripData } from "lib/utils";
import { Header, InfoPill } from "components";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";

export async function loader({ params }: LoaderFunctionArgs) {
  const { tripId } = params;

  if (!tripId) throw new Error("Trip ID is required!");

  return await fetchTripById(tripId);
}

function TripDetail({ loaderData }: Route.ComponentProps) {
  const tripData = parseTripData(loaderData?.tripDetail);
  console.log(tripData);
  const imageUrls = loaderData?.imageUrls ?? [];

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
  } = tripData ?? {};

  const chipItems = [
    { text: travelStyle, bg: "!bg-pink-50 !text-pink-500" },
    { text: groupType, bg: "!bg-primary-50 !text-primary-500" },
    { text: budget, bg: "!bg-success-50 !text-success-700" },
    { text: interests, bg: "!bg-navy-50 !text-navy-500" },
  ];

  return (
    <main className="travel-detail wrapper">
      <Header
        title="Trip details"
        desc="View and edit AI-generated travel plans"
      />

      <section className="container wrapper-md">
        <div className="header">
          <h1 className="p-40-semibold text-dark-100">{name}</h1>

          <div className="flex items-center gap-5">
            <InfoPill
              text={`${duration} day trip`}
              image="/assets/icons/calendar.svg"
            />

            <InfoPill
              text={
                itinerary
                  ?.slice(0, 2)
                  .map((item) => item.location)
                  .join(", ") ?? ""
              }
              image="/assets/icons/location-mark.svg"
            />
          </div>
        </div>

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
                  cssClass={cn(chip.bg, "!text-base !font-medium !px-4")}
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
      </section>
    </main>
  );
}

export default TripDetail;
