import { BrowserRouter } from 'react-router';
import RoutingComponent from '@components/RoutingComponent/RoutingComponent';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy';
import './i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { client } from '@/api/generated/client.gen.ts';
import { BACKEND_BASE_URL } from '@/config.ts';
import {
  ThemeProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createCustomTheme } from '@agile-software/shared-components';

const theme = createCustomTheme({});

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
          <CssBaseline enableColorScheme />
          <BrowserRouter basename={basename}>
            <RoutingComponent />
          </BrowserRouter>
        </JoyCssVarsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
