import { useState } from 'react';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import { RoomCard } from '@components/RoomCard/RoomCard.tsx';
import { useTranslation } from 'react-i18next';
import { Add, MeetingRoom, Search } from '@mui/icons-material';
import type { Room, Building } from '@/api/generated';
import { Button } from '@mui/joy';

const rooms: Room[] = [
  {
    id: '0198f690-226e-741c-95a8-e2a89bb01383',
    name: '1.21',
    buildingId: '0198f690-75a9-7074-8857-9ffb53f846a0',
    characteristics: [
      {
        type: 'Whiteboard',
        value: true,
      },
      {
        type: 'Beamer',
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
        type: 'PC',
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
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Card>
          <Typography level={'h4'}>Raumsuche</Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Input
              placeholder={t('pages.rooms.search.placeholder')}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              startDecorator={<Search />}
              sx={{ width: '50%' }}
            />
            <Button startDecorator={<Add />}>
              {t('pages.rooms.actions.create')}
            </Button>
          </Box>
          <Box sx={{ marginTop: 1 }}>
            <Typography>{t('pages.rooms.actions.filter.selected')}</Typography>
            <Typography>{t('pages.rooms.actions.filter.open')}</Typography>
          </Box>
        </Card>

        <Grid
          container
          spacing={2}
          sx={{ justifyContent: { xs: 'flex-start', md: 'center' } }}
        >
          {filteredRooms.map((room) => (
            <Grid
              key={room.id}
              xs={12}
              sm={6}
              md={6}
              lg={4}
              sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'center' },
              }}
            >
              <RoomCard
                room={room}
                building={findBuilding(room.buildingId)}
                onEdit={() => {}}
                onDelete={() => {}}
                onFaulty={() => {}}
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
                paddingY: 6,
              }}
            >
              <MeetingRoom
                sx={{ fontSize: 64, color: 'neutral.softBg', marginBottom: 2 }}
              />
              <Typography level="h3" sx={{ marginBottom: 1 }}>
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
