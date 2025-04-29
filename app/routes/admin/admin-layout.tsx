import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, SidebarNav } from "../../../components";
import { Outlet } from "react-router";

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

      {/* Main: children */}
      <main className="children">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
