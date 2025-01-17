import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Signup from "./pages/Signup"; // Update the path as per your project structure
import Login from "./pages/Login"; // Update the path as per your project structure
import "./index.css";
import ViewFolders from "./pages/ViewFolders";
import FolderPreview from "./pages/FolderPreview";
import UploadImages from "./pages/UploadImages";
import GetAllFolders from "./pages/GetAllFolders";
import UserFolder from "./pages/UserFolder";
import ViewImages from "./pages/ViewSingleFolder";
import UpdateUser from "./pages/UpdateUser";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/viewfolders" element={<ViewFolders />} />
        <Route path="/tasks/:folderName" element={<FolderPreview />} />
        <Route path="/uploadImages" element={<UploadImages />} />
        <Route path="/getAllFolders" element={<GetAllFolders />} />
        <Route path="/UpdateUser" element={<UpdateUser />} />
        <Route path="/admin/user/:username" element={<UserFolder />} />
        <Route
          path="/admin/user/:username/folder/:dateFolder"
          element={<ViewImages />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
