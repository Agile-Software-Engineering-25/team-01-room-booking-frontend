import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import { BuildingCard } from '@components/Building/BuildingCard.tsx';
import { useQuery } from '@tanstack/react-query';
import { getBuildingsOptions } from '@/api/generated/@tanstack/react-query.gen.ts';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Add, Search, Apartment } from '@mui/icons-material';
import { Button, Card, CardContent, Input, Typography } from '@mui/joy';
import { BuildingCreateDialog } from '@components/Building/BuildingCreateDialog.tsx';
import { BuildingEditDialog } from '@components/Building/BuildingEditDialog.tsx';
import { BuildingDeleteDialog } from '@components/Building/BuildingDeleteDialog.tsx';
import { type Building } from '@/api/generated';

function Buildings() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const { data: buildingData } = useQuery({
    ...getBuildingsOptions(),
  });
  const buildings = useMemo(
    () => buildingData?.buildings ?? [],
    [buildingData]
  );

  const filteredBuildings = useMemo(() => {
    return buildings.filter((building) =>
      building.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [buildings, searchTerm]);

  const handleEditBuilding = (building: Building) => {
    setSelectedBuilding(building);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBuilding = (building: Building) => {
    setSelectedBuilding(building);
    setIsDeleteDialogOpen(true);
  };

  return (
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
          <Typography level={'h4'}>
            {t('pages.buildings.search.title')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Input
              placeholder={t('pages.buildings.search.placeholder')}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              startDecorator={<Search />}
              sx={{ width: '50%' }}
            />
            <Button
              startDecorator={<Add />}
              onClick={() => setIsCreateDialogOpen(true)}
            >
              {t('pages.buildings.actions.create')}
            </Button>
          </Box>
        </Card>

        <Grid
          container
          spacing={2}
          sx={{ justifyContent: { xs: 'flex-start', md: 'center' } }}
        >
          {filteredBuildings.map((building) => (
            <Grid
              key={building.id}
              xs={12}
              sm={6}
              md={6}
              lg={4}
              sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'center' },
              }}
            >
              <BuildingCard
                building={building}
                onEdit={() => handleEditBuilding(building)}
                onDelete={() => handleDeleteBuilding(building)}
              />
            </Grid>
          ))}
        </Grid>

        {filteredBuildings.length === 0 && (
          <Card sx={{ width: '100%', boxShadow: 'sm' }}>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingY: 6,
              }}
            >
              <Apartment
                sx={{ fontSize: 64, color: 'neutral.softBg', marginBottom: 2 }}
              />
              <Typography level="h3" sx={{ marginBottom: 1 }}>
                {t('pages.buildings.empty.title')}
              </Typography>
              <Typography textColor="text.secondary">
                {searchTerm
                  ? t('pages.buildings.empty.searchNoResults')
                  : t('pages.buildings.empty.noBuildings')}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      <BuildingCreateDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      <BuildingEditDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        building={selectedBuilding}
      />

      <BuildingDeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        building={selectedBuilding}
      />
    </Box>
  );
}

export default Buildings;
