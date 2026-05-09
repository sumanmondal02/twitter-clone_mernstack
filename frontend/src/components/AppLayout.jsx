import * as s from "../styles/common";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";

function AppLayout({ children }) {
  return (
    <div className={s.pageRoot}>
      <div className={s.pageWrapper}>
        <LeftSidebar />

        <main className={s.feedColumn}>
          {children}
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}

export default AppLayout;