import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import * as recordModule from "../lib/record";

import App from "../App";
import { ChakraProvider } from "@chakra-ui/react";

const mockLogs = [
  {
    id: "1",
    title: "test",
    time: 1,
  },
];

jest.mock("../lib/record", () => ({
  GetRecords: jest.fn(),
}));

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("ローディング画面表示", async () => {
    const getRecordsPromise = new Promise((resolve) =>
      setTimeout(() => resolve(mockLogs), 1000)
    );
    (recordModule.GetRecords as jest.Mock).mockImplementation(
      () => getRecordsPromise
    );

    await act(async () => {
      render(
        <ChakraProvider>
          <App />
        </ChakraProvider>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("データ読み込み後に一覧が表示", async () => {
    const getRecordsPromise = Promise.resolve(mockLogs);
    (recordModule.GetRecords as jest.Mock).mockImplementation(
      () => getRecordsPromise
    );

    await act(async () => {
      render(
        <ChakraProvider>
          <App />
        </ChakraProvider>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId("table")).toBeInTheDocument();
  });
});
