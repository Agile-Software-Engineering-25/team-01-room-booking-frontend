import type { Building, Characteristic, Room } from '@/api/generated';
import { Box, Card, CardContent, Chip, IconButton, Typography } from '@mui/joy';
import {
  Edit,
  Delete,
  LocationOn,
  MeetingRoom,
  Person,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export interface RoomCardProps {
  room: Room;
  building: Building;
}

export function RoomCardComponent({ room, building }: RoomCardProps) {
  const { t } = useTranslation();

  // Generisches Characteristic-Handling
  const renderCharacteristics = (characteristics: Characteristic[]) => {
    if (characteristics.length === 0) {
      return (
        <Typography level="body-sm" textColor="text.tertiary">
          {t('pages.rooms.labels.noEquipment')}
        </Typography>
      );
    }

    return characteristics
      .map((char, index) => {
        if (typeof char.value === 'boolean') {
          if (char.value) {
            return (
              <Chip key={`${char.type}-${index}`} size="sm" variant="soft">
                {char.type}
              </Chip>
            );
          }
          return null;
        } else if (typeof char.value === 'number') {
          return (
            <Chip key={`${char.type}-${index}`} size="sm" variant="soft">
              {char.type}: {char.value}
            </Chip>
          );
        } else if (typeof char.value === 'string') {
          return (
            <Chip key={`${char.type}-${index}`} size="sm" variant="soft">
              {char.type}: {char.value}
            </Chip>
          );
        }

        return null;
      })
      .filter((value) => value != null);
  };

  const status = 'available';

  return (
    <Card
      key={room.id}
      sx={{
        boxShadow: 'sm',
        '&:hover': { boxShadow: 'md' },
        transition: 'box-shadow 0.2s',
      }}
    >
      <Box sx={{ padding: 2, paddingBottom: 0 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 'sm',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'primary.softBg',
            }}
          >
            <MeetingRoom fontSize="small" color="primary" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography level="title-lg">Raum {room.name}</Typography>
            <Chip color={getStatusColor(status)} size="sm">
              {t(getStatusText(status))}
            </Chip>
          </Box>
          <Box display="flex" gap={1}>
            <IconButton variant="plain" color="primary" size="sm">
              <Edit fontSize="small" />
            </IconButton>
            <IconButton variant="plain" color="danger" size="sm">
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {building && (
          <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
            <LocationOn fontSize="small" color="action" />
            <Typography level="body-sm" textColor="text.secondary">
              Gebäude {building.name}
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Person fontSize="small" />
            <Typography level="body-sm" textColor="text.secondary">
              30 {t('pages.rooms.labels.capacity')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography level="body-sm" textColor="text.secondary" sx={{ mb: 1 }}>
            {t('pages.rooms.labels.equipment')}:
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {renderCharacteristics(room.characteristics)}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function getStatusColor(
  status: 'available' | 'occupied' | 'maintenance'
): 'success' | 'danger' | 'warning' {
  switch (status) {
    case 'available':
      return 'success';
    case 'occupied':
      return 'danger';
    case 'maintenance':
      return 'warning';
  }
}

function getStatusText(
  status: 'available' | 'occupied' | 'maintenance'
): string {
  switch (status) {
    case 'available':
      return 'pages.rooms.labels.available';
    case 'occupied':
      return 'pages.rooms.labels.occupied';
    case 'maintenance':
      return 'pages.rooms.labels.maintenance';
  }
}
