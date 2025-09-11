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
  Select,
  Option,
  Box,
  Stack,
  Textarea,
} from '@mui/joy';
import {
  Apartment as ApartmentIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  type BuildingCreateRequest,
  type BuildingState,
} from '@/api/generated';
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
  const [state, setState] = useState<BuildingState>('open');

  const queryClient = useQueryClient();
  const createBuilding = useMutation({
    ...createBuildingMutation(),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: getBuildingsQueryKey() })
        .then();
      handleClose();
    },
  });

  const handleClose = () => {
    setName('');
    setAddress('');
    setDescription('');
    setState('open');
    onClose();
  };

  const handleSubmit = () => {
    if (!name || !address) {
      return;
    }

    const buildingData: BuildingCreateRequest = {
      name,
      address,
      description: description || undefined,
      state,
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
                onChange={(_event, value) => setState(value as BuildingState)}
              >
                <Option value="open">
                  {t('pages.buildings.field.state.open')}
                </Option>
                <Option value="closed">
                  {t('pages.buildings.field.state.closed')}
                </Option>
              </Select>
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
