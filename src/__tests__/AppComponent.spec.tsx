import "@testing-library/jest-dom";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";
import { Record } from "../domain/record";
import { resetRecordsPromise } from "../hooks/useFetchData";

const initialRecords = [
  new Record("1", "test1", 1),
  new Record("2", "test2", 2),
  new Record("3", "test3", 3),
  new Record("4", "test4", 4),
];

const mockGetRecords = jest.fn();
const mockAddRecord = jest.fn();
const mockDeleteRecord = jest.fn();
const mockUpdateRecord = jest.fn();

jest.mock("../lib/record", () => {
  return {
    GetRecords: () => mockGetRecords(),
    AddRecord: (title: string, time: number) => mockAddRecord(title, time),
    DeleteRecord: (id: string) => mockDeleteRecord(id),
    UpdateRecord: (id: string, title: string, time: number) =>
      mockUpdateRecord(id, title, time),
  };
});

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();

    resetRecordsPromise();

    mockGetRecords.mockResolvedValue([...initialRecords]);

    mockAddRecord.mockImplementation((title: string, time: number) => {
      return Promise.resolve([...initialRecords, new Record("5", title, time)]);
    });

    mockDeleteRecord.mockImplementation((id: string) => {
      const filteredRecords = initialRecords.filter(
        (record) => record.id !== id
      );
      return Promise.resolve([...filteredRecords]);
    });

    mockUpdateRecord.mockImplementation(
      (id: string, title: string, time: number) => {
        const updatedRecords = initialRecords.map((record) =>
          record.id === id ? new Record(record.id, title, time) : record
        );
        return Promise.resolve([...updatedRecords]);
      }
    );
  });

  it("記録が4件表示されること", async () => {
    await act(async () => {
      render(<App />);
    });

    expect(mockGetRecords).toHaveBeenCalled();
    await waitFor(() => expect(mockGetRecords).toHaveBeenCalledTimes(1));

    const table = await screen.findByTestId("table");
    const rows = table.querySelectorAll("tr");
    expect(rows.length - 1).toBe(4);
  });

  it("新規登録ボタンがある", async () => {
    await act(async () => {
      render(<App />);
    });

    expect(
      screen.getByRole("button", { name: "新規登録" })
    ).toBeInTheDocument();
  });

  it("タイトルがあること", async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByTestId("title")).toBeInTheDocument();
  });

  it("登録できること", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    const registerBtn = screen.getByRole("button", { name: "新規登録" });
    await user.click(registerBtn);

    const titleInput = await screen.findByLabelText("学習内容");
    const timeInput = screen.getByLabelText("学習時間");
    const addBtn = screen.getByRole("button", { name: "登録" });

    await user.type(titleInput, "test5");
    await user.type(timeInput, "1");
    await user.click(addBtn);

    await waitFor(() => {
      const records = screen.getAllByTestId("record");
      expect(records).toHaveLength(5);
    });

    const records = screen.getAllByTestId("record");
    expect(records[4]).toHaveTextContent("test51");

    expect(mockAddRecord).toHaveBeenCalledWith("test5", 1);
  });

  it("モーダルが新規登録というタイトルになっている", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    const registerBtn = screen.getByRole("button", { name: "新規登録" });
    await user.click(registerBtn);

    expect(
      screen.getByRole("dialog", { name: "新規登録" })
    ).toBeInTheDocument();
  });

  it("学習内容がないときに登録するとエラーがでる", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    const registerBtn = screen.getByRole("button", { name: "新規登録" });
    await userEvent.click(registerBtn);

    const titleInput = screen.getByLabelText("学習内容");
    const timeInput = screen.getByLabelText("学習時間");
    const addBtn = screen.getByRole("button", { name: "登録" });

    await user.clear(titleInput);
    await user.type(timeInput, "1");
    await user.click(addBtn);

    await waitFor(() => {
      const errorMessage = screen.getByText("内容の入力は必須です");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("学習時間がないときに登録するとエラーがでる", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    const registerBtn = screen.getByRole("button", { name: "新規登録" });
    await userEvent.click(registerBtn);

    const titleInput = screen.getByLabelText("学習内容");
    const timeInput = screen.getByLabelText("学習時間");
    const addBtn = screen.getByRole("button", { name: "登録" });

    await user.type(titleInput, "test7");
    await user.clear(timeInput);
    await user.click(addBtn);

    await waitFor(() => {
      const errorMessage = screen.getByText("時間の入力は必須です");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("削除ができること", async () => {
    mockGetRecords.mockResolvedValue([...initialRecords]);

    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId("record")).toHaveLength(4);
    });

    const deleteBtn = screen.getAllByRole("button", { name: "delete" });
    await user.click(deleteBtn[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId("record")).toHaveLength(3);
    });

    const recordsAfterDelete = screen.getAllByTestId("record");

    for (const record of recordsAfterDelete) {
      expect(record.textContent).not.toContain("test1");
    }

    expect(mockDeleteRecord).toHaveBeenCalledWith("1");
    expect(mockGetRecords).toHaveBeenCalledTimes(1);
  });

  it("モーダルのタイトルが記録編集である", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    const editBtn = screen.getAllByRole("button", { name: "edit" });
    await user.click(editBtn[0]);

    expect(
      screen.getByRole("dialog", { name: "記録編集" })
    ).toBeInTheDocument();
  });

  it("編集して登録すると更新される", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    const editBtn = screen.getAllByRole("button", { name: "edit" });
    await user.click(editBtn[0]);

    const titleEdit = screen.getByLabelText("学習内容");
    const timeEdit = screen.getByLabelText("学習時間");
    const submitBtn = screen.getByRole("button", { name: "登録" });

    await user.clear(titleEdit);
    await user.type(titleEdit, "test10");
    await user.clear(timeEdit);
    await user.type(timeEdit, "10");

    await user.click(submitBtn);

    await waitFor(() => {
      const records = screen.getAllByTestId("record");
      expect(records[0]).toHaveTextContent("test1010");
    });
  });
});
