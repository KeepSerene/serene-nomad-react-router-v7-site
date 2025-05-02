import { cn } from "lib/utils";
import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { logOutUser } from "~/appwrite/auth";
import { sidebarItems } from "~/constants";

function SidebarNav({ handleClick }: { handleClick?: () => void }) {
  const user = useLoaderData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOutUser();
    navigate("/sign-in");
  };

  return (
    <nav className="nav-items">
      <Link to="/" className="link-logo">
        <img
          src="/assets/icons/logo.svg"
          alt="SereneNomad logo"
          className="size-[30px]"
        />

        <span className="h1">SereneNomad</span>
      </Link>

      <div className="container">
        <ul>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <li key={id}>
              <NavLink to={href}>
                {({ isActive }: { isActive: boolean }) => (
                  <span
                    onClick={handleClick}
                    className={cn(
                      "group nav-item",
                      isActive ? "bg-primary-100 !text-white" : ""
                    )}
                  >
                    <img
                      src={icon}
                      alt={label}
                      className={cn(
                        "size-5 group-hover:invert group-hover:brightness-0",
                        isActive ? "brightness-0 invert" : "text-dark-200"
                      )}
                    />

                    {label}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <footer className="nav-footer">
          <img
            src={user?.imageUrl ?? "/assets/images/david.webp"}
            alt={user?.name ?? "User"}
            referrerPolicy="no-referrer"
          />

          <article>
            <h2>{user?.name ?? "Username"}</h2>

            <p>{user?.email ?? "example@email.com"}</p>
          </article>

          <button type="button" onClick={handleLogout} aria-label="Log out">
            <img
              src={"/assets/icons/logout.svg"}
              alt="Log out icon"
              className="size-6"
            />
          </button>
        </footer>
      </div>
    </nav>
  );
}

export default SidebarNav;
