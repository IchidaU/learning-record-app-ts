import { useEffect, useState } from "react";
import { GetRecords } from "../lib/record";
import { Record } from "../domain/record";

export const useFetchData = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllRecords = async () => {
      try {
        const recordsData = await GetRecords();
        setRecords(recordsData);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    getAllRecords();
  }, []);

  if (loading) {
    throw new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return { records };
};
