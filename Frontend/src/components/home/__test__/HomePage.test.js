import { render } from "@testing-library/react";
import HomePage from "../HomePage";
import { HomeContextProvider, UserContextProvider } from "../../../contexts";
import { BrowserRouter as Router } from "react-router-dom";
const MockHome = () => (
  <Router>
    <UserContextProvider>
      <HomeContextProvider>
        <HomePage />
      </HomeContextProvider>
    </UserContextProvider>
  </Router>
);
describe("Home", () => {
  it("Home", () => {
    // render(<MockHome />);
  });
});
