import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalDialog,
  Typography,
  Button,
  Box,
  Stack,
  Alert,
  Divider,
} from '@mui/joy';
import {
  Apartment as ApartmentIcon,
  DeleteForever as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Building } from '@/api/generated';
import {
  deleteBuildingMutation,
  getBuildingsQueryKey,
  getRoomsForBuildingOptions,
} from '@/api/generated/@tanstack/react-query.gen.ts';

interface BuildingDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  building: Building | null;
}

export function BuildingDeleteDialog({
  open,
  onClose,
  building,
}: BuildingDeleteDialogProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  // Check if building has rooms - this would prevent deletion
  const { data: roomData } = useQuery({
    ...getRoomsForBuildingOptions({ path: { buildingId: building?.id || '' } }),
    enabled: !!building && open,
  });

  const hasRooms = roomData?.rooms && roomData.rooms.length > 0;

  const queryClient = useQueryClient();
  const deleteBuilding = useMutation({
    ...deleteBuildingMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getBuildingsQueryKey() }).then();
      handleClose();
    },
    onError: (error) => {
      // Handle API errors
      setError(
        error.message || t('pages.buildings.delete.error.generic')
      );
    },
  });

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleDelete = () => {
    if (!building) {
      return;
    }

    // Validate that the building doesn't have rooms
    if (hasRooms) {
      setError(t('pages.buildings.delete.error.hasRooms'));
      return;
    }

    deleteBuilding.mutate({
      path: { buildingId: building.id },
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        aria-labelledby="building-delete-modal-title"
        sx={{
          maxWidth: 500,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <Typography
          id="building-delete-modal-title"
          component="h2"
          level="title-lg"
          startDecorator={<ApartmentIcon />}
          color="danger"
          sx={{ marginBottom: 1 }}
        >
          {t('pages.buildings.delete.title')}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography level="body-md" sx={{ mb: 2 }}>
          {t('pages.buildings.delete.confirmation', { name: building?.name })}
        </Typography>

        {hasRooms && (
          <Alert
            color="danger"
            variant="soft"
            startDecorator={<WarningIcon />}
            sx={{ mb: 2 }}
          >
            {t('pages.buildings.delete.warning.hasRooms')}
          </Alert>
        )}

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

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button
            data-testid="delete-building-cancel-button"
            variant="plain"
            color="neutral"
            onClick={handleClose}
          >
            {t('common.action.cancel')}
          </Button>
          <Button
            data-testid="delete-building-confirm-button"
            variant="solid"
            color="danger"
            startDecorator={<DeleteIcon />}
            onClick={handleDelete}
            loading={deleteBuilding.isPending}
            disabled={hasRooms}
          >
            {t('common.action.delete')}
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
