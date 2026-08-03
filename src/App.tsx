import { ConfigProvider } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ComingSoon from "./components/ComingSoon";
import Layout from "./layout/Layout";
import { routerList } from "./pages";
import { configAntdProvider } from "./utils";
import { PATHNAME } from "./utils/Pathname";

function App() {
  return (
    <>
      <ConfigProvider theme={configAntdProvider}>
        <Routes>
          <Route path="/" element={<Navigate replace to={PATHNAME.PREVIEW} />} />

          <Route element={<Layout />}>
            {routerList.map((r, index) => {
              return <Route path={r.path} element={r.component} key={`router-${index}`} />;
            })}
            <Route path={PATHNAME.COMMING_SOON} element={<ComingSoon />} />
            <Route path="*" element={<Navigate replace to={PATHNAME.PREVIEW} />} />
          </Route>
        </Routes>
      </ConfigProvider>
    </>
  );
}

export default App;
