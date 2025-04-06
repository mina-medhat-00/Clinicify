import { render } from "@testing-library/react";
import Signup from "../Signup";
import { BrowserRouter as Router, Routes } from "react-router-dom";
const MockSignup = () => (
  <Router>
    <Signup />
  </Router>
);
describe("Signup", () => {
  it("Signup", () => {
    // render(<MockSignup />);
  });
});
