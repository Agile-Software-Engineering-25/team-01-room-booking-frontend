import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import { BuildingCardComponent } from '@components/BuildingCardComponent/BuildingCardComponent.tsx';
import type { Building } from '@/api/generated/types.gen';

const buildings: Building[] = [
  {
    name: 'B852',
    address: 'Industriepark Höchst, Gebäude B 852',
    id: '122',
    description: 'Hauptgebäude Unicampus 123 Test',
    state: 'open',
  },
  {
    name: 'B853',
    address: 'Industriepark Höchst, Gebäude B 853',
    id: '123',
    description: 'Nebengebäude Unicampus 124 Test',
    state: 'open',
  },
  {
    name: 'B854',
    address: 'Industriepark Höchst, Gebäude B 854',
    id: '124',
    description: 'Verwaltung Unicampus 125 Test',
    state: 'open',
  },
  {
    name: 'B854',
    address: 'Industriepark Höchst, Gebäude B 854',
    id: '125',
    description: 'Verwaltung Unicampus 125 Test',
    state: 'closed',
  },
];

function Buildings() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        padding: 2,
      }}
    >
      <Box>
        <Grid container spacing={2}>
          {buildings.map((building) => (
            <Grid key={building.id}>
              <BuildingCardComponent building={building} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Buildings;
