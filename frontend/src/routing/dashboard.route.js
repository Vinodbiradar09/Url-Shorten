import {createRoute} from "@tanstack/react-router"
import {routeTree} from "./routeTree"
import DashBoardPage from "../pages/DashBoardPage"
import { checkAuth } from "../utils/helper"

export const dashboardPageRoute = createRoute({
    getParentRoute : ()=> routeTree,
    path : "/dashboard",
    component :  DashBoardPage,
    beforeLoad : checkAuth

})