import { calculateTrendPercentage, cn } from "lib/utils";

function StatsCard({
  title,
  total,
  currentMonthCount,
  lastMonthCount,
}: StatsCardProps) {
  const { trend, percentage } = calculateTrendPercentage(
    currentMonthCount,
    lastMonthCount
  );

  const isDecrement = trend === "decrement";

  return (
    <article className="stats-card">
      <h3 className="text-base font-medium capitalize">{title}</h3>

      <div className="content">
        <section className="flex flex-col gap-4">
          <h2 className="text-4xl font-semibold">
            {new Intl.NumberFormat().format(total)}
          </h2>

          <div className="flex items-center gap-2">
            <figure className="flex items-center gap-1">
              <img
                src={`/assets/icons/arrow-${
                  isDecrement ? "down-red" : "up-green"
                }.svg`}
                alt={isDecrement ? "Arrow-down icon" : "Arrow-up"}
                className="size-5"
                aria-label={isDecrement ? "Went down by" : "Went up by"}
              />

              <figcaption className="text-sm font-medium">
                <span
                  className={cn(
                    isDecrement ? "text-red-500" : "text-success-700"
                  )}
                >
                  {Math.round(percentage)}%
                </span>
                &nbsp;
                <span className="text-gray-100 truncate">vs last month</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <img
          src={`assets/icons/${isDecrement ? "decrement" : "increment"}.svg`}
          alt="Trend graph"
          className="w-full h-full md:h-32 xl:h-full xl:w-32"
        />
      </div>
    </article>
  );
}

export default StatsCard;
