import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: "'Barlow','Raleway','Roboto'",
    // useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#be4962',
      main: '#891438',
      dark: '#560013',
      contrastText: '#E0C1CB',
    },
    secondary: {
      light: '#ffd776',
      main: '#efa647',
      dark: '#b87714',
      contrastText: '#000000',
    }
  },
});

export default theme;