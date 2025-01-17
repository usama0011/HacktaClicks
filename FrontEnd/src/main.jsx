import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ViewFolders from "./pages/ViewFolders";
import FolderPreview from "./pages/FolderPreview";
import UploadImages from "./pages/UploadImages";
import GetAllFolders from "./pages/GetAllFolders";
import UserFolder from "./pages/UserFolder";
import ViewImages from "./pages/ViewSingleFolder";
import UpdateUser from "./pages/UpdateUser";
import { UserProvider, useUserContext } from "./context/UserContext";

import "./index.css";

// ProtectedRoute Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useUserContext();

  if (!user) {
    // Redirect to login if no user is logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to a 403 page or login if the user role is not allowed
    return <Navigate to="/login" replace />;
  }

  return children;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes accessible by all roles */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
                <App />
              </ProtectedRoute>
            }
          />

          {/* Public routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Routes for users */}
          <Route
            path="/viewfolders"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ViewFolders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/:folderName"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ViewImages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/uploadImages"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UploadImages />
              </ProtectedRoute>
            }
          />

          {/* Routes for admin and superadmin */}
          <Route
            path="/getAllFolders"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <GetAllFolders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UpdateUser"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <UpdateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/user/:username"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <UserFolder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/user/:username/folder/:dateFolder"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ViewImages />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
