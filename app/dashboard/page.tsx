import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import SpellcheckRoundedIcon from "@mui/icons-material/SpellcheckRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import type { SvgIconComponent } from "@mui/icons-material";

type Stat = {
  label: string;
  value: string;
  delta: string;
  icon: SvgIconComponent;
};

const stats: Stat[] = [
  {
    label: "Active Students",
    value: "1,284",
    delta: "+8.2%",
    icon: GroupRoundedIcon,
  },
  {
    label: "Lessons Completed",
    value: "3,920",
    delta: "+12.4%",
    icon: MenuBookRoundedIcon,
  },
  {
    label: "New Vocabulary",
    value: "540",
    delta: "+3.1%",
    icon: SpellcheckRoundedIcon,
  },
  {
    label: "Avg. Progress",
    value: "76%",
    delta: "+2.0%",
    icon: TrendingUpRoundedIcon,
  },
];

const courseProgress = [
  { name: "Beginner English A1", value: 82 },
  { name: "Intermediate English B1", value: 61 },
  { name: "Business English", value: 45 },
  { name: "IELTS Preparation", value: 70 },
];

export default function DashboardPage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Welcome back 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here&apos;s what&apos;s happening with your students today.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {stats.map(({ label, value, delta, icon: Icon }) => (
          <Card key={label} variant="outlined">
            <CardContent>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  <Icon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {value}
                  </Typography>
                </Box>
              </Stack>
              <Chip
                label={`${delta} this month`}
                size="small"
                color="success"
                variant="outlined"
                sx={{ mt: 1.5 }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Course Progress
          </Typography>
          <Stack spacing={2.5}>
            {courseProgress.map(({ name, value }) => (
              <Box key={name}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", mb: 0.5 }}
                >
                  <Typography variant="body2">{name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={value}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
