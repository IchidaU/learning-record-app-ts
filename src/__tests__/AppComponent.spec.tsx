import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import App from "../App";

import { Record } from "../domain/record";

let mockRecords: Record[] = [];

jest.mock("../lib/record", () => ({
  GetRecords: jest.fn(() => Promise.resolve(mockRecords)),
  AddRecord: jest.fn(() => Promise.resolve(mockRecords)),
  DeleteRecord: jest.fn(() => Promise.resolve(mockRecords)),
}));

beforeEach(() => {
  mockRecords = [new Record("1", "test", 1), new Record("2", "test2", 2)];
});

describe("App", () => {
  it("ローディング画面表示", async () => {
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
