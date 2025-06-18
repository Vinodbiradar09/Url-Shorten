import { createRoute } from "@tanstack/react-router";
import {routeTree} from "./routeTree"
import AuthPage from "../pages/AuthPage";



export const authPageRoute = createRoute({
    getParentRoute : () => routeTree,
    path : "/auth",
    component : AuthPage,
})