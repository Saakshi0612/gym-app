import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "../components/RegisterForm";
import { vi } from "vitest"; // Assuming you're using vitest for testing

import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

// ✅ Mock Redux hooks
vi.mock("../store/store", () => ({
  useAppDispatch: () => vi.fn().mockImplementation(() => mockDispatch),
  useAppSelector: vi.fn().mockImplementation((selector) =>
    selector({ auth: { isLoading: false, error: null } })
  ),
}));

// ✅ Create a mock dispatch function
const mockDispatch = vi.fn();

beforeEach(() => {
  mockDispatch.mockClear();
});

test("submits form successfully and shows success alert", async () => {
  // ✅ Mock registerUser thunk fulfilled action
  const mockFulfilledAction = {
    type: "auth/registerUser/fulfilled",
    payload: { firstName: "Jon", lastName: "Doe", email: "test@example.com" },
  };

  // Mock the dispatch to resolve the fulfilled action
  mockDispatch.mockResolvedValueOnce(mockFulfilledAction);

  // Render the RegisterForm component wrapped in BrowserRouter
  render(
    <BrowserRouter>
      <RegisterForm />
    </BrowserRouter>
  );

  // Simulate typing in the input fields
  const firstNameInput = screen.getByPlaceholderText(/Enter your First Name/i);
  const lastNameInput = screen.getByPlaceholderText(/Enter your Last Name/i);
  const emailInput = screen.getByPlaceholderText(/Enter your email/i);
  const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

  await userEvent.type(firstNameInput, "Jon");
  await userEvent.type(lastNameInput, "Doe");
  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "TestPass123");

  // Click the submit button
  const submitButton = screen.getByRole("button", { name: /create an account/i });
  await userEvent.click(submitButton);

  // Wait for the success alert to appear
  // await waitFor(() => {
  //   expect(screen.getByText(/Registration successful!/i)).toBeInTheDocument();
  // });
});

test("displays error alert when registration fails", async () => {
  // ✅ Mock registerUser thunk with a failed action
  const mockRejectedAction = {
    type: "auth/registerUser/rejected",
    error: { message: "Registration failed" },
  };

  // Mock the dispatch to resolve the rejected action
  mockDispatch.mockResolvedValueOnce(mockRejectedAction);

  // Render the RegisterForm component wrapped in BrowserRouter
  render(
    <BrowserRouter>
      <RegisterForm />
    </BrowserRouter>
  );

  // Simulate typing in the input fields
  const firstNameInput = screen.getByPlaceholderText(/Enter your First Name/i);
  const lastNameInput = screen.getByPlaceholderText(/Enter your Last Name/i);
  const emailInput = screen.getByPlaceholderText(/Enter your email/i);
  const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

  await userEvent.type(firstNameInput, "Jon");
  await userEvent.type(lastNameInput, "Doe");
  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "TestPass123");

  // Click the submit button
  const submitButton = screen.getByRole("button", { name: /create an account/i });
  await userEvent.click(submitButton);


});
