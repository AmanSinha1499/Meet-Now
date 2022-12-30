import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import { deepOrange } from "@material-ui/core/colors";
import { LogOut } from "../../redux/actions/userActions";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import themes from "../../config/themes";
import { changeTheme } from "../../redux/actions/themeActions";
import { Link } from "react-router-dom";
import solarizedDark from "../../assets/images/solarised_dark.png";
import solarizedLight from "../../assets/images/solarised_light.png";
import palpatine from "../../assets/images/palpatine.png";
import light from "../../assets/images/light.png";
import dark from "../../assets/images/dark.png";

const themeLogoMap = {
  solarizedDark,
  solarizedLight,
  light,
  dark,
  palpatine,
};

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: "block",
    textDecoration: "none",
    color: theme.palette.text.primary,
    "&:hover": {
      textDecoration: "none",
    },
  },
  sectionDesktop: {
    display: "flex",
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  active: {
    background: "#81818123",
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [themeAnchorEl, setThemeAnchorEl] = useState(null);
  const isThemeMenuOpen = Boolean(themeAnchorEl);
  const isMenuOpen = Boolean(anchorEl);
  const user = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();

  let initials =
    (user.first_name ? user.first_name[0].toUpperCase() : "") +
    (user.last_name ? user.last_name[0].toUpperCase() : "");
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  const currentTheme = useSelector((state) => state.themeReducer.theme);
  const menuId = "primary-search-account-menu";
  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/">
            <Typography className={classes.title} variant="h6" noWrap>
              <img
                src={themeLogoMap[currentTheme]}
                alt="logo"
                style={{
                  marginRight: "1rem",
                  width: "30px",
                  height: "30px",
                }}
              />
              Meet Now
            </Typography>
          </Link>
          <div className={classes.grow} />

          <IconButton
            aria-controls="simple-theme-menu"
            aria-haspopup="true"
            color="inherit"
            className="header-title-button"
            onClick={(event) => setThemeAnchorEl(event.currentTarget)}
          >
            <Brightness5Icon />
          </IconButton>

          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar className={classes.orange}>{initials}</Avatar>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        id={menuId}
        keepMounted
        open={isMenuOpen}
        onClose={() => {
          handleProfileMenuClose();
        }}
      >
        <MenuItem>
          <b>{user.email}</b>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            dispatch(LogOut());
          }}
        >
          Logout
        </MenuItem>
      </Menu>
      <Menu
        id="simple-theme-menu"
        anchorEl={themeAnchorEl}
        keepMounted
        open={isThemeMenuOpen}
        onClose={() => {
          setThemeAnchorEl(null);
        }}
        style={{ marginTop: "30px" }}
      >
        <MenuItem>
          <b>Themes</b>
        </MenuItem>
        {Object.keys(themes).map((theme, idx) => (
          <MenuItem
            key={idx}
            className={currentTheme === theme ? classes.active : null}
            onClick={() => {
              setThemeAnchorEl(null);
              dispatch(changeTheme(theme));
            }}
          >
            {theme}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
