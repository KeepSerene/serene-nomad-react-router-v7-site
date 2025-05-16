import { Link, useNavigate } from "react-router";
import { logOutUser } from "~/appwrite/auth";

function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOutUser();
    navigate("/sign-in");
  };

  return (
    <main className="min-h-dvh flex flex-col justify-center items-center gap-4">
      <Link
        to="/dashboard"
        className="text-blue-500 underline underline-offset-2"
      >
        Dashboard
      </Link>

      <button type="button" onClick={handleLogout} className="button-class">
        Sign out
      </button>
    </main>
  );
}

export default Home;
