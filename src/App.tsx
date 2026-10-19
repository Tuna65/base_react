import { ConfigProvider } from "@/components";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import { configAntdProvider } from "./utils";
import { PATHNAME } from "./utils/Pathname";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard";
import LlmPage from "./pages/llm";
import OcrPage from "./pages/ocr";
import UserPage from "./pages/user";
import BranchPage from "./pages/branch";
import RolePage from "./pages/role";
import DocumentPage from "./pages/document";
import ProtectedRoute from "./layout/ProtectedRoute";
import Layout from "./layout/Layout";

function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = `${pathname === PATHNAME.AUTH.LOGIN ? "Login" : pathname === PATHNAME.DASHBOARD ? "Dashboard" : pathname === "/llm" ? "LLM" : pathname === "/ocr" ? "OCR" : pathname === "/users" ? "User" : pathname === "/roles" ? "Roles & Permissions" : pathname === "/documents" ? "Documents" : "AI solution"} | AI solution`;
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ConfigProvider theme={configAntdProvider}>
      <PageTitle />
      <Routes>
        <Route path="/" element={<Navigate replace to={PATHNAME.AUTH.LOGIN} />} />
        <Route path={PATHNAME.AUTH.LOGIN} element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path={PATHNAME.DASHBOARD} element={<Dashboard />} />
            <Route path="/llm" element={<LlmPage />} />
            <Route path="/ocr" element={<OcrPage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/roles" element={<RolePage />} />
            <Route path="/branches" element={<BranchPage />} />
            <Route path="/documents" element={<DocumentPage />} />
          </Route>
        </Route>
      </Routes>
    </ConfigProvider>
  );
}

export default App;
