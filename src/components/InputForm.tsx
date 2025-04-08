import { ChangeEvent, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { AddRecord } from "../lib/record";

export const InputForm = ({ onclose }: { onclose: () => void }) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onChangeTime = (valueAsString: string) => setTime(valueAsString);

  const onClickAdd = () => {
    try {
      AddRecord(title, time);
      setTitle("");
      setTime("");
      onclose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormControl>
      <FormLabel>学習内容</FormLabel>
      <Input type="text" value={title} onChange={onChangeTitle} />
      <FormLabel>学習時間</FormLabel>
      <NumberInput min={0} value={time} onChange={onChangeTime}>
        <NumberInputField />
      </NumberInput>
    </FormControl>
  );
};
