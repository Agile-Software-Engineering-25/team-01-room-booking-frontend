import { BrowserRouter } from 'react-router';
import RoutingComponent from '@components/RoutingComponent/RoutingComponent';
import './i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { client } from '@/api/generated/client.gen.ts';
import { BACKEND_BASE_URL } from '@/config.ts';
import {
  createCustomJoyTheme,
  createCustomMuiTheme,
} from '@agile-software/shared-components';
import {
  CssBaseline,
  THEME_ID as MATERIAL_THEME_ID,
  ThemeProvider,
} from '@mui/material';
import { CssVarsProvider as JoyCssVarsProvider, GlobalStyles } from '@mui/joy';
import './i18n';

const joyTheme = createCustomJoyTheme();
const muiTheme = createCustomMuiTheme();

const queryClient = new QueryClient();

type AppProps = {
  basename?: string;
};
client.setConfig({
  baseUrl: BACKEND_BASE_URL,
});

function App({ basename }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={{ [MATERIAL_THEME_ID]: muiTheme }}>
        <JoyCssVarsProvider
          theme={joyTheme}
          defaultMode="system"
          modeStorageKey="joy-mode"
          colorSchemeStorageKey="joy-color-scheme"
        >
          <CssBaseline />
          <GlobalStyles
            styles={(theme) => ({
              // Ensure html and body have proper background
              html: {
                backgroundColor: theme.vars.palette.background.body,
                minHeight: '100%',
              },
              body: {
                backgroundColor: theme.vars.palette.background.body,
                minHeight: '100vh',
                margin: 0,
                padding: 0,
              },
            })}
          />
          <BrowserRouter basename={basename ?? '/'}>
            <RoutingComponent />
          </BrowserRouter>
        </JoyCssVarsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
