import { Routes, Route, BrowserRouter } from "react-router";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import { Offline } from "./Offline";

function App() {
  return (
    <BrowserRouter>
      <Offline />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;