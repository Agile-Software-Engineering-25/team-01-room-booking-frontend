import { BrowserRouter } from 'react-router';
import RoutingComponent from '@components/RoutingComponent/RoutingComponent';
import { createCustomTheme } from '@agile-software/shared-components';
import { THEME_ID as MATERIAL_THEME_ID, ThemeProvider } from '@mui/material';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy';
import './i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { client } from '@/api/generated/client.gen.ts';
import { BACKEND_BASE_URL } from '@/config.ts';

const theme = createCustomTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          500: '#1ebfbf',
        },
      },
    },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});

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
      <ThemeProvider theme={{ [MATERIAL_THEME_ID]: theme }}>
        <JoyCssVarsProvider>
          <BrowserRouter basename={basename}>
            <RoutingComponent />
          </BrowserRouter>
        </JoyCssVarsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
