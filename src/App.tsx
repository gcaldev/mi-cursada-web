import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./config/theme";
import { StudentFormPage } from "./pages/StudentFormPage";
import { ResultsPage } from "./pages/ResultsPage";
import { ApprovedCoursesPage } from "./pages/ApprovedCoursesPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StudentFormPage />} />
          <Route path="/resultados" element={<ResultsPage />} />
          <Route path="/materias-aprobadas" element={<ApprovedCoursesPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
