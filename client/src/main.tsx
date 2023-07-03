import React from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/root.tsx";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page.tsx";
import Messages from "./containers/Messages.tsx";
// import PrivateMessages from "./containers/PrivateMessages.tsx";
import UsernameSelect from "./containers/UsernameSelect.tsx";
import theme from "./theme/index.ts";

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
        path: "/select-username",
        element: <UsernameSelect />,
      },
      // {
      //   path: "/private",
      //   element: <PrivateMessages />,
      // },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
