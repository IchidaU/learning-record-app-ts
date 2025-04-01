import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { useFetchData } from "../hooks/useFetchData";

export const RecordList = () => {
  const { records, loading, error } = useFetchData();

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  if (!records || records.length === 0) {
    return <div>データがありません</div>;
  }

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
