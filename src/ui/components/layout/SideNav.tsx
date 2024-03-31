import React from "react";
import {
  IconButton,
  Drawer as MuiDrawer,
  styled,
  Toolbar,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { drawerWidth } from "./sharedConstants";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  height:"100%",
  "& .MuiDrawer-paper": {
    position: "fixed",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));
type SideNavContainerPropsType = {
  sideNavIsOpen: boolean;
  toggleDrawer: () => void;
};
const SideNav = ({
  sideNavIsOpen,
  toggleDrawer,
}: SideNavContainerPropsType) => {
  return (
    <Drawer anchor={"left"} open={sideNavIsOpen} variant="permanent">
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>

      <h1>Lorem ipsum dolor sit amet.</h1>
      <h1>Lorem ipsum dolor sit amet.</h1>
      <h1>Lorem ipsum dolor sit amet.</h1>
      <h1>Lorem ipsum dolor sit amet.</h1>
      <h1>Lorem ipsum dolor sit amet.</h1>
    </Drawer>
  );
};

export default SideNav;
