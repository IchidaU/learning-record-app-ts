import { ChangeEvent, useEffect } from "react";
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
  FormErrorMessage,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { AddRecord, UpdateRecord } from "../lib/record";
import { useFetchData } from "../hooks/useFetchData";
import { Record } from "../domain/record";

type InputFormProps = {
  isOpen: boolean;
  onClose: () => void;
  editRecord?: Record | null;
};
type FormInputs = {
  title: string;
  time: number;
};

export const InputForm = ({ isOpen, onClose, editRecord }: InputFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      title: "",
      time: 0,
    },
  });
  const { setData } = useFetchData();

  const title = watch("title");
  const time = watch("time");

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) =>
    setValue("title", e.target.value);
  const onChangeTime = (_valueAsString: string, valueAsNumber: number) => {
    if (isNaN(valueAsNumber)) {
      setValue("time", 0);
    } else {
      setValue("time", valueAsNumber);
    }
  };

  useEffect(() => {
    if (editRecord) {
      setValue("title", editRecord.title);
      setValue("time", editRecord.time);
    }
  }, [editRecord, setValue]);

  const onClickAdd = async () => {
    try {
      const formValues = watch();
      let newRecords;

      if (editRecord) {
        newRecords = await UpdateRecord(
          editRecord.id,
          formValues.title,
          formValues.time
        );
      } else {
        newRecords = await AddRecord(formValues.title, formValues.time);
      }
      setData(newRecords);
      reset({ title: "", time: 0 });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const modalTitle = editRecord ? "記録編集" : "新規登録";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="inputForm" onSubmit={handleSubmit(onClickAdd)}>
            <FormControl isInvalid={Boolean(errors.title)}>
              <FormLabel htmlFor="title">学習内容</FormLabel>
              <Input
                id="title"
                {...register("title", { required: "内容の入力は必須です" })}
                type="text"
                value={title}
                onChange={onChangeTitle}
              />
              <FormErrorMessage>
                {errors.title && errors.title.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.time)}>
              <FormLabel htmlFor="time">学習時間</FormLabel>
              <NumberInput
                id="time"
                min={0}
                max={1000}
                value={time}
                onChange={onChangeTime}
              >
                <NumberInputField
                  {...register("time", {
                    required: "時間の入力は必須です",
                    validate: (value) => {
                      if (value === 0 || isNaN(value)) {
                        return "時間の入力は必須です";
                      }
                      if (value < 0) {
                        return "時間は1以上である必要があります";
                      }
                    },
                  })}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
                <FormErrorMessage>
                  {errors.time && errors.time.message}
                </FormErrorMessage>
              </NumberInput>
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>キャンセル</Button>
          <Button
            type="submit"
            form="inputForm"
            isLoading={isSubmitting}
            colorScheme="blue"
            mr={3}
          >
            登録
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
