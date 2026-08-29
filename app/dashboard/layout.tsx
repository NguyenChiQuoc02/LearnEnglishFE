import type { Metadata } from "next";
import DashboardShell from "./components/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard | Learn English",
};

export default function DashboardLayout(props: LayoutProps<"/dashboard">) {
  return <DashboardShell>{props.children}</DashboardShell>;
}
