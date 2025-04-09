import { ChangeEvent, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Button,
} from "@chakra-ui/react";

import { AddRecord } from "../lib/record";
import { refetchRecords } from "../hooks/useFetchData";

type InputFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const InputForm = ({ isOpen, onClose }: InputFormProps) => {
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
      onClose();
      refetchRecords();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>登録画面</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>学習内容</FormLabel>
            <Input type="text" value={title} onChange={onChangeTitle} />
            <FormLabel>学習時間</FormLabel>
            <NumberInput min={0} value={time} onChange={onChangeTime}>
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>キャンセル</Button>
          <Button onClick={onClickAdd} colorScheme="blue" mr={3}>
            登録
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
