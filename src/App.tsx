import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Heading } from "@chakra-ui/react";

// import { RecordList } from "./components/RecordList";

function App() {
  const RecordList = lazy(() =>
    import("./components/RecordList").then((module) => ({
      default: module.RecordList,
    }))
  );

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
