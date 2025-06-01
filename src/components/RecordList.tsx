import {
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";

import { DeleteRecord } from "../lib/record";
import { useFetchData } from "../hooks/useFetchData";

type RecordListProps = {
  onDataChange: () => void;
};

export const RecordList = ({ onDataChange }: RecordListProps) => {
  const { records, setData } = useFetchData();

  const onClickDelete = async (id: string) => {
    const updateRecords = await DeleteRecord(id);
    setData(updateRecords);
    onDataChange();
  };

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
          {records.length === 0 ? (
            <Tr>
              <Td colSpan={3} textAlign="center">
                <Text fontSize="xl">記録はありません</Text>
              </Td>
            </Tr>
          ) : (
            records.map((record) => (
              <Tr key={record.id} data-testid="record">
                <Td>{record.title}</Td>
                <Td>{record.time}</Td>
                <Td>
                  <IconButton aria-label="edit" icon={<MdEdit />} />
                </Td>
                <Td>
                  <IconButton
                    aria-label="delete"
                    icon={<MdDelete />}
                    onClick={() => onClickDelete(record.id)}
                  />
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
