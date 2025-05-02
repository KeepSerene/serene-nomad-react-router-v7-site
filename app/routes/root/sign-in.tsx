import { account } from "~/appwrite/client";
import { useState } from "react";
import { logInWithGoogle } from "~/appwrite/auth";
import { Link, redirect } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

// Route loader
export async function clientLoader() {
  try {
    const user = await account.get();

    if (user.$id) return redirect("/");
  } catch (err) {
    console.error("Error fetching user details", err);

    return null;
  }
}

function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignin = async () => {
    setIsLoading(true);

    try {
      await logInWithGoogle();
    } catch (err) {
      console.error("Oops! Something went wrong:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth">
      <div className="glassmorphism size-full px-6 flex-center">
        <div className="sign-in-card">
          <section className="header">
            <Link to="/">
              <img
                src="/assets/icons/logo.svg"
                alt="SereneNomad logo"
                className="size-[30px]"
              />
            </Link>

            <h1 className="text-dark-100 p-28-bold">SereneNomad</h1>
          </section>

          <section className="article">
            <h2 className="text-dark-100 text-center p-28-semibold capitalize">
              Start your travel journey
            </h2>

            <p className="text-gray-100 text-center p-18-regular !leading-7">
              Sign in with Google to manage destinations, itineraries, and user
              activity with ease
            </p>

            <ButtonComponent
              type="button"
              onClick={handleSignin}
              iconCss="e-search-icon"
              className="button-class !w-full !h-11"
            >
              <img
                src="/assets/icons/google.svg"
                alt="Google logo"
                className="size-5"
              />

              <span className="p-18-semibold">
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </span>
            </ButtonComponent>
          </section>
        </div>
      </div>
    </main>
  );
}

export default SignIn;
