import type { Building, Characteristic, Room } from '@/api/generated';
import { Box, Typography } from '@mui/joy';
import { LocationOn, MeetingRoom, Person } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { BaseCard } from '@components/BaseCard/BaseCard.tsx';
import { CharacteristicChip } from '@components/RoomCard/CharacteristicChip.tsx';

export interface RoomCardProps {
  room: Room;
  building?: Building;
  onEdit: () => void;
  onDelete: () => void;
  onFaulty: () => void;
}

export function RoomCard({
  room,
  building,
  onEdit,
  onDelete,
  onFaulty,
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
      .map((char) => <CharacteristicChip characteristic={char} />)
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
  ].filter((value) => value != null);

  return (
    <BaseCard
      id={room.id}
      title={t('pages.buildings.room.single') + ` ${room.name}`}
      statusChip={{
        label: t(getStatusText(status)),
        color: getStatusColor(status),
      }}
      icon={<MeetingRoom fontSize="small" color="primary" />}
      contentSections={contentSections}
      onEdit={onEdit}
      onDelete={onDelete}
      onFaulty={onFaulty}
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
