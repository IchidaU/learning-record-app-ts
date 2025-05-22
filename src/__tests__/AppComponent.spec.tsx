import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";

import App from "../App";
import { Record } from "../domain/record";

const mockGetRecords = jest
  .fn()
  .mockResolvedValue([
    new Record("1", "test1", 1),
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
});
