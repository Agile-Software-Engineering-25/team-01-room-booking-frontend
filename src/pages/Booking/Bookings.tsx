import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Input,
  Option,
  Select,
  Sheet,
  Stack,
  Typography,
} from '@mui/joy';
import {
  AccessTime,
  Apartment,
  CalendarMonth,
  Close,
  FilterList,
  LocationOn,
  Search,
} from '@mui/icons-material';
import JoyDateTimePicker from '@/components/DateTimePickers/JoyDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  getAllBookingsOptions,
  getBuildingsOptions,
  getRoomsOptions,
} from '@/api/generated/@tanstack/react-query.gen.ts';
import type { Booking, Building, Room } from '@/api/generated';

dayjs.locale('de');

interface EnhancedBooking {
  id: string;
  startTime: string;
  endTime: string;
  roomId: string;
  roomName: string;
  buildingName: string;
  lecturerCount: number;
  studentGroupCount: number;
}

function Bookings() {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [dateTimeFrom, setDateTimeFrom] = useState<Dayjs | null>(null);
  const [dateTimeTo, setDateTimeTo] = useState<Dayjs | null>(null);

  const {
    data: bookingsResp,
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
  } = useQuery({
    ...getAllBookingsOptions(),
  });
  const {
    data: roomsResp,
    isLoading: isLoadingRooms,
    isError: isErrorRooms,
  } = useQuery({
    ...getRoomsOptions(),
  });
  const {
    data: buildingsResp,
    isLoading: isLoadingBuildings,
    isError: isErrorBuildings,
  } = useQuery({
    ...getBuildingsOptions(),
  });

  const enhancedBookings: EnhancedBooking[] = useMemo(() => {
    const bookings: Booking[] = bookingsResp ?? [];
    const rooms: Room[] = roomsResp?.rooms ?? [];
    const buildings: Building[] = buildingsResp?.buildings ?? [];

    if (bookings.length === 0 || rooms.length === 0 || buildings.length === 0) {
      return [];
    }

    return bookings.map((booking) => {
      const room = rooms.find((room) => room.id === booking.roomId);
      const building = buildings.find(
        (building) => building.id === room?.buildingId
      );
      return {
        id: booking.id,
        roomId: booking.roomId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        roomName: room?.name ?? '-',
        buildingName: building?.name ?? '-',
        lecturerCount: booking.lecturerIds?.length ?? 0,
        studentGroupCount: booking.studentGroupIds?.length ?? 0,
      } as EnhancedBooking;
    });
  }, [bookingsResp, roomsResp, buildingsResp]);

  const sortedBuildings = useMemo(() => {
    const buildings: Building[] = buildingsResp?.buildings ?? [];
    return buildings
      .map((building) => building.name)
      .sort((left, right) => left.localeCompare(right));
  }, [buildingsResp]);

  const uniqueRooms = useMemo(() => {
    const rooms: Room[] = roomsResp?.rooms ?? [];
    const buildings: Building[] = buildingsResp?.buildings ?? [];

    const filteredRooms =
      buildingFilter === 'all'
        ? rooms
        : rooms.filter((room) => {
            const building = buildings.find(
              (building) => building.id === room.buildingId
            );
            return building?.name === buildingFilter;
          });

    const labels = filteredRooms.map((room) => {
      const building = buildings.find(
        (building) => building.id === room.buildingId
      );
      const buildingName = building?.name ?? '-';
      return `${buildingName}-${room.name}`;
    });

    return labels.sort((left, right) => left.localeCompare(right));
  }, [roomsResp, buildingsResp, buildingFilter]);

  const filteredBookings = useMemo(() => {
    return enhancedBookings.filter((booking) => {
      const matchesSearch =
        booking.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.buildingName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all';

      const matchesBuilding =
        buildingFilter === 'all' || booking.buildingName === buildingFilter;

      const matchesRoom =
        roomFilter === 'all' ||
        `${booking.buildingName}-${booking.roomName}` === roomFilter;

      // Zeitfilter
      let matchesDateTime = true;
      if (dateTimeFrom || dateTimeTo) {
        const bookingStart = dayjs(booking.startTime);
        const bookingEnd = dayjs(booking.endTime);
        const filterStart = dateTimeFrom ?? null;
        const filterEnd = dateTimeTo ?? null;

        if (filterStart && filterEnd) {
          matchesDateTime =
            bookingStart.isBefore(filterEnd) && bookingEnd.isAfter(filterStart);
        } else if (filterStart) {
          matchesDateTime =
            bookingStart.isAfter(filterStart) ||
            bookingStart.isSame(filterStart);
        } else if (filterEnd) {
          matchesDateTime =
            bookingStart.isBefore(filterEnd) || bookingStart.isSame(filterEnd);
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesBuilding &&
        matchesRoom &&
        matchesDateTime
      );
    });
  }, [
    enhancedBookings,
    searchTerm,
    statusFilter,
    buildingFilter,
    roomFilter,
    dateTimeFrom,
    dateTimeTo,
  ]);

  const clearDateFilters = () => {
    setDateTimeFrom(null);
    setDateTimeTo(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          bg: 'primary.softBg',
          text: 'primary.solidColor',
          border: 'primary.outlinedBorder',
        };
      case 'active':
        return {
          bg: 'success.softBg',
          text: 'success.solidColor',
          border: 'success.outlinedBorder',
        };
      default:
        return {
          bg: 'neutral.softBg',
          text: 'neutral.solidColor',
          border: 'neutral.outlinedBorder',
        };
    }
  };

  const formatTime = (iso: string) => dayjs(iso).format('HH:mm');
  const formatDate = (iso: string) => dayjs(iso).format('ddd, DD. MMM YYYY');

  if (isLoadingBookings || isLoadingRooms || isLoadingBuildings) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isErrorBookings || isErrorRooms || isErrorBuildings) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography color="danger">
          {t('common.error.loading', 'Fehler beim Laden der Daten')}
        </Typography>
        <Typography>
          {t('common.error.tryAgain', 'Bitte versuchen Sie es später erneut')}
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            <Typography level="h4">
              {t('pages.bookings.title', 'Buchungen')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  width: '100%',
                }}
              >
                <Input
                  placeholder={t(
                    'pages.bookings.search.placeholder',
                    'Buchungen durchsuchen...'
                  )}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  startDecorator={<Search />}
                  sx={{ flex: 1 }}
                />

                <Select
                  placeholder="Status filtern"
                  value={statusFilter}
                  onChange={(_event, value) => setStatusFilter(value || 'all')}
                  startDecorator={<FilterList />}
                  sx={{ minWidth: 150 }}
                >
                  <Option value="all">
                    {t('pages.bookings.filters.statusAll', 'Alle Status')}
                  </Option>
                  <Option value="scheduled">
                    {t('pages.bookings.filters.statusScheduled', 'Geplant')}
                  </Option>
                  <Option value="active">
                    {t('pages.bookings.filters.statusActive', 'Aktiv')}
                  </Option>
                </Select>

                <Select
                  placeholder="Gebäude filtern"
                  value={buildingFilter}
                  onChange={(_event, value) =>
                    setBuildingFilter(value || 'all')
                  }
                  startDecorator={<Apartment />}
                  sx={{ minWidth: 150 }}
                >
                  <Option value="all">
                    {t('pages.bookings.filters.buildingAll', 'Alle Gebäude')}
                  </Option>
                  {sortedBuildings.map((buildings) => (
                    <Option key={buildings} value={buildings}>
                      {buildings}
                    </Option>
                  ))}
                </Select>

                <Select
                  placeholder="Raum filtern"
                  value={roomFilter}
                  onChange={(_event, value) => setRoomFilter(value || 'all')}
                  startDecorator={<LocationOn />}
                  sx={{ minWidth: 150 }}
                >
                  <Option value="all">
                    {t('pages.bookings.filters.roomAll', 'Alle Räume')}
                  </Option>
                  {uniqueRooms.map((room) => (
                    <Option key={room} value={room}>
                      {room}
                    </Option>
                  ))}
                </Select>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Typography level="body-sm" sx={{ whiteSpace: 'nowrap' }}>
                    {t('pages.bookings.filters.dateRange', 'Zeitraum:')}
                  </Typography>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    alignItems="center"
                  >
                    <JoyDateTimePicker
                      label={t('pages.bookings.filters.fromDate', 'Von Datum')}
                      value={dateTimeFrom}
                      onChange={setDateTimeFrom}
                    />
                    <JoyDateTimePicker
                      label={t('pages.bookings.filters.toDate', 'Bis Datum')}
                      value={dateTimeTo}
                      onChange={setDateTimeTo}
                    />

                    {(dateTimeFrom || dateTimeTo) && (
                      <IconButton
                        size="sm"
                        variant="plain"
                        color="neutral"
                        onClick={clearDateFilters}
                      >
                        <Close />
                      </IconButton>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Card>
          <Stack spacing={2}>
            {filteredBookings.map((booking) => {
              const statusColors = getStatusColor('active');
              return (
                <Card
                  key={booking.id}
                  sx={{
                    boxShadow: 'md',
                    transition: 'box-shadow 0.3s',
                    '&:hover': { boxShadow: 'lg' },
                  }}
                >
                  <CardContent sx={{ padding: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Sheet
                          color="primary"
                          variant="soft"
                          sx={{
                            borderRadius: 'md',
                            width: 48,
                            height: 48,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CalendarMonth />
                        </Sheet>
                        <Box>
                          <Typography level="title-lg">
                            {t('pages.bookings.defaultTitle', 'Buchung')}
                          </Typography>
                          <Typography level="body-sm" textColor="text.tertiary">
                            {formatDate(booking.startTime)}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        variant="soft"
                        size="md"
                        sx={{
                          bgcolor: statusColors.bg,
                          color: statusColors.text,
                          borderColor: statusColors.border,
                        }}
                      >
                        {t('pages.bookings.filters.statusScheduled', 'Geplant')}
                      </Chip>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid xs={12} md={4}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <LocationOn fontSize="small" color="action" />
                          <Box>
                            <Typography level="body-sm" fontWeight="md">
                              {t('pages.bookings.roomLabel', 'Raum')}
                            </Typography>
                            <Typography level="body-sm">
                              {booking.buildingName}-{booking.roomName}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid xs={12} md={4}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <AccessTime fontSize="small" color="action" />
                          <Box>
                            <Typography level="body-sm" fontWeight="md">
                              {t('pages.bookings.timeLabel', 'Zeit')}
                            </Typography>
                            <Typography level="body-sm">
                              {formatTime(booking.startTime)} -{' '}
                              {formatTime(booking.endTime)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid xs={12} md={4}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          {/* Statt Dozenten-/Gruppennamen zählen wir IDs */}
                          <Typography level="body-sm" fontWeight="md">
                            {t('pages.bookings.groupLabel', 'Gruppe')}
                          </Typography>
                          <Typography level="body-sm" sx={{ ml: 1 }}>
                            {booking.studentGroupCount}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Divider />
                  </CardContent>
                </Card>
              );
            })}
          </Stack>

          {/* Empty State */}
          {filteredBookings.length === 0 && (
            <Card sx={{ boxShadow: 'sm' }}>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 6,
                }}
              >
                <CalendarMonth
                  sx={{ fontSize: 64, color: 'neutral.softBg', mb: 2 }}
                />
                <Typography level="h3" sx={{ mb: 1 }}>
                  {t('pages.bookings.empty.title', 'Keine Buchungen gefunden')}
                </Typography>
                <Typography textColor="text.secondary">
                  {searchTerm ||
                  statusFilter !== 'all' ||
                  buildingFilter !== 'all' ||
                  roomFilter !== 'all' ||
                  dateTimeFrom ||
                  dateTimeTo
                    ? t(
                        'pages.bookings.empty.withFilters',
                        'Versuchen Sie andere Filterkriterien.'
                      )
                    : t(
                        'pages.bookings.empty.noBookings',
                        'Erstellen Sie Ihre erste Buchung.'
                      )}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default Bookings;
