import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Route, Redirect, useLocation } from "react-router-dom";

const NewComponent = ({ component: Component, ...restProps }) => {
  return <Component {...restProps} />;
};

const PublicRoute = ({
  layout: Layout,
  component: Component,
  strictlyPublic = false,
  ...rest
}) => {
  const isLoggedIn = useSelector((state) => state.userReducer.isLoggedIn);
  const location = useLocation();
  let url = location.search;
  url = url.includes("?next=") ? url.split("?next=") : "";
  url = url.length > 1 ? url[1] : "";
  return (
    <Route
      path={rest.path}
      exact={rest.exact}
      component={(props) => {
        return !strictlyPublic || isLoggedIn !== true ? (
          <Layout
            {...props}
            noNavbar={rest.noNavbar}
            navbar={rest.navbar}
            navItems={rest.navItems}
            homeIcon={rest.homeIcon}
          >
            <Suspense fallback={<div className="text-primary" />}>
              <NewComponent component={Component} {...props} />
            </Suspense>
          </Layout>
        ) : (
          <Redirect to={url || "/"} />
        );
      }}
    />
  );
};

export default PublicRoute;
