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
    await user.type(titleInput, "test5");

    const timeInput = screen.getByLabelText("学習時間");
    await user.type(timeInput, "1");

    const addBtn = screen.getByRole("button", { name: "登録" });
    await user.click(addBtn);

    await waitFor(() => {
      const records = screen.getAllByTestId("record");
      expect(records).toHaveLength(5);
    });

    const records = screen.getAllByTestId("record");
    expect(records[4]).toHaveTextContent("test51削除");

    expect(mockAddRecord).toHaveBeenCalledWith("test5", 1);
    expect(mockGetRecords).toHaveBeenCalledTimes(1);
  });

  it("モーダルが新規登録というタイトルになっている", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    const button = screen.getByRole("button", { name: "新規登録" });
    await user.click(button);

    expect(
      screen.getByRole("dialog", { name: "新規登録" })
    ).toBeInTheDocument();
  });

  it("学習内容がないときに登録するとエラーがでる", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    const button = screen.getByRole("button", { name: "新規登録" });
    await userEvent.click(button);

    const titleInput = screen.getByLabelText("学習内容");
    await user.clear(titleInput);

    const timeInput = screen.getByLabelText("学習時間");
    await user.type(timeInput, "1");

    const addBtn = screen.getByRole("button", { name: "登録" });
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

    const button = screen.getByRole("button", { name: "新規登録" });
    await userEvent.click(button);

    const titleInput = screen.getByLabelText("学習内容");
    await user.type(titleInput, "test6");

    const timeInput = screen.getByLabelText("学習時間");
    await user.clear(timeInput);

    const addBtn = screen.getByRole("button", { name: "登録" });
    await user.click(addBtn);

    await waitFor(() => {
      const errorMessage = screen.getByText("時間の入力は必須です");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("削除ができること", async () => {});
});
