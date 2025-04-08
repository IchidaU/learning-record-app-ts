import { Record } from "../domain/record";
import { supabase } from "../utils/supabase";

export async function GetRecords(): Promise<Record[]> {
  const response = await supabase.from("study-record").select("*");
  if (response.error) {
    throw new Error(response.error.message);
  }

  const recordsData = response.data.map((record) => {
    return new Record(record.id, record.title, record.time);
  });

  return recordsData;
}
