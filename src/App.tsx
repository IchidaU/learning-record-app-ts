import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import { RecordList } from "./components/RecordList";
import { InputForm } from "./components/InputForm";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Heading as="h1" data-testid="title">
        学習記録アプリ
      </Heading>
      <ErrorBoundary
        fallback={
          <Heading as="h2" size="md">
            データ取得に失敗しました。
          </Heading>
        }
      >
        <Button onClick={onOpen} colorScheme="blue">
          登録
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>登録画面</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <InputForm onclose={onClose} />
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>キャンセル</Button>
              <Button onClick={onClickAdd} colorScheme="blue" mr={3}>
                登録
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Suspense
          fallback={
            <Heading as="h2" size="md">
              Loading...
            </Heading>
          }
        >
          <RecordList />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
