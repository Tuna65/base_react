import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ComingSoon from "./components/ComingSoon";
import Layout from "./layout/Layout";
import ProtectedRoute from "./layout/ProtectedRoute";
import { Login, Register, routerList } from "./pages";
import LoginLayout from "./pages/auth";
import { configAntdProvider } from "./utils";
import { PATHNAME } from "./utils/Pathname";

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={configAntdProvider}>
          <Routes>
            <Route path="/" element={<Navigate replace to={PATHNAME.AUTH.LOGIN} />} />
            <Route element={<LoginLayout />}>
              <Route path={PATHNAME.AUTH.LOGIN} element={<Login />} />
              <Route path={PATHNAME.AUTH.REGISTER} element={<Register />} />
            </Route>
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                {routerList.map((r, index) => {
                  return <Route path={r.path} element={r.component} key={`router-${index}`} />;
                })}
                <Route path={PATHNAME.COMMING_SOON} element={<ComingSoon />} />
                <Route path="*" element={<Navigate replace to={PATHNAME.COMMING_SOON} />} />
              </Route>
            </Route>
          </Routes>
        </ConfigProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
