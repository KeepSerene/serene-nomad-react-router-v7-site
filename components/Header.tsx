import { useLocation, useNavigate } from "react-router";
import { cn } from "lib/utils";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

interface HeaderProps {
  title: string;
  desc: string;
  ctaText?: string;
  ctaUrl?: string;
}

function Header({ title, desc, ctaText, ctaUrl }: HeaderProps) {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <header className="header">
      <section className="article">
        <h1
          className={cn(
            "text-dark-100 capitalize",
            pathname === "/"
              ? "text-2xl md:text-4xl font-bold"
              : "text-xl md:text-2xl font-semibold"
          )}
        >
          {title}
        </h1>

        <p
          className={cn(
            "text-gray-100",
            pathname === "/" ? "text-base md:text-lg" : "text-sm md:text-lg"
          )}
        >
          {desc}
        </p>
      </section>

      <>
        {ctaText && ctaUrl && (
          <ButtonComponent
            type="button"
            onClick={() => navigate("/trips/create")}
            className="button-class !w-full !h-11 md:!w-[240px]"
          >
            <img
              src="/assets/icons/plus.svg"
              alt="Plus icon"
              className="size-5"
            />

            <span className="p-16-semibold">{ctaText}</span>
          </ButtonComponent>
        )}
      </>
    </header>
  );
}

export default Header;
