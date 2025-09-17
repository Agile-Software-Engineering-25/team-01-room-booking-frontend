import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Sheet,
  Typography,
} from '@mui/joy';
import { AccessTime, CalendarMonth, LocationOn } from '@mui/icons-material';
import type { DefaultColorPalette } from '@mui/joy/styles/types';

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

interface BookingCardProps {
  booking: EnhancedBooking;
}

const BookingCard = ({ booking }: BookingCardProps) => {
  const { t } = useTranslation();
  const getBookingStatus = (
    booking: EnhancedBooking
  ): 'active' | 'scheduled' | 'completed' => {
    const now = dayjs();
    const start = dayjs(booking.startTime);
    const end = dayjs(booking.endTime);

    if (now.isAfter(start) && now.isBefore(end)) return 'active';
    if (now.isSame(start) || now.isSame(end)) return 'active';
    if (now.isBefore(start)) return 'scheduled';
    return 'completed';
  };

  const getStatusColor = (status: string): DefaultColorPalette => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'active':
        return 'success';
      default:
        return 'warning';
    }
  };

  const formatTime = (iso: string) => dayjs(iso).format('HH:mm');
  const formatDate = (iso: string) => dayjs(iso).format('ddd, DD. MMM YYYY');

  const status = getBookingStatus(booking);
  const statusColor = getStatusColor(status);

  return (
    <Card
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                {t('components.bookingCard.title')}
              </Typography>
              <Typography level="body-sm" textColor="text.tertiary">
                {formatDate(booking.startTime)}
              </Typography>
            </Box>
          </Box>

          <Chip variant="soft" size="md" color={statusColor}>
            {status === 'active'
              ? t('components.bookingCard.status.active')
              : status === 'scheduled'
                ? t('components.bookingCard.status.scheduled')
                : t('components.bookingCard.status.completed')}
          </Chip>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" />
              <Box>
                <Typography level="body-sm" fontWeight="md">
                  {t('components.bookingCard.roomLabel')}
                </Typography>
                <Typography level="body-sm">
                  {booking.buildingName}-{booking.roomName}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime fontSize="small" />
              <Box>
                <Typography level="body-sm" fontWeight="md">
                  {t('components.bookingCard.timeLabel')}
                </Typography>
                <Typography level="body-sm">
                  {formatTime(booking.startTime)} -{' '}
                  {formatTime(booking.endTime)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography level="body-sm" fontWeight="md">
                {t('components.bookingCard.groupLabel')}
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
};

export default BookingCard;
