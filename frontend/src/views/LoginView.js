import React from "react";
import { Paper, Grid, Button, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import solarizedDark from "../assets/images/solarised_dark.png";
import solarizedLight from "../assets/images/solarised_light.png";
import palpatine from "../assets/images/palpatine.png";
import light from "../assets/images/light.png";
import dark from "../assets/images/dark.png";
import { useDispatch, useSelector } from "react-redux";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import google_logo from "../assets/images/google_logo.png";
import fb_logo from "../assets/images/fb_logo.png";
import { GoogleLoginFtn, FacebookLoginFtn } from "../redux/actions/userActions";

const themeLogoMap = {
  solarizedDark,
  solarizedLight,
  light,
  dark,
  palpatine,
};

const useStyles = makeStyles((theme) => {
  return {
    margin: {
      margin: theme.spacing(2),
    },
    padding: {
      padding: theme.spacing(1),
    },
    paper: {
      width: "20rem",
      height: "40rem",
    },
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      backgroundColor: theme.palette.background.default,
    },
    loginButton: {
      background: theme.palette.background.default,
      border: 0,
      boxShadow: `0px 0px 8px 8px ${theme.palette.background.default}`,
      borderRadius: "1rem",
      color: theme.palette.text.primary,
      "&:hover": {
        background: theme.palette.background.paper,
      },
    },
    name: {
      marginLeft: "0.5rem",
    },
  };
});

const LoginTab = () => {
  const currentTheme = useSelector((state) => state.themeReducer.theme);
  const classes = useStyles();
  const dispatch = useDispatch();
  
  const fbResponse = (response) => {
    dispatch(
      FacebookLoginFtn({
        access_token: response.accessToken,
        code: response.userID,
      })
    );
  };
  const responseGoogle = (response) => {
    const data = {
      access_token: response.accessToken,
      code: response.googleId,
    };
    dispatch(GoogleLoginFtn(data));
  };
  return (
    <div className={classes.container}>
      <Paper
        className={[classes.padding, classes.paper, classes.margin]}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        elevation={3}
      >
        <Grid container justify="center" style={{ marginBottom: "10px" }}>
          <img
            src={themeLogoMap[currentTheme]}
            alt="logo"
            style={{
              marginRight: "1rem",
              width: "30px",
              height: "30px",
            }}
          />
          <h2>Meet Now</h2>
        </Grid>
        <Grid container justify="center" style={{ marginTop: "100px" }}>
          <GoogleLogin
            clientId="302773532147-p6kaebp90a971e671t0c7146e97qrk07.apps.googleusercontent.com"
            buttonText="LOGIN WITH GOOGLE"
            cookiePolicy={"single_host_origin"}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            render={(renderProps) => (
              <Button
                variant="contained"
                className={classes.loginButton}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                style={{ marginBottom: "3rem" }}
              >
                <Avatar alt="google logo" src={google_logo} />
                <span className={classes.name}>Sign in with Google</span>
              </Button>
            )}
          />
          <FacebookLogin
            textButton="LOGIN WITH FACEBOOK"
            appId="179598967332582"
            fields="name,email,picture"
            callback={fbResponse}
            render={(renderProps) => (
              <Button
                variant="contained"
                className={classes.loginButton}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <Avatar alt="google logo" src={fb_logo} />
                <span className={classes.name}>Sign in with Facebook</span>
              </Button>
            )}
          />
        </Grid>
      </Paper>
    </div>
  );
};

export default LoginTab;
