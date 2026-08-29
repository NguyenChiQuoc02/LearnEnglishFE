import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import SpellcheckRoundedIcon from "@mui/icons-material/SpellcheckRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import type { SvgIconComponent } from "@mui/icons-material";

export type NavItem = {
  label: string;
  href: string;
  icon: SvgIconComponent;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardRoundedIcon },
  { label: "Lessons", href: "/dashboard/lessons", icon: MenuBookRoundedIcon },
  {
    label: "Vocabulary",
    href: "/dashboard/vocabulary",
    icon: SpellcheckRoundedIcon,
  },
  { label: "Students", href: "/dashboard/students", icon: GroupRoundedIcon },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: AssessmentRoundedIcon,
  },
  { label: "Settings", href: "/dashboard/settings", icon: SettingsRoundedIcon },
];
