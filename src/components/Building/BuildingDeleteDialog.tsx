import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Button,
  Stack,
  Alert,
  Box,
  DialogTitle,
  DialogContent,
} from '@mui/joy';
import { DeleteOutline, WarningAmberRounded } from '@mui/icons-material';
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
  const { data: roomData, isLoading: isCheckingRooms } = useQuery({
    ...getRoomsForBuildingOptions({ path: { buildingId: building?.id || '' } }),
    enabled: !!building && open,
  });

  const hasRooms = roomData && roomData.length > 0;

  const queryClient = useQueryClient();
  const deleteBuilding = useMutation({
    ...deleteBuildingMutation(),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: getBuildingsQueryKey() })
        .then();
      handleClose();
    },
    onError: (error) => {
      setError(error.message || t('pages.buildings.delete.error.generic'));
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
      <ModalDialog>
        <ModalClose />
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'danger.softBg',
                borderRadius: 'md',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WarningAmberRounded
                sx={{ color: 'danger.solidColor', fontSize: 18 }}
              />
            </Box>
            <Typography level="title-lg">
              {t('pages.buildings.delete.title')}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Typography level="body-md" mb={2}>
            {t('pages.buildings.delete.confirmation', { name: building?.name })}
          </Typography>
          {hasRooms && (
            <Alert
              title={t('pages.buildings.delete.hasRooms.title')}
              variant="soft"
              color="warning"
              startDecorator={<WarningAmberRounded />}
              sx={{ mb: 2 }}
            >
              <Typography level="body-sm">
                {t('pages.buildings.delete.warning.hasRooms')}
              </Typography>
            </Alert>
          )}

          {error && (
            <Alert
              color="danger"
              variant="soft"
              startDecorator={<WarningAmberRounded />}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={handleClose}
              disabled={isCheckingRooms || deleteBuilding.isPending}
              data-testid="delete-building-cancel-button"
            >
              {t('common.action.cancel')}
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={handleDelete}
              disabled={isCheckingRooms || deleteBuilding.isPending || hasRooms}
              startDecorator={<DeleteOutline />}
              data-testid="delete-building-confirm-button"
            >
              {isCheckingRooms || deleteBuilding.isPending
                ? t('pages.buildings.delete.deleting')
                : t('common.action.delete')}
            </Button>
          </Box>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}
