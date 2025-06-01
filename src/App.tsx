import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Box, Button, Center, Heading, useDisclosure } from "@chakra-ui/react";

import { RecordList } from "./components/RecordList";
import { InputForm } from "./components/InputForm";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Center mb="4">
        <Heading as="h1" data-testid="title">
          学習記録アプリ
        </Heading>
      </Center>
      <Box maxW="md" mx="auto">
        <Box>
          <Button onClick={onOpen} colorScheme="blue">
            新規登録
          </Button>
        </Box>
        <InputForm isOpen={isOpen} onClose={onClose} />
        <ErrorBoundary
          fallback={
            <Heading as="h2" size="md">
              データ取得に失敗しました。
            </Heading>
          }
        >
          <Suspense
            fallback={
              <Heading as="h2" size="md" data-testid="loading">
                Loading...
              </Heading>
            }
          >
            <RecordList key={refreshKey} onDataChange={refreshData} />
          </Suspense>
        </ErrorBoundary>
      </Box>
    </>
  );
}

export default App;
