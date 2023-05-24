import React from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/root.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page.tsx";
import Messages from "./containers/Messages.tsx";
import PrivateMessages from "./components/PrivateMessages.tsx";
import UsernameSelect from "./containers/UsernameSelect.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/general",
        element: <Messages />,
      },
      {
        path: "/private",
        element: <PrivateMessages />,
      },
      {
        path: "/select-username",
        element: <UsernameSelect />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
