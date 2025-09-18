import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from '@mui/joy';
import { DeleteOutline, WarningAmberRounded } from '@mui/icons-material';
import type { Room } from '@/api/generated';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  isRoomDeletableOptions,
  deleteRoomByIdMutation,
  getBuildingsQueryKey,
} from '@/api/generated/@tanstack/react-query.gen';

interface DeleteRoomDialogProps {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const RoomDeleteDialog = ({
  room,
  open,
  onOpenChange,
  onConfirm
}: DeleteRoomDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Prüfen, ob der Raum gelöscht werden kann
  const { data: roomDeletableData, isLoading: isCheckingDeletable } = useQuery({
    ...isRoomDeletableOptions({
      path: { roomId: room.id },
    }),
    enabled: open, // Nur abfragen, wenn der Dialog geöffnet ist
  });

  const roomHasBookings = !roomDeletableData?.deletable;

  // Mutation zum Löschen eines Raums
  const { mutate: deleteRoom, isPending: isDeleting } = useMutation({
    ...deleteRoomByIdMutation(),
    onSuccess: () => {
      // Nach erfolgreicher Löschung den Cache aktualisieren
      queryClient.invalidateQueries({ queryKey: getBuildingsQueryKey() }).then();
      setForceDelete(false);
      onOpenChange(false);
    },
  });

  useEffect(() => {
    setLoading(isCheckingDeletable || isDeleting);
  }, [isCheckingDeletable, isDeleting]);

  const handleDelete = async () => {
    deleteRoom({
      path: { roomId: room.id },
      query: { force: forceDelete },
    });
    onConfirm();
  };

  return (
    <Modal open={open} onClose={() => onOpenChange(false)}>
      <ModalDialog size="md">
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
              {t('pages.rooms.dialogs.delete.title')}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Typography level="body-md" mb={2}>
            {t('pages.rooms.dialogs.delete.confirmation', {
              roomName: room.name,
            })}
          </Typography>

          <Alert
            variant="soft"
            color="danger"
            startDecorator={<WarningAmberRounded />}
            sx={{ mb: 2 }}
          >
            <Stack>
              <Typography level="title-sm">
                {t('pages.rooms.dialogs.delete.warning.title')}
              </Typography>
              <Typography level="body-sm">
                {t('pages.rooms.dialogs.delete.warning.permanent')}
              </Typography>
              {!forceDelete && (
                <Typography level="body-sm" mt={1}>
                  {t('pages.rooms.dialogs.delete.warning.checkBookings')}
                </Typography>
              )}
              {forceDelete && (
                <Typography level="body-sm" mt={1} fontWeight="md">
                  {t('pages.rooms.dialogs.delete.warning.deleteBookings')}
                </Typography>
              )}
            </Stack>
          </Alert>

          {roomHasBookings && (
            <Alert
              variant="soft"
              color="warning"
              startDecorator={<WarningAmberRounded />}
              sx={{ mb: 2 }}
            >
              <Typography level="body-sm">
                <Typography fontWeight="md">
                  {t('pages.rooms.dialogs.delete.hasBookings.title')}
                </Typography>
                {t('pages.rooms.dialogs.delete.hasBookings.description')}
              </Typography>
            </Alert>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 2,
              bgcolor: 'warning.softBg',
              borderRadius: 'md',
              mb: 2,
            }}
          >
            <Checkbox
              checked={forceDelete}
              onChange={(event) => setForceDelete(event.target.checked)}
              color="warning"
            />
            <Typography
              level="body-sm"
              fontWeight="md"
            >
              {t('pages.rooms.dialogs.delete.forceDelete')}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('common.action.cancel')}
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={handleDelete}
              disabled={loading || (roomHasBookings && !forceDelete)}
              startDecorator={<DeleteOutline />}
            >
              {loading
                ? t('pages.rooms.dialogs.delete.deleting')
                : t('pages.rooms.dialogs.delete.confirm')}
            </Button>
          </Box>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default RoomDeleteDialog;
