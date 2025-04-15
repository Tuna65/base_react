import { useState } from "react";

type AsyncStatus = "idle" | "pending" | "success" | "error";

type AsyncResult<T> = {
  data?: T[];
  loading?: boolean;
  status?: AsyncStatus;
  error?: any;
  execute: (...data: any[]) => Promise<T>;
};

const useAsync = <T>(
  callbackPromise: (...data: any[]) => Promise<T>,
  syncFunc?: { onSucess: (data: T, body: any) => void; onFailed: (err?: any, body?: any) => void }
): AsyncResult<T> => {
  const { onSucess, onFailed } = syncFunc || {};
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [error, setError] = useState<any>("");

  const execute = async (...dataArgs: any[]): Promise<any> => {
    try {
      setError("null");
      setLoading(true);
      setStatus("pending");
      const response: any = await callbackPromise(...dataArgs);

      if (response.status !== 200) throw new Error(JSON.stringify(response));

      if (response) {
        setData(response.data);
        setStatus("success");
        setError("null");
        //@ts-ignore
        onSucess(response.data, ...dataArgs);
        return response.data;
      }
    } catch (error: any) {
      //@ts-ignore
      onFailed && onFailed(JSON.parse(error?.message) ?? {}, ...dataArgs);
      setError(error);
      setStatus("error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    data,
    loading,
    status,
    error,
  };
};

export default useAsync;
