import { use } from "react";
import { GetRecords } from "../lib/record";
import { Record } from "../domain/record";

let recordsPromise: Promise<Record[]> | null = null;

export const useFetchData = () => {
  if (!recordsPromise) {
    recordsPromise = new Promise<Record[]>((resolve) => {
      (async () => {
        const records = await GetRecords();
        resolve(records);
      })();
    });
  }

  const records = use(recordsPromise);

  const updateRecords = (newRecords: Record[]) => {
    recordsPromise = null;
    recordsPromise = Promise.resolve(newRecords);
  };

  return { records, setData: updateRecords };
};
