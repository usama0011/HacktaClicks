import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ViewFolders from "./pages/ViewFolders";
import UploadImages from "./pages/UploadImages";
import GetAllFolders from "./pages/GetAllFolders";
import UserFolder from "./pages/UserFolder";
import ViewImages from "./pages/ViewSingleFolder";
import UpdateUser from "./pages/UpdateUser";
import { UserProvider, useUserContext } from "./context/UserContext";

import "./index.css";
import AdminDashboard from "./pages/AdminDashboard";
import WelcomeAdminDashboardPage from "./pages/WelcomeAdminDashboardPage";
import AdminSideImagesView from "./pages/AdminSideImagesView";
import OverView from "./pages/OverView";
import HourlyWorkSir from "./pages/HourlyWorkSir";
import HourlyWorkDetail from "./pages/HourlyWorkDetail";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useUserContext();

  if (!token || !user) {
    // Redirect to login if the token or user is not present
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to a "403 Forbidden" page or login if the user role is not allowed
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
            path="/admin/user/:username/folder/:dateFolder"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ViewImages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            {/* Nested Admin Routes */}
            <Route index element={<WelcomeAdminDashboardPage />} />
            <Route path="manageusers" element={<UpdateUser />} />
            <Route path="overview" element={<OverView />} />
            <Route
              path="hourly-reports/morning"
              element={<HourlyWorkSir shift="morning" />}
            />
            <Route
              path="hourly-reports/evening"
              element={<HourlyWorkSir shift="evening" />}
            />
            <Route
              path="single/:shift/date/:date"
              element={<HourlyWorkDetail />}
            />

            <Route
              path="hourly-reports/night"
              element={<HourlyWorkSir shift="night" />}
            />
            <Route path="viewfolders/:userId" element={<UserFolder />} />
            <Route
              path="adminside/:userId/folder/:folderDate"
              element={<AdminSideImagesView />}
            />
            <Route path="managefolders" element={<GetAllFolders />} />
            <Route
              path="reports"
              element={<h3>Reports Page Coming Soon!</h3>}
            />
            <Route
              path="settings"
              element={<h3>Settings Page Coming Soon!</h3>}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
