import type { Building } from '@/api/generated';
import { Card, CardHeader } from '@mui/material';
import { Box } from '@mui/joy';

export interface BuildingCardProps {
  building: Building;
}

export function BuildingCardComponent() {
  return (
    <Card>
      <CardHeader>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', space: 3 }}>
            <BusinessIcon />
          </Box>
        </Box>
      </CardHeader>
    </Card>
  );
}
