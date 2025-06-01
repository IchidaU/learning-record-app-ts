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

export async function AddRecord(
  title: string,
  time: number
): Promise<Record[]> {
  await supabase
    .from("study-record")
    .insert([
      {
        title: title,
        time: time,
      },
    ])
    .select();

  return GetRecords();
}

export async function DeleteRecord(id: string): Promise<Record[]> {
  await supabase.from("study-record").delete().eq("id", id);
  return GetRecords();
}

export async function UpdateRecord(
  id: string,
  title: string,
  time: number
): Promise<Record[]> {
  await supabase
    .from("study-record")
    .update({ title: title, time: time })
    .eq("id", id);

  return GetRecords();
}
