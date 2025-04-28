import { Outlet } from "react-router";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Outlet />
    </div>
  );
}

export default AdminLayout;
