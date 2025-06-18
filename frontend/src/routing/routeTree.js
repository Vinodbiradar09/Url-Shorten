import {createRootRoute} from "@tanstack/react-router"
import {homePageRoute} from "./home.route";
import{dashboardPageRoute} from "./dashboard.route";
import {authPageRoute} from "./auth.route";
import App from "../App";



export const rootRoute = createRootRoute({
    component : App,
})

export const routeTree = rootRoute.addChildren([
    homePageRoute,
    dashboardPageRoute,
    authPageRoute,
])
