import type { Building } from '@/api/generated';
import { Box, Typography } from '@mui/joy';
import { LocationOn, Apartment } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { BaseCard } from '@components/BaseCard/BaseCard.tsx';

export interface BuildingCardProps {
  building: Building;
  onEdit: () => void;
  onDelete: () => void;
}

export function BuildingCard({
  building,
  onEdit,
  onDelete,
}: BuildingCardProps) {
  const { t } = useTranslation();

  const contentSections = [
    <Box key="address" display="flex" alignItems="center" gap={1}>
      <LocationOn fontSize="small" />
      <Typography level="body-sm" textColor="text.secondary">
        {building.address}
      </Typography>
    </Box>,
    <Box key="rooms" display="flex" justifyContent="space-between">
      <Box display="flex" alignItems="center" gap={1}>
        <Apartment fontSize="small" />
        <Typography level="body-sm" textColor="text.secondary">
          10 {t(getRoomCountText(10))}
        </Typography>
      </Box>
    </Box>,

    building.description && (
      <Typography
        key="description"
        level="body-sm"
        textColor="text.secondary"
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {building.description}
      </Typography>
    ),
  ].filter((value) => value != null);

  return (
    <BaseCard
      id={building.name}
      title={building.name}
      statusChip={{
        label: t('pages.buildings.labels.open'),
        color: 'success',
      }}
      icon={<Apartment fontSize="small" color="primary" />}
      contentSections={contentSections}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

function getRoomCountText(count: number): string {
  if (count === 1) {
    return 'pages.buildings.room.single';
  }

  return 'pages.buildings.room.plural';
}
