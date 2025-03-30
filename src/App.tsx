import { Suspense, use } from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { GetRecords } from "./lib/record";

const useRecords = () => {
  const recordsPromise = GetRecords();
  return use(recordsPromise);
};

const RecordList = () => {
  const records = useRecords();

  return (
    <TableContainer>
      <Table variant="simple" data-testid="table">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {records.map((record) => (
            <Tr key={record.id}>
              <Td>{record.title}</Td>
              <Td>{record.time}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

function App() {
  return (
    <>
      <h1 data-testid="title">学習記録アプリ</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <RecordList />
      </Suspense>
    </>
  );
}

export default App;
