import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    fontFamily: "'Raleway','Barlow','Roboto'",
    useNextVariants: true
  },
  palette: {
    primary: {
      light: "#be4962",
      main: "#891438",
      dark: "#560013",
      contrastText: "#E0C1CB"
    },
    secondary: {
      light: "#ffd776",
      main: "#efa647",
      dark: "#b87714",
      contrastText: "#000000"
    },
    error: {
      main: "#f44336"
    }
  }

  // palette: {
  //   primary: {
  //     light: '#344673',
  //     main: '#001f47',
  //     dark: '#000020',
  //     contrastText: '#E0C1CB',
  //   },
  //   secondary: {
  //     light: '#9ce9e1',
  //     main: '#6bb7af',
  //     dark: '#3a8780',
  //     contrastText: '#000000',
  //   }
  // },
});

export default theme;
