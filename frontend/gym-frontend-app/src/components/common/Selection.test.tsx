
import { render, screen, fireEvent } from "@testing-library/react";
import DropdownField from "./Selection"; // adjust the path as needed

describe("DropdownField", () => {
  const options = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ];

  const mockOnChange = jest.fn();

  const defaultProps = {
    label: "Fruits",
    name: "fruits",
    options,
    onChange: mockOnChange,
    value: "",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the label", () => {
    render(<DropdownField {...defaultProps} />);
    expect(screen.getByText("Fruits")).toBeInTheDocument();
  });

  it("opens the dropdown and displays all options", () => {
    render(<DropdownField {...defaultProps} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it("calls onChange with the selected value", () => {
    render(<DropdownField {...defaultProps} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    const optionToClick = screen.getByText("Banana");
    fireEvent.click(optionToClick);

    expect(mockOnChange).toHaveBeenCalledWith("banana");
  });
});
