
import { createRoot } from "react-dom/client"
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // importing the tanstack query client

import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routing/routeTree.js"
import { Provider } from "react-redux";
import reduxStore from "./store/store.js";

const queryClient = new QueryClient();

const router = createRouter({ 
    routeTree,
    context : {
        queryClient,
        reduxStore,
    }
 });

createRoot(document.getElementById('root')).render(
    <Provider store={reduxStore}>


        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />



        </QueryClientProvider>

    </Provider>
)
