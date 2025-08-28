import type { Building, BuildingState } from '@/api/generated';
import { Box, Card, CardContent, Chip, IconButton, Typography } from '@mui/joy';
import { Edit, Delete, LocationOn, Apartment } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export interface BuildingCardProps {
  building: Building;
}

export function BuildingCardComponent({ building }: BuildingCardProps) {
  const { t } = useTranslation();

  return (
    <Card
      key={building.id}
      sx={{
        boxShadow: 'sm',
        '&:hover': { boxShadow: 'md' },
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Header-Bereich (ersetzt CardHeader) */}
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
            <Apartment fontSize="small" color="primary" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography level="title-lg">{building.name}</Typography>
            <Chip color={getStatusColor(building.state)} size="sm">
              {t(getStatusText(building.state))}
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

      <CardContent>
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
          <LocationOn fontSize="small" color="action" />
          <Typography level="body-sm" textColor="text.secondary">
            {building.address}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Apartment fontSize="small" />
            <Typography level="body-sm" textColor="text.secondary">
              10 {t(getRoomCountText(10))}
            </Typography>
          </Box>
        </Box>

        {building.description && (
          <Typography
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
        )}
      </CardContent>
    </Card>
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
