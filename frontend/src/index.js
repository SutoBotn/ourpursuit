import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";

import LandingPage from "./pages/landing-page";
import Home from "./pages/home";
import AskShare from "./pages/ask-share";
import { CategoriesPage, CategoryPage } from "./pages/discussion/category";
import Post from "./pages/discussion/post";
import { Profile, ProfileDetails, UserUploads } from "./pages/profile";
import LoginPage from "./pages/register-login";
import SavedPosts from "./pages/profile/SavedPosts";

const App = () => {
  const [token, updateToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // useEffect(() => {
  //   const storedToken = sessionStorage.getItem('access');
  //   if (storedToken) {
  //     setIsAuthenticated(true);
  //   } else {
  //     setIsAuthenticated(false)
  //   }
  // }, [token]);
  useEffect(() => {
    const storedToken = sessionStorage.getItem('access');
    if (storedToken) {
      // Decode the JWT token to get expiration time
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      const tokenExpirationTime = decodedToken.exp * 1000; // Convert to milliseconds
      const currentTime = new Date().getTime();
      
      // Check if token has expired
      if (currentTime > tokenExpirationTime) {
        // Token has expired
        sessionStorage.removeItem('access'); // Remove expired token
        setIsAuthenticated(false);
        alert("Your session has expired. Please log in again.");
      } else {
        // Token is still valid
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/home",
      element: <Home />
    },
    {
      path: "/askshare",
      element: <AskShare />
    },
    {
      path: "/discussion",
      element: <CategoriesPage />
    },
    {
      path: "/discussion/:category",
      element: <CategoryPage />
    },
    {
      path: "/discussion/:category/:id",
      element: <Post />
    },
    {
      path: "/login",
      element: isAuthenticated ? <Profile /> : <LoginPage updateToken={updateToken} />
    },
    {
      path: "/account",
      element: isAuthenticated ? <Profile /> : <LoginPage updateToken={updateToken} />
    },
    {
      path: "/account/user-details",
      element: isAuthenticated ? <ProfileDetails updateToken={updateToken} token={token} /> : <LoginPage updateToken={updateToken} /> 
    },
    {
      path: "/account/uploads",
      element: isAuthenticated ? <UserUploads token={token} /> : <LoginPage updateToken={updateToken} />
    },
    {
      path: "/account/saved-posts",
      element: isAuthenticated ? <SavedPosts token={token} /> : <LoginPage updateToken={updateToken} />
    }
  ]);

  return (
    <RouterProvider router={router} />
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
