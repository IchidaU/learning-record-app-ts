import { useEffect, useState } from "react";
import { GetRecords } from "../lib/record";
import { Record } from "../domain/record";

export const useFetchData = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("useEffect in useFetchData is running");
    const getAllRecords = async () => {
      try {
        console.log("fetching data");
        const recordsData = await GetRecords();
        console.log("Records fetched", recordsData);
        setRecords(recordsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching records:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
      }
      setLoading(false);
    };

    getAllRecords();
  }, []);

  //   if (error) {
  //     throw error;
  //   }

  //   if (loading) {
  //     throw new Promise((resolve) => setTimeout(resolve, 1000));
  //   }

  return { records, loading, error };
};
