import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { RecordList } from "./components/RecordList";

function App() {
  return (
    <>
      <h1 data-testid="title">学習記録アプリ</h1>
      <ErrorBoundary fallback={<h2>データ取得に失敗しました。</h2>}>
        <Suspense fallback={<h2>Loading...</h2>}>
          <RecordList />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
