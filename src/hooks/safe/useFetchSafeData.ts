import { useState } from "react";

const BASE_URL = "https://safe-client.safe.global/v1/";

const useFetchData = <T>() => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (endpoint: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData: T = await response.json();
      return { data: jsonData };
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchData };
};

export default useFetchData;
