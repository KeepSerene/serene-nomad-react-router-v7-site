import { useLocation } from "react-router";
import { cn } from "lib/utils";

interface HeaderProps {
  title: string;
  desc: string;
}

function Header({ title, desc }: HeaderProps) {
  const pathname = useLocation().pathname;

  return (
    <header className="header">
      <section className="article">
        <h1
          className={cn(
            "text-dark-100",
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
    </header>
  );
}

export default Header;
