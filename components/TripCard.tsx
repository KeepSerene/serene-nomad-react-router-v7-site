import { useLocation, useNavigate } from "react-router";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import { cn, getFirstWordOf } from "lib/utils";

function TripCard({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
}: TripCardProps) {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const handleClick = () => {
    if (pathname === "/" || pathname.startsWith("/travel")) {
      navigate(`/travel/${id}`);
    } else {
      navigate(`trips/${id}`);
    }
  };

  return (
    <div
      role="button"
      onClick={handleClick}
      className="trip-card cursor-pointer"
    >
      <img src={imageUrl} alt={name} />

      <section className="article">
        <h3 className="h2">{name}</h3>

        <figure>
          <img
            src="assets/icons/location-mark.svg"
            alt="Location mark icon"
            className="size-4"
          />

          <figcaption>{location}</figcaption>
        </figure>
      </section>

      <div className="pb-5 pl-[18px] pr-3.5 mt-5">
        <ChipListComponent>
          <ChipsDirective>
            {tags.map((tag, index) => (
              <ChipDirective
                key={index}
                text={getFirstWordOf(tag)}
                cssClass={cn(
                  index === 1
                    ? "!bg-pink-50 !text-pink-500"
                    : "!bg-success-50 !text-success-700"
                )}
              />
            ))}
          </ChipsDirective>
        </ChipListComponent>
      </div>

      <span className="tripCard-pill">{price}</span>
    </div>
  );
}

export default TripCard;
