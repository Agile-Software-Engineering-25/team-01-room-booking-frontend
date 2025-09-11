import { useState } from 'react';
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
import { type BuildingCreateRequest } from '@/api/generated';
import {
  createBuildingMutation,
  getBuildingsQueryKey,
} from '@/api/generated/@tanstack/react-query.gen.ts';

interface BuildingCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

export function BuildingCreateDialog({
  open,
  onClose,
}: BuildingCreateDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const createBuilding = useMutation({
    ...createBuildingMutation(),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: getBuildingsQueryKey() })
        .then();
      handleClose();
    },
    onError: () => {
      setError(t('pages.buildings.create.error.generic'));
    },
  });

  const handleClose = () => {
    setName('');
    setAddress('');
    setDescription('');
    setError(null);
    onClose();
  };

  const handleSubmit = () => {
    if (!name || !address) {
      return;
    }

    setError(null);

    const buildingData: BuildingCreateRequest = {
      name,
      address,
      description: description || undefined,
    };

    createBuilding.mutate({
      body: buildingData,
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        aria-labelledby="building-create-modal-title"
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
          id="building-create-modal-title"
          component="h2"
          level="title-lg"
          startDecorator={<ApartmentIcon />}
          sx={{ marginBottom: 1 }}
        >
          {t('pages.buildings.create.title')}
        </Typography>
        <Typography level="body-md" sx={{ marginBottom: 3 }}>
          {t('pages.buildings.create.description')}
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
                error={error != null && error.toLowerCase().includes('name')}
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

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'flex-end',
                marginTop: 2,
              }}
            >
              <Button
                data-testid="create-building-cancel-button"
                variant="outlined"
                color="neutral"
                onClick={handleClose}
              >
                {t('common.action.cancel')}
              </Button>
              <Button
                data-testid="create-building-submit-button"
                type="submit"
                loading={createBuilding.isPending}
                disabled={!name || !address}
              >
                {t('common.action.create')}
              </Button>
            </Box>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}
