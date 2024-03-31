import { CssBaseline, Box, ThemeProvider, Stack } from "@mui/material";
import React, { PropsWithChildren, useState } from "react";
import theme from "./theme";
import SideNav from "./components/layout/SideNav";
import AppBarContainer from "./components/layout/AppBar";

const DefaultLayout = ({ children }: PropsWithChildren) => {
  const [sideNavIsOpen, setSideNavIsOpen] = useState(true);
  const toggleDrawer = () => {
    setSideNavIsOpen(!sideNavIsOpen);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack direction={"row"}>
        <Box sx={{ display: "flex" }} flexDirection={"column"}>
          <SideNav sideNavIsOpen={sideNavIsOpen} toggleDrawer={toggleDrawer} />
          {children}
        </Box>

        <AppBarContainer
          sideNavIsOpen={sideNavIsOpen}
          toggleDrawer={toggleDrawer}
        />
      </Stack>
    </ThemeProvider>
  );
};

export default DefaultLayout;
