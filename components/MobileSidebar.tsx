// @ts-nocheck

import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { Link } from "react-router";
import SidebarNav from "./SidebarNav";

function MobileSidebar() {
  let sidebar: SidebarComponent;

  const toggleSidebar = () => {
    sidebar.toggle();
  };

  return (
    <section className="lg:hidden mobile-sidebar wrapper">
      <header>
        <Link to="/">
          <img
            src="/assets/icons/logo.svg"
            alt="Logo"
            className="size-[30px]"
          />

          <span className="h1">SereneNomad</span>
        </Link>

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <img
            src="/assets/icons/menu.svg"
            alt="Menu icon"
            className="size-7"
          />
        </button>
      </header>

      <SidebarComponent
        type="over"
        width={270}
        ref={(Sidebar) => (sidebar = Sidebar)}
        created={() => sidebar.hide()}
        closeOnDocumentClick
        showBackdrop
      >
        <SidebarNav handleClick={toggleSidebar} />
      </SidebarComponent>
    </section>
  );
}

export default MobileSidebar;
