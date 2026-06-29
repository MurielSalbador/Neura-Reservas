"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

const AUTH_PAGES = ["/login", "/registro"];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_PAGES.includes(pathname);
  const isAdmin = pathname.startsWith("/admin");

  if (isAuth || isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <div className="ml-[220px] min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
