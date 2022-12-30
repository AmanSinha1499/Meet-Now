import React, { useEffect } from "react";
import { Switch, BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { publicRoutes, protectedRoutes } from "./routes";
import { useDispatch, useSelector } from "react-redux";
import PublicRoute from "./PublicRoute";
import { getUser } from "../redux/actions/userActions";

const CustomRouter = React.memo(() => {
  const dispatch = useDispatch();
  const isLoginPending = useSelector((state) => state.userReducer.loginPending);

  useEffect(() => {
    dispatch(getUser());
  }, [isLoginPending]);
  return (
    <Router>
      <Switch>
        {publicRoutes.map((route, index) => (
          <PublicRoute
            key={index}
            strictlyPublic={route.strictlyPublic}
            layout={route.layout}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        ))}
        {protectedRoutes.map((route, index) => (
          <PrivateRoute
            key={index}
            layout={route.layout}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        ))}
      </Switch>
    </Router>
  );
});

export default CustomRouter;
