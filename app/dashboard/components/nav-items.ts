import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import type { SvgIconComponent } from "@mui/icons-material";

export type NavLabelKey =
  | "dashboard"
  | "courses"
  | "students"
  | "users"
  | "notifications"
  | "budget"
  | "testing"
  | "apiTest"
  | "minioUpload";

export type NavChildItem = {
  labelKey: NavLabelKey;
  href: string;
  icon: SvgIconComponent;
};

export type NavItem = {
  labelKey: NavLabelKey;
  href: string;
  icon: SvgIconComponent;
  children?: NavChildItem[];
};

export const navItems: NavItem[] = [
  { labelKey: "dashboard", href: "/dashboard", icon: DashboardRoundedIcon },
  { labelKey: "courses", href: "/dashboard/courses", icon: MenuBookRoundedIcon },
  { labelKey: "users", href: "/dashboard/users", icon: ManageAccountsRoundedIcon },
  { labelKey: "notifications", href: "/dashboard/notifications", icon: NotificationsRoundedIcon },
  { labelKey: "budget", href: "/dashboard/budget", icon: AccountBalanceWalletRoundedIcon },
  {
    labelKey: "testing",
    href: "/dashboard/api-test",
    icon: ScienceRoundedIcon,
    children: [
      { labelKey: "apiTest", href: "/dashboard/api-test", icon: SpeedRoundedIcon },
      { labelKey: "minioUpload", href: "/dashboard/minio-upload", icon: CloudUploadRoundedIcon },
    ],
  },
];
