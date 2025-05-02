import { account } from "~/appwrite/client";
import { fetchExistingUserDetail, storeUserData } from "~/appwrite/auth";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, SidebarNav } from "components";
import { Outlet, redirect } from "react-router";

// Route loader
export async function clientLoader() {
  try {
    const user = await account.get();

    if (!user.$id) return redirect("/sign-in");

    const existingUserDetail = await fetchExistingUserDetail(user.$id);

    if (existingUserDetail?.$id && existingUserDetail?.status === "user") {
      // status: "user" | "admin"
      return redirect("/");
    }

    return existingUserDetail?.$id ? existingUserDetail : await storeUserData();
  } catch (err) {
    console.error("Error in clientLoader:", err);

    return redirect("/sign-in");
  }
}

function AdminLayout() {
  return (
    <div className="admin-layout">
      <MobileSidebar />

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-full max-w-[270px]">
        <SidebarComponent width={270} enableGestures={false}>
          <SidebarNav />
        </SidebarComponent>
      </aside>

      {/* Children */}
      <div className="children">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
