import type { Building } from '@/api/generated';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Edit,
  Delete,
  LocationOn,
  Apartment,
  Group,
} from '@mui/icons-material';

export interface BuildingCardProps {
  building: Building;
}

export function BuildingCardComponent({ building }: BuildingCardProps) {
  return (
    <Card
      key={building.id}
      sx={{
        boxShadow: 2,
        '&:hover': { boxShadow: 4 },
        transition: 'box-shadow 0.2s',
      }}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: 'primary.light',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Apartment fontSize="small" color="primary" />
            </Box>
            <Box>
              <Typography variant="h6" color="text.primary" fontWeight="bold">
                {building.name}
              </Typography>
              <Chip label={'active'} size="small" />
            </Box>
          </Box>
        }
        action={
          <Box display="flex" gap={1}>
            <IconButton color="primary">
              <Edit fontSize="small" />
            </IconButton>
            <IconButton color="error">
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        }
        sx={{ paddingBottom: 1 }}
      />

      <CardContent sx={{ paddingTop: 0 }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {building.address}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Apartment fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              10 Etagen
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Group fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              10 Räume
            </Typography>
          </Box>
        </Box>

        {building.description && (
          <Typography
            variant="body2"
            color="text.secondary"
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
