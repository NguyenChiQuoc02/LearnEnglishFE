import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import type { SvgIconComponent } from "@mui/icons-material";

export type NavItem = {
  labelKey: "dashboard" | "courses" | "students" | "users";
  href: string;
  icon: SvgIconComponent;
};

export const navItems: NavItem[] = [
  { labelKey: "dashboard", href: "/dashboard", icon: DashboardRoundedIcon },
  { labelKey: "courses", href: "/dashboard/courses", icon: MenuBookRoundedIcon },
  { labelKey: "users", href: "/dashboard/users", icon: ManageAccountsRoundedIcon },
];
