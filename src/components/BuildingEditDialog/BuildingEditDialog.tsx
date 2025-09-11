import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Option,
  Box,
  Stack,
  Textarea,
  Alert,
} from '@mui/joy';
import {
  Apartment as ApartmentIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  type Building,
  type BuildingState,
} from '@/api/generated';
import {
  updateBuildingMutation,
  getBuildingsQueryKey,
  getRoomsForBuildingOptions,
} from '@/api/generated/@tanstack/react-query.gen.ts';
import { useQuery } from '@tanstack/react-query';

interface BuildingEditDialogProps {
  open: boolean;
  onClose: () => void;
  building: Building | null;
}

export function BuildingEditDialog({
  open,
  onClose,
  building,
}: BuildingEditDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [state, setState] = useState<BuildingState>('open');
  const [error, setError] = useState<string | null>(null);

  // Check if building has rooms and the state is being changed to closed
  const { data: roomData } = useQuery({
    ...getRoomsForBuildingOptions({ path: { buildingId: building?.id || '' } }),
    enabled: !!building && open,
  });

  const hasRooms = roomData?.rooms && roomData.rooms.length > 0;

  useEffect(() => {
    if (building && open) {
      setName(building.name);
      setAddress(building.address);
      setDescription(building.description || '');
      setState(building.state);
      setError(null);
    }
  }, [building, open]);

  const queryClient = useQueryClient();
  const updateBuilding = useMutation({
    ...updateBuildingMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getBuildingsQueryKey() }).then();
      handleClose();
    },
    onError: (error) => {
      // Handle API errors
      setError(
        error.message || t('pages.buildings.edit.error.generic')
      );
    },
  });

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSubmit = () => {
    if (!building || !name || !address) {
      return;
    }

    // Validate state change if the building has rooms
    if (hasRooms && state === 'closed' && building.state === 'open') {
      setError(t('pages.buildings.edit.error.hasRooms'));
      return;
    }

    const buildingData = {
      name,
      address,
      description: description || undefined,
      state,
    };

    updateBuilding.mutate({
      path: { buildingId: building.id },
      body: buildingData,
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        aria-labelledby="building-edit-modal-title"
        sx={{
          maxWidth: 600,
          maxHeight: '90vh',
          borderRadius: 'md',
          padding: 3,
          boxShadow: 'lg',
          overflow: 'auto',
        }}
      >
        <ModalClose />
        <Typography
          id="building-edit-modal-title"
          component="h2"
          level="title-lg"
          startDecorator={<ApartmentIcon />}
          sx={{ marginBottom: 1 }}
        >
          {t('pages.buildings.edit.title')}
        </Typography>
        <Typography level="body-md" sx={{ marginBottom: 3 }}>
          {t('pages.buildings.edit.description')}
        </Typography>

        {error && (
          <Alert
            color="danger"
            variant="soft"
            startDecorator={<WarningIcon />}
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <Stack spacing={2}>
            <FormControl required>
              <FormLabel>{t('pages.buildings.field.name')}</FormLabel>
              <Input
                placeholder={t('pages.buildings.field.name.placeholder')}
                value={name}
                onChange={(event) => setName(event.target.value)}
                startDecorator={<ApartmentIcon />}
              />
            </FormControl>

            <FormControl required>
              <FormLabel>{t('pages.buildings.field.address')}</FormLabel>
              <Input
                placeholder={t('pages.buildings.field.address.placeholder')}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                startDecorator={<LocationIcon />}
              />
            </FormControl>

            <FormControl>
              <FormLabel>{t('pages.buildings.field.description')}</FormLabel>
              <Textarea
                placeholder={t('pages.buildings.field.description.placeholder')}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                minRows={3}
                maxRows={5}
              />
            </FormControl>

            <FormControl required>
              <FormLabel>{t('pages.buildings.field.state')}</FormLabel>
              <Select
                value={state}
                onChange={(_event, value) => {
                  setState(value as BuildingState);
                  // Clear error when changing state back to open
                  if (value === 'open') {
                    setError(null);
                  }
                }}
              >
                <Option value="open">
                  {t('pages.buildings.field.state.open')}
                </Option>
                <Option value="closed">
                  {t('pages.buildings.field.state.closed')}
                </Option>
              </Select>
              {hasRooms && state === 'closed' && building?.state === 'open' && (
                <Typography
                  level="body-xs"
                  color="danger"
                  sx={{ mt: 0.5 }}
                >
                  {t('pages.buildings.edit.warning.hasRooms')}
                </Typography>
              )}
            </FormControl>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'flex-end',
                marginTop: 2,
              }}
            >
              <Button
                data-testid="edit-building-cancel-button"
                variant="outlined"
                color="neutral"
                onClick={handleClose}
              >
                {t('common.action.cancel')}
              </Button>
              <Button
                data-testid="edit-building-submit-button"
                type="submit"
                loading={updateBuilding.isPending}
                disabled={!name || !address}
              >
                {t('common.action.save')}
              </Button>
            </Box>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}
