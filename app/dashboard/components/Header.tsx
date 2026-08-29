"use client";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { sm: "none" } }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <TextField
          size="small"
          placeholder="Search lessons, students…"
          sx={{
            display: { xs: "none", md: "block" },
            width: 320,
            "& .MuiOutlinedInput-root": { borderRadius: 3 },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Notifications">
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Account">
          <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
            Q
          </Avatar>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
