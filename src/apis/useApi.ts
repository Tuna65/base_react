import { useCallback, useState } from "react";

type AsyncStatus = "idle" | "pending" | "success" | "error";

type AsyncResult<T> = {
  data?: T;
  loading?: boolean;
  status?: AsyncStatus;
  error?: any;
  execute: (...data: any[]) => Promise<T>;
};

const useAsync = <T>(
  callbackPromise: (...data: any[]) => Promise<T>,
  syncFunc?: { onSucess?: (data: T, ...body: any[]) => void; onFailed?: (err?: any, ...body: any[]) => void },
): AsyncResult<T> => {
  const { onSucess, onFailed } = syncFunc || {};
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [error, setError] = useState<any>("");

  const execute = useCallback(async (...dataArgs: any[]): Promise<any> => {
    try {
      setError("null");
      setLoading(true);
      setStatus("pending");
      const response: any = await callbackPromise(...dataArgs);

      if (typeof response?.status === "number" && response.status > 201) {
        throw new Error(JSON.stringify(response));
      }

      if (response !== undefined && response !== null) {
        const result = typeof response?.status === "number" ? response.data : response;
        setData(result);
        setStatus("success");
        setError("null");
        onSucess?.(result, ...dataArgs);
        return result;
      }
    } catch (error: any) {
      let errorPayload = error;
      try {
        errorPayload = JSON.parse(error?.message);
      } catch {
        // Keep the original error when its message is not JSON.
      }
      onFailed?.(errorPayload, ...dataArgs);
      setError(error);
      setStatus("error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [callbackPromise, onFailed, onSucess]);

  return {
    execute,
    data,
    loading,
    status,
    error,
  };
};

export default useAsync;
