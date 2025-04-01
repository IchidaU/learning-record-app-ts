import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { RecordList } from "./components/RecordList";

function App() {
  return (
    <>
      <h1 data-testid="title">学習記録アプリ</h1>
      <ErrorBoundary fallback={<div>データ取得に失敗しました。</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <RecordList />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
