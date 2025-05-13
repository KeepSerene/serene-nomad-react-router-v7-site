import { useNavigate } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/create-trip";
import { Header } from "components";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "lib/utils";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";

export async function loader() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");

    if (!response.ok) {
      throw new Error("The response was not ok!");
    }

    const data = await response.json();

    return data.map((country: any) => ({
      name: `${country?.flag} ${country?.name?.common}`,
      coordinates: country?.latlng,
      value: country?.name?.common,
      openStreetMap: country?.maps?.openStreetMaps,
    }));
  } catch (err) {
    console.error("Error fetching country list:", err);

    return {
      name: "",
      coordinates: [-Infinity, -Infinity],
      value: "",
      openStreetMap: "",
    };
  }
}

function CreateTrip({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const countries = loaderData as Country[];

  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name ?? "",
    travelStyle: "",
    duration: 0,
    groupType: "",
    budget: "",
    interest: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
  }));

  const mapData = [
    {
      country: formData.country,
      color: "#ea382e",
      coordinates:
        countries.find((country: Country) => country.name === formData.country)
          ?.coordinates ?? [],
    },
  ];

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setErrMsg(null);

    if (
      !(
        formData.country &&
        formData.budget &&
        formData.duration &&
        formData.groupType &&
        formData.interest &&
        formData.travelStyle
      )
    ) {
      setErrMsg("Please provide values for all fields!");
      setIsLoading(false);

      return;
    }

    if (formData.duration < 1 || formData.duration > 10) {
      setErrMsg("Duration must be between 1 and 10 days!");
      setIsLoading(false);

      return;
    }

    const user = await account.get();

    if (!user.$id) {
      setErrMsg("User not authenticated!");
      console.error("User not authenticated!");

      return;
    }

    try {
      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.$id,
          country: formData.country,
          interest: formData.interest,
          groupType: formData.groupType,
          budget: formData.budget,
          travelStyle: formData.travelStyle,
          duration: formData.duration,
        }),
      });

      const result: CreateTripResponse = await response.json();

      if (result?.id) {
        navigate(`/trips/${result.id}`);
      } else {
        console.error("Failed to generate a trip!");
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrMsg(err.message);
      } else {
        setErrMsg("Failed to generate a trip! Try again later.");
      }

      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="wrapper pb-20 flex flex-col gap-10">
      <Header
        title="Add a new trip"
        desc="Utilize AI to create the perfect travel plan for you"
      />

      <div className="wrapper-md mt-2.5">
        <form onSubmit={handleSubmit} className="trip-form">
          <div>
            <label htmlFor="country">Country</label>

            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "text", value: "value" }}
              change={(event: { value: string | undefined }) => {
                if (event.value) {
                  handleChange("country", event.value);
                }
              }}
              allowFiltering
              filtering={(event) => {
                const query = event.text.toLowerCase();

                event.updateData(
                  countries
                    .filter((country) => {
                      return country.name.toLowerCase().includes(query);
                    })
                    .map((country) => ({
                      text: country.name,
                      value: country.value,
                    }))
                );
              }}
              placeholder="Select a country"
              className="combo-box"
            />
          </div>

          <div>
            <label htmlFor="duration">Duration</label>

            <input
              type="number"
              id="duration"
              min={1}
              step={1}
              max={10}
              onChange={(event) =>
                handleChange("duration", +event.target.value)
              }
              placeholder="Enter a number of days"
              className="form-input placeholder:text-gray-100"
            />
          </div>

          <>
            {selectItems.map((key) => (
              <div key={key}>
                <label htmlFor={key}>{formatKey(key)}</label>

                <ComboBoxComponent
                  id={key}
                  fields={{ text: "text", value: "text" }}
                  dataSource={comboBoxItems[key].map((item) => ({
                    text: item,
                    value: item,
                  }))}
                  change={(event: { value: string | undefined }) => {
                    if (event.value) {
                      handleChange(key, event.value);
                    }
                  }}
                  allowFiltering
                  filtering={(event) => {
                    const query = event.text.toLowerCase();

                    event.updateData(
                      comboBoxItems[key]
                        .filter((item) => {
                          return item.toLowerCase().includes(query);
                        })
                        .map((item) => ({
                          text: item,
                          value: item,
                        }))
                    );
                  }}
                  placeholder={`Select ${formatKey(key)}`}
                  className="combo-box"
                />
              </div>
            ))}
          </>

          <div>
            <label htmlFor="location">Location on the World Map</label>

            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  shapeData={world_map}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{ colorValuePath: "color", fill: "#e5e5e5" }}
                  dataSource={mapData}
                />
              </LayersDirective>
            </MapsComponent>
          </div>

          <div className="w-full h-px bg-gray-200" />

          <>
            {errMsg && (
              <div className="error">
                <p>{errMsg}</p>
              </div>
            )}
          </>

          <footer className="w-full px-6">
            <ButtonComponent
              type="submit"
              disabled={isLoading}
              className="button-class !w-full !h-12"
            >
              <img
                src={`/assets/icons/${isLoading ? "loader" : "magic-star"}.svg`}
                alt=""
                className={cn("size-5", isLoading ? "animate-spin" : "")}
              />

              <span className="p-16-semibold">
                {isLoading ? "Generating..." : "Generate Trip"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </div>
    </main>
  );
}

export default CreateTrip;
