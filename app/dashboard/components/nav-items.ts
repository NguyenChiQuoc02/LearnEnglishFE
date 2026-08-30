import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import SpellcheckRoundedIcon from "@mui/icons-material/SpellcheckRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import type { SvgIconComponent } from "@mui/icons-material";

export type NavItem = {
  labelKey: "dashboard" | "courses" | "vocabulary" | "students" | "reports" | "settings";
  href: string;
  icon: SvgIconComponent;
};

export const navItems: NavItem[] = [
  { labelKey: "dashboard", href: "/dashboard", icon: DashboardRoundedIcon },
  { labelKey: "courses", href: "/dashboard/courses", icon: MenuBookRoundedIcon },
  {
    labelKey: "vocabulary",
    href: "/dashboard/vocabulary",
    icon: SpellcheckRoundedIcon,
  },
  { labelKey: "students", href: "/dashboard/students", icon: GroupRoundedIcon },
  {
    labelKey: "reports",
    href: "/dashboard/reports",
    icon: AssessmentRoundedIcon,
  },
  { labelKey: "settings", href: "/dashboard/settings", icon: SettingsRoundedIcon },
];
