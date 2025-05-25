import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";
import { Record } from "../domain/record";

const initialRecords = [
  new Record("1", "test1", 1),
  new Record("2", "test2", 2),
  new Record("3", "test3", 3),
  new Record("4", "test4", 4),
];

const mockGetRecords = jest.fn().mockResolvedValue(initialRecords);
const mockAddRecord = jest
  .fn()
  .mockImplementation((title: string, time: number) => {
    return Promise.resolve([...initialRecords, new Record("5", title, time)]);
  });

jest.mock("../lib/record", () => {
  return {
    GetRecords: () => mockGetRecords(),
    AddRecord: (title: string, time: number) => mockAddRecord(title, time),
  };
});

describe("App", () => {
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

    const button = screen.getByRole("button", { name: "新規登録" });
    await user.click(button);

    const titleInput = screen.getByLabelText("学習内容");
    await user.type(titleInput, "test");

    const timeInput = screen.getByLabelText("学習時間");
    await user.type(timeInput, "1");

    const addBtn = screen.getByRole("button", { name: "登録" });
    await user.click(addBtn);

    await waitFor(() => {
      const records = screen.getAllByTestId("record");
      expect(records).toHaveLength(5);
    });

    const records = screen.getAllByTestId("record");
    expect(records[4]).toHaveTextContent("test1削除");

    expect(mockAddRecord).toHaveBeenCalledWith("test", 1);
    expect(mockGetRecords).toHaveBeenCalledTimes(1);
    screen.debug();
  });
});
