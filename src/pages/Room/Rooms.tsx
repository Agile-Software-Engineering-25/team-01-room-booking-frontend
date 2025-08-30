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
import { type Room, type Building, type Characteristic } from '@/api/generated';
import { Button, Chip, Stack } from '@mui/joy';
import { useQuery } from '@tanstack/react-query';
import {
  getBuildingsOptions,
  getRoomsOptions,
} from '@/api/generated/@tanstack/react-query.gen.ts';

interface Filter extends Characteristic {
  label: string;
}

function Rooms() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);

  const { data: roomData } = useQuery({
    ...getRoomsOptions(),
  });
  const rooms = roomData?.rooms ?? [];

  const { data: buildingData } = useQuery({
    ...getBuildingsOptions(),
  });
  const buildings = buildingData?.buildings ?? [];

  const availableEquipmentTypes = new Set(
    rooms.flatMap((room) =>
      room.characteristics
        .filter((characteristic) => typeof characteristic.value === 'boolean')
        .map((characteristic) => characteristic.type.toLowerCase())
    )
  );

  const capacityFilters: Filter[] = ['small', 'medium', 'large'].map(
    (size) => ({
      type: 'seats',
      value: size,
      label:
        t('pages.rooms.actions.filter.seats') +
        ': ' +
        t(`pages.rooms.actions.filter.seats-${size}`),
    })
  );

  const equipmentFilters: Filter[] = Array.from(availableEquipmentTypes).map(
    (type) => ({
      type: type,
      value: type,
      label:
        t('pages.rooms.actions.filter.equipment') +
        ': ' +
        type.charAt(0).toUpperCase() +
        type.slice(1).toLowerCase(),
    })
  );

  const allFilters = [...equipmentFilters, ...capacityFilters];

  const inactiveFilters = allFilters.filter(
    (filter) =>
      !activeFilters.some(
        (activeFilter) =>
          activeFilter.type === filter.type &&
          activeFilter.value === filter.value
      )
  );

  const toggleFilter = (filter: Filter) => {
    const isActive = activeFilters.some(
      (activeFilter) =>
        activeFilter.type === filter.type && activeFilter.value === filter.value
    );

    if (isActive) {
      setActiveFilters(
        activeFilters.filter(
          (activeFilter) =>
            !(
              activeFilter.type === filter.type &&
              activeFilter.value === filter.value
            )
        )
      );
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  const filterRooms = (room: Room): boolean => {
    const matchesSearch = room.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (!matchesSearch) {
      return false;
    }

    if (activeFilters.length === 0) {
      return true;
    }

    return activeFilters.every((filter) => {
      if (filter.type === 'seats') {
        const capacityChar = room.characteristics.find(
          (char) => char.type === 'SEATS' && typeof char.value === 'number'
        );
        const capacity = capacityChar ? Number(capacityChar.value) : -1;
        switch (filter.value) {
          case 'small':
            return capacity <= 25;
          case 'medium':
            return capacity > 25 && capacity <= 35;
          case 'large':
            return capacity > 35;
          default:
            return true;
        }
      } else {
        const characteristic = room.characteristics.find(
          (char) => char.type.toLowerCase() === filter.type.toLowerCase()
        );
        return (
          characteristic &&
          (typeof characteristic.value === 'boolean'
            ? characteristic.value
            : characteristic.value !== undefined)
        );
      }
    });
  };

  const filteredRooms = rooms.filter(filterRooms);

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
            {activeFilters.length > 0 && (
              <>
                <Typography level="body-md" sx={{ mb: 1 }}>
                  Aktive Filter
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: 'wrap', gap: 0.1, marginBottom: 1 }}
                >
                  {activeFilters.map((filter) => (
                    <Chip
                      key={`${filter.type}-${filter.value}`}
                      color="primary"
                      variant="soft"
                      onClick={() => toggleFilter(filter)}
                    >
                      {filter.label}
                    </Chip>
                  ))}
                  <Chip
                    variant="outlined"
                    color="neutral"
                    onClick={clearFilters}
                  >
                    Alle löschen
                  </Chip>
                </Stack>
              </>
            )}
            <Typography level="body-md" sx={{ marginBottom: 1 }}>
              Filter
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: 'wrap', gap: 0.1 }}
            >
              {inactiveFilters.map((filter) => (
                <Chip
                  key={`inactive-${filter.type}-${filter.value}`}
                  variant="outlined"
                  color="neutral"
                  onClick={() => toggleFilter(filter)}
                >
                  {filter.label}
                </Chip>
              ))}
            </Stack>
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
                {searchTerm || activeFilters.length > 0
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
