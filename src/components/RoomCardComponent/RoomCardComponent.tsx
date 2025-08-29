import type { Building, Characteristic, Room } from '@/api/generated';
import { Box, Chip, Typography } from '@mui/joy';
import { LocationOn, MeetingRoom, Person } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { BaseCardComponent } from '@/components/BaseCardComponent/BaseCardComponent';

export interface RoomCardProps {
  room: Room;
  building?: Building;
  onEdit: () => void;
  onDelete: () => void;
}

export function RoomCardComponent({
  room,
  building,
  onEdit,
  onDelete,
}: RoomCardProps) {
  const { t } = useTranslation();

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

  const contentSections = [
    building && (
      <Box key="building" display="flex" alignItems="center" gap={1}>
        <LocationOn fontSize="small" color="action" />
        <Typography level="body-sm" textColor="text.secondary">
          Gebäude {building.name}
        </Typography>
      </Box>
    ),
    <Box key="capacity" display="flex" justifyContent="space-between">
      <Box display="flex" alignItems="center" gap={1}>
        <Person fontSize="small" />
        <Typography level="body-sm" textColor="text.secondary">
          30 {t('pages.rooms.labels.capacity')}
        </Typography>
      </Box>
    </Box>,

    <Box key="equipment">
      <Typography level="body-sm" textColor="text.secondary" sx={{ mb: 1 }}>
        {t('pages.rooms.labels.equipment')}:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {renderCharacteristics(room.characteristics)}
      </Box>
    </Box>,
  ].filter(Boolean);

  return (
    <BaseCardComponent
      id={room.id}
      title={`Raum ${room.name}`}
      statusChip={{
        label: t(getStatusText(status)),
        color: getStatusColor(status),
      }}
      icon={<MeetingRoom fontSize="small" color="primary" />}
      contentSections={contentSections}
      onEdit={onEdit}
      onDelete={onDelete}
    />
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
