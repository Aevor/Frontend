import { NavLink, Outlet } from "react-router";
import styles from "./AppShell.module.css";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/skills", label: "Skills" },
  { to: "/repositories", label: "Repos" },
  { to: "/recommendations", label: "Recs" },
  { to: "/profile", label: "Profile" },
];

export function AppShell() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <span className={styles.logo}>Aevor</span>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.linkActive}` : styles.link
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.syncStatus}>Sync status</div>
      </header>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
