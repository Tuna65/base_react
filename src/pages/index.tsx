import { TRouterList } from "@/models";
import { PATHNAME } from "@/utils/Pathname";
import { Spin } from "antd";
import { Suspense, lazy } from "react";

const LazyLayout = (importStatement: () => Promise<any>) => {
  const Component = lazy(importStatement);

  return (
    <Suspense
      fallback={
        <div className="flex-center h-full">
          <Spin size="large" />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};

export const Preview = () => LazyLayout(() => import("./preview"));
export const JiraPage = () => LazyLayout(() => import("./jira"));

export const routerList: TRouterList[] = [
  {
    path: PATHNAME.PREVIEW,
    component: <Preview />,
  },
  {
    path: PATHNAME.JIRA.INDEX,
    component: <JiraPage />,
  },
];
