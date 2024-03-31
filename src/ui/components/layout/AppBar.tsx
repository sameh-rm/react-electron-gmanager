import React from 'react';
import {
  AppBarProps,
  Badge,
  IconButton,
  AppBar as MuiAppBar,
  styled,
  Toolbar,
  Typography
} from '@mui/material';
import { drawerWidth } from './sharedConstants';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps & { open: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),

  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

type AppBarContainerPropsType = {
  sideNavIsOpen: boolean;
  toggleDrawer: () => void;
};
const AppBarContainer = ({
  sideNavIsOpen,
  toggleDrawer
}: AppBarContainerPropsType) => {
  return (
    <AppBar position="absolute" open={sideNavIsOpen}>
      <Toolbar
        sx={{
          pr: '24px' // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: '36px',
            ...(sideNavIsOpen && { display: 'none' })
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Dashboard
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarContainer;
