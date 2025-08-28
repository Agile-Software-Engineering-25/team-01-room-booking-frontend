import { Box, Button, ButtonGroup, Typography } from '@mui/joy';
import { useColorScheme as useJoyColor } from '@mui/joy/styles';
import { useColorScheme as useMuiColor } from '@mui/material/styles';

function ThemeSelectorComponent() {
  const { setMode } = useJoyColor();
  const { setMode: setMuiMode } = useMuiColor();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
      <ButtonGroup>
        <Button
          onClick={() => {
            setMode('light');
            setMuiMode('light');
          }}
        >
          <Typography>Light</Typography>
        </Button>
        <Button
          onClick={() => {
            setMode('dark');
            setMuiMode('dark');
          }}
        >
          <Typography>Dark</Typography>
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default ThemeSelectorComponent;
