import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";

import App from "../App";
import { Record } from "../domain/record";

const mockGetRecords = jest
  .fn()
  .mockResolvedValue([
    new Record("1", "test", 1),
    new Record("2", "test2", 2),
    new Record("3", "test3", 3),
    new Record("4", "test4", 4),
  ]);

jest.mock("../lib/record", () => {
  return {
    GetRecords: () => mockGetRecords(),
  };
});

describe("App", () => {
  it("ローディング画面表示", async () => {
    render(<App />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("記録が4件表示されること", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("table"));
    const rows = screen.getByTestId("table").querySelectorAll("tr");

    expect(rows.length - 1).toBe(4);
  });
});
