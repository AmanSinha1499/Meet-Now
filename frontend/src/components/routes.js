import React from "react";
import DefaultLayout from "./layouts/DefaultLayout";
import Home from "../views/HomeView";
import LoginView from "../views/LoginView";
import WaitingRoomView from "../views/WaitingRoomView";

export const protectedRoutes = [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Home />,
    strictlyPublic: false,
  },
  {
    path: "/room/:roomID",
    exact: true,
    layout: DefaultLayout,
    component: () => <WaitingRoomView />,
    strictlyPublic: false,
  },
];

export const publicRoutes = [
  {
    path: "/login",
    exact: true,
    layout: DefaultLayout,
    component: () => <LoginView />,
    strictlyPublic: true,
  },
];
