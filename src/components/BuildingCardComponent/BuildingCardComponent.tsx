import type { Building, BuildingState } from '@/api/generated';
import { Box, Typography } from '@mui/joy';
import { LocationOn, Apartment } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { BaseCardComponent } from '@/components/BaseCardComponent/BaseCardComponent';

export interface BuildingCardProps {
  building: Building;
  onEdit: () => void;
  onDelete: () => void;
}

export function BuildingCardComponent({
  building,
  onEdit,
  onDelete,
}: BuildingCardProps) {
  const { t } = useTranslation();

  const contentSections = [
    <Box key="address" display="flex" alignItems="center" gap={1}>
      <LocationOn fontSize="small" color="action" />
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
    <BaseCardComponent
      id={building.id}
      title={building.name}
      statusChip={{
        label: t(getStatusText(building.state)),
        color: getStatusColor(building.state),
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

function getStatusColor(status: BuildingState): 'success' | 'danger' {
  switch (status) {
    case 'open':
      return 'success';
    case 'closed':
      return 'danger';
  }
}

function getStatusText(status: BuildingState): string {
  switch (status) {
    case 'open':
      return 'pages.buildings.labels.open';
    case 'closed':
      return 'pages.buildings.labels.closed';
  }
}
