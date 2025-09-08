import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home/Home";
import Layout from "./Components/Layout/Layout";
import Profil from "./Components/Profil/Profil";

import { Login } from "./Components/Login/Login";
import NotFound from "./Components/NotFound/NotFound";
import { Register } from "./Components/Register/Register";
import { ToastContainer } from "react-toastify";
import UserContextProvider from "./Context/UserContext";
import ProductedRoute from "./Components/ProductedRoute/ProductedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ComopnnetsDetials from "./Components/ComopnnetsDetials/ComopnnetsDetials";
import PostContextProvider from "./Context/UserPost";
import ComentContextProvider from "./Context/userComments";
import DetialsPostHome from "./Components/DetialsPostHome/DetialsPostHome";

const query = new QueryClient();

function App() {
  let x = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <ProductedRoute>
              <Home />
            </ProductedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProductedRoute>
              <Profil />
            </ProductedRoute>
          ),
        },
        {
          path: "componentsdetials/:id",
          element: (
            <ProductedRoute>
              <ComopnnetsDetials />
            </ProductedRoute>
          ),
        },
        {
          path: "detialsHome/:id",
          element: (
            <ProductedRoute>
              <DetialsPostHome />
            </ProductedRoute>
          ),
        },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);
  return (
    <>
      <UserContextProvider>
        <QueryClientProvider client={query}>
          <PostContextProvider>
            <ComentContextProvider>
              <ToastContainer />
              <RouterProvider router={x} />
            </ComentContextProvider>
          </PostContextProvider>
        </QueryClientProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
