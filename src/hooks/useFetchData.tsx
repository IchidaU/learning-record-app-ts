import { use } from "react";
import { GetRecords } from "../lib/record";
import { Record } from "../domain/record";

let recordsPromise: Promise<Record[]> | null = null;

export const useFetchData = () => {
  if (!recordsPromise) {
    recordsPromise = new Promise<Record[]>((resolve) => {
      (async () => {
        const data = await GetRecords();
        resolve(data);
      })();
    });
  }

  const records = use(recordsPromise);

  return { records };
};
