import { render, screen, act } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import App from "../App";

jest.mock("../hooks/useFetchData", () => ({
  useFetchData: () => ({
    records: [],
    setData: jest.fn(),
  }),
}));

describe("title", () => {
  it("should render title", async () => {
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
    await act(() => screen.getByTestId("title"));
    expect(screen.getByTestId("title")).toHaveTextContent("学習記録アプリ");
  });
});
