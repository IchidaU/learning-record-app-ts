import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Heading } from "@chakra-ui/react";

import { RecordList } from "./components/RecordList";

function App() {
  return (
    <>
      <Heading as="h1" data-testid="title">
        学習記録アプリ
      </Heading>
      <ErrorBoundary fallback={<h2>データ取得に失敗しました。</h2>}>
        <Suspense fallback={<h2>Loading...</h2>}>
          <RecordList />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
