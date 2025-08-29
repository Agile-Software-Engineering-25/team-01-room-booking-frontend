import { useState } from 'react';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import { RoomCardComponent } from '@/components/RoomCardComponent/RoomCardComponent';
import { useTranslation } from 'react-i18next';
import { MeetingRoom, Search } from '@mui/icons-material';
import type { Room, Building } from '@/api/generated';

const rooms: Room[] = [
  {
    id: '0198f690-226e-741c-95a8-e2a89bb01383',
    name: '1.21',
    buildingId: '0198f690-75a9-7074-8857-9ffb53f846a0',
    characteristics: [
      {
        type: 'whiteboard',
        value: true,
      },
      {
        type: 'beamer',
        value: true,
      },
    ],
  },
  {
    id: '0398f690-226e-741c-95a8-e2a89bb01385',
    name: '3.08',
    buildingId: '0198f690-75a9-7074-8857-9ffb53f846a1',
    characteristics: [
      {
        type: 'pc',
        value: 10,
      },
    ],
  },
  {
    id: '0498f690-226e-741c-95a8-e2a89bb01386',
    name: '1.12',
    buildingId: '0198f690-75a9-7074-8857-9ffb53f846a1',
    characteristics: [],
  },
];

const buildings: Building[] = [
  {
    id: '0198f690-75a9-7074-8857-9ffb53f846a0',
    name: 'B845',
    address: 'Musterstraße 1, 12345 Musterstadt',
    state: 'open',
  },
  {
    id: '0198f690-75a9-7074-8857-9ffb53f846a1',
    name: 'B846',
    address: 'Musterstraße 2, 12345 Musterstadt',
    state: 'open',
  },
];

function Rooms() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // TODO: buildings
  const findBuilding = (buildingId: string): Building => {
    return buildings.find((building) => building.id === buildingId)!;
  };

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
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box sx={{ position: 'relative', maxWidth: 400 }}>
          <Input
            placeholder={t('pages.rooms.search.placeholder')}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            startDecorator={<Search />}
            sx={{ width: '100%' }}
          />
        </Box>

        <Grid container spacing={2}>
          {filteredRooms.map((room) => (
            <Grid key={room.id}>
              <RoomCardComponent
                room={room}
                building={findBuilding(room.buildingId)}
              />
            </Grid>
          ))}
        </Grid>

        {filteredRooms.length === 0 && (
          <Card sx={{ width: '100%', boxShadow: 'sm' }}>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 6,
              }}
            >
              <MeetingRoom
                sx={{ fontSize: 64, color: 'neutral.softBg', mb: 2 }}
              />
              <Typography level="h3" sx={{ mb: 1 }}>
                {t('pages.rooms.empty.title')}
              </Typography>
              <Typography textColor="text.secondary">
                {searchTerm
                  ? t('pages.rooms.empty.searchNoResults')
                  : t('pages.rooms.empty.noRooms')}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default Rooms;
