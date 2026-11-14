
import { BrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import "./layouts/MainLayout.scss";
import "./styles/global.scss";

function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;
