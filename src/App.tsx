import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button, Heading, useDisclosure } from "@chakra-ui/react";

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
        <InputForm isOpen={isOpen} onClose={onClose} />
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
