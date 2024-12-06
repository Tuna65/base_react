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
  syncFunc?: { onSucess: (data: T) => void; onFailed: (err?: any) => void }
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
      if (response) {
        setData(response);
        setStatus("success");
        setError("null");
        //@ts-ignore
        onSucess(response);
        return response;
      }
    } catch (error: any) {
      //@ts-ignore
      onFailed && onFailed(error ?? {});
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
