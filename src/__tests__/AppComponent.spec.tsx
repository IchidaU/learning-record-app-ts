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
  it("ローディング画面表示", async () => {
    mockGetRecords.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockGetRecords()), 10000)
        )
    );

    await act(async () => {
      render(<App />);
    });

    const result = await mockGetRecords.mock.results[0].value;
    console.log(result);

    console.log("初期レンダリング");
    screen.debug();

    await waitFor(() => {
      console.log("データロード後");
      screen.debug();
    });

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  }, 20000);

  // it("記録が4件表示されること", async () => {
  //   render(<App />);

  //   expect(mockGetRecords).toHaveBeenCalled();
  //   await waitFor(() => expect(mockGetRecords).toHaveBeenCalledTimes(1));

  //   await waitFor(() => {
  //     screen.getByTestId("table");
  //     const records = screen.getByTestId("table").querySelectorAll("tr");

  //     expect(records.length - 1).toBe(4);
  //   });
  // });
});
