import { ConfigProvider } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import ComingSoon from "./components/ComingSoon";
import Layout from "./layout/Layout";
import { routerList } from "./pages";
import { configAntdProvider } from "./utils";
import { PATHNAME } from "./utils/Pathname";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./layout/ProtectedRoute";

const pageTitles: Record<string, string> = {
  [PATHNAME.SETTING]: "Settings",
  [PATHNAME.AUTH.LOGIN]: "Login",
  [PATHNAME.KNOWLEDGE]: "KnowledgeHub",
  [PATHNAME.REQUIREMENTS]: "Requirements",
  [PATHNAME.JIRA.INDEX]: "Requirements",
};

function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = `${pageTitles[pathname] || "AI solution"} | AI solution`;
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ConfigProvider theme={configAntdProvider}>
        <PageTitle />
        <Routes>
          <Route path="/" element={<Navigate replace to={PATHNAME.AUTH.LOGIN} />} />
          <Route path={PATHNAME.AUTH.LOGIN} element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {routerList.map((r, index) => {
                return <Route path={r.path} element={r.component} key={`router-${index}`} />;
              })}
              <Route path={PATHNAME.COMMING_SOON} element={<ComingSoon />} />
              <Route path="*" element={<Navigate replace to={PATHNAME.KNOWLEDGE} />} />
            </Route>
          </Route>
        </Routes>
      </ConfigProvider>
    </>
  );
}

export default App;
