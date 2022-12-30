import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import themes from "./config/themes";
import CustomRouter from "./components/CustomRouter";
import { useSelector } from "react-redux";

function App() {
  const currentTheme = useSelector((state) => state.themeReducer.theme);
  const theme = (theme) =>
    createMuiTheme({
      palette: themes[theme],
    });
  return (
    <ThemeProvider theme={theme(currentTheme)}>
      <CustomRouter />
    </ThemeProvider>
  );
}

export default App;
