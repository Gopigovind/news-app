import { Provider } from "react-redux";
import { createBrowserRouter, Outlet } from "react-router-dom";
import "./App.css";
import Body from "./components/Body";
import Header from "./components/Header";
import BreadCrum from "./components/BreadCrum";
import MainContainer from "./components/MainContainer";
import Search from "./components/Search";
import WatchPage from "./components/WatchPage";
import store from "./utils/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ThemeContext from "./utils/ThemeContext";
import { useEffect, useState } from "react";
import { isMobile } from "./utils/helper";

/* 
  Header
    Sidebar
      MenuItem
  Body
    MainContainer
    Tag
    VideoContainer
      VideoCard


*/
export const queryClient = new QueryClient();

// export const appRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <div>notfound</div>,
//     children: [
//       {
//         path: "/",
//         element: <Body />,
//         children: [
//           {
//             path: "/",
//             element: <MainContainer />,
//           },
//           {
//             path: "/:state",
//             element: <MainContainer />,
//           },
//           {
//             path: "/:state/:district",
//             element: <MainContainer />,
//           },
//           {
//             path: "/:state/:district/:taluk",
//             element: <MainContainer />,
//           },
//           // {
//           //   path: "/:category",
//           //   element: <MainContainer />,
//           // },
//           {
//             path: "results",
//             element: <Search />,
//           },
//         ],
//       },
//       {
//         path: "news/:state/:district/:taluk/:slug",
//         element: <WatchPage />,
//       },
//       {
//         path: "news/:state/:slug",
//         element: <WatchPage />,
//       },
//       {
//         path: "news/:state/:district/:slug",
//         element: <WatchPage />,
//       },
//       {
//         path: "news/:state/:district/:taluk/:slug",
//         element: <WatchPage />,
//       },
//     ],
//   },
// ]);

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>notfound</div>,
    children: [
      {
        path: "/",
        element: <Body />,
        children: [
          {
            path: "/",
            element: <MainContainer />,
          },

          {
            path: "/:newsCategory",
            element: <MainContainer />,
          },
          {
            path: "/:state?/:district?/:taluk?/:slug?",
            element: <MainContainer />,
          },
          {
            path: "results",
            element: <Search />,
          },
        ],
      },
      {
        path: "news/:state?/:district?/:taluk?/:slug",
        element: <WatchPage />,
      },
    ],
  },
]);

function App() {
  // Detecting the default theme
  const isBrowserDefaulDark = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const getDefaultTheme = () => {
    const localStorageTheme = localStorage.getItem("theme");
    const browserDefault = isBrowserDefaulDark() ? "dark" : "light";
    return localStorageTheme || browserDefault;
  };

  const [theme, setTheme] = useState(getDefaultTheme());

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <div className="font-Roboto">
            <Header />
            {!isMobile && <BreadCrum />}
            <Outlet />
          </div>
          {/* <ReactQueryDevtools initialIsOpen /> */}
        </ThemeContext.Provider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
