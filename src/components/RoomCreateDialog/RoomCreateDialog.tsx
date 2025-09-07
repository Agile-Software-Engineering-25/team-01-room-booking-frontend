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
  Chip,
} from '@mui/joy';
import {
  Place as PlaceIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type Building,
  type Characteristic,
  type RoomCreateRequest,
} from '@/api/generated';
import {
  createRoomMutation,
  getBuildingsOptions,
  getRoomsQueryKey,
} from '@/api/generated/@tanstack/react-query.gen.ts';

interface RoomCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const standardEquipment = [
  { id: 'PC', type: 'boolean', required: false },
  { id: 'WHITEBOARD', type: 'boolean', required: false },
  { id: 'BEAMER', type: 'boolean', required: false },
  { id: 'TELEVISION', type: 'boolean', required: false },
];

const standardEquipmentIds = [...standardEquipment.map((eq) => eq.id), 'SEATS'];

function formatType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export function RoomCreateDialog({ open, onClose }: RoomCreateDialogProps) {
  const { t } = useTranslation();
  const [roomNumber, setRoomNumber] = useState('');
  const [buildingId, setBuildingId] = useState<string>('');
  const [seats, setSeats] = useState<number>(0);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [customType, setCustomType] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [customValueType, setCustomValueType] = useState<
    'boolean' | 'number' | 'string'
  >('boolean');
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Fetch buildings
  const { data: buildingData } = useQuery({
    ...getBuildingsOptions(),
  });
  const buildings = buildingData?.buildings ?? [];

  const queryClient = useQueryClient();
  const createRoom = useMutation({
    ...createRoomMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getRoomsQueryKey() }).then();
      handleClose();
    },
  });

  const handleClose = () => {
    setRoomNumber('');
    setBuildingId('');
    setSeats(0);
    setCharacteristics([]);
    setCustomType('');
    setCustomValue('');
    setCustomValueType('boolean');
    setShowCustomForm(false);
    onClose();
  };

  const updateCharacteristic = (
    type: string,
    value: boolean | number | string
  ) => {
    setCharacteristics((prev) => {
      const existing = prev.findIndex(
        (characteristic) => characteristic.type === type
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { type, value };
        return updated;
      }
      return [...prev, { type, value }];
    });
  };

  const removeCharacteristic = (type: string) => {
    setCharacteristics((prev) =>
      prev.filter((characteristic) => characteristic.type !== type)
    );
  };

  const handleAddCustomCharacteristic = () => {
    if (!customType) return;

    const upperCaseType = customType.toUpperCase();
    if (standardEquipmentIds.includes(upperCaseType)) {
      return;
    }

    let parsedValue: boolean | number | string;

    if (customValueType === 'boolean') {
      parsedValue = customValue.toLowerCase() === 'true';
    } else if (customValueType === 'number') {
      parsedValue = Number(customValue);
      if (isNaN(parsedValue)) return;
    } else {
      parsedValue = customValue;
    }

    updateCharacteristic(upperCaseType, parsedValue);
    setCustomType('');
    setCustomValue('');
    setShowCustomForm(false);
  };

  const handleSubmit = () => {
    if (!roomNumber || !buildingId || seats <= 0) {
      return;
    }
    const allCharacteristics: Characteristic[] = [
      { type: 'SEATS', value: seats },
      ...characteristics,
    ];

    const roomData: RoomCreateRequest = {
      name: roomNumber,
      buildingId,
      characteristics: allCharacteristics,
    };

    createRoom.mutate({
      body: roomData,
    });
  };
  const availableStandardEquipment = standardEquipment.filter(
    (eq) =>
      !characteristics.some((characteristic) => characteristic.type === eq.id)
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        aria-labelledby="room-create-modal-title"
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
          id="room-create-modal-title"
          component="h2"
          level="title-lg"
          startDecorator={<PlaceIcon />}
          sx={{ marginBottom: 1 }}
        >
          {t('pages.rooms.create.title')}
        </Typography>
        <Typography level="body-md" sx={{ marginBottom: 3 }}>
          {t('pages.rooms.create.description')}
        </Typography>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <Stack spacing={2}>
            <FormControl required>
              <FormLabel>{t('pages.rooms.field.number')}</FormLabel>
              <Input
                placeholder={t('pages.rooms.field.placeholder.roomNumber')}
                value={roomNumber}
                onChange={(event) => setRoomNumber(event.target.value)}
                startDecorator={<PlaceIcon />}
              />
            </FormControl>

            <FormControl required>
              <FormLabel>{t('pages.rooms.field.building')}</FormLabel>
              <Select
                placeholder={t('pages.rooms.field.building.placeholder')}
                value={buildingId}
                onChange={(_event, value) => setBuildingId(value as string)}
              >
                {buildings.map((building: Building) => (
                  <Option key={building.id} value={building.id}>
                    {building.name}
                  </Option>
                ))}
              </Select>
            </FormControl>

            <FormControl required>
              <FormLabel>{t('pages.rooms.field.capacity')}</FormLabel>
              <Input
                placeholder={t('pages.rooms.field.capacity.placeholder')}
                value={seats || ''}
                onChange={(event) => {
                  const value = parseInt(event.target.value);
                  setSeats(isNaN(value) ? 0 : value);
                }}
                startDecorator={<PersonIcon />}
                type="number"
                error={seats === 0}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>{t('pages.rooms.field.equipment')}</FormLabel>

              {characteristics.length > 0 && (
                <>
                  <Typography
                    level="body-sm"
                    sx={{ marginTop: 1, marginBottom: 1 }}
                  >
                    {t('pages.rooms.field.equipment.selected')}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      marginBottom: 2,
                    }}
                  >
                    {characteristics.map((char) => (
                      <Chip
                        key={char.type}
                        color="primary"
                        variant="soft"
                        onClick={() => removeCharacteristic(char.type)}
                        slotProps={{
                          action: {
                            'data-testid': `remove-equipment-${char.type}-button`,
                          },
                        }}
                      >
                        {formatType(char.type)}
                        {typeof char.value !== 'boolean' && `: ${char.value}`}
                      </Chip>
                    ))}
                  </Box>
                </>
              )}

              <Typography level="body-sm" sx={{ marginBottom: 1 }}>
                {t('pages.rooms.field.equipment.standard')}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  marginBottom: 2,
                }}
              >
                {availableStandardEquipment.map((option) => (
                  <Chip
                    key={option.id}
                    variant="outlined"
                    color="neutral"
                    onClick={() => {
                      const value =
                        option.type === 'boolean'
                          ? true
                          : option.type === 'number'
                            ? 0
                            : '';
                      updateCharacteristic(option.id, value);
                    }}
                    slotProps={{
                      action: {
                        'data-testid': `add-equipment-${option.id}-button`,
                      },
                    }}
                  >
                    {formatType(option.id)}
                  </Chip>
                ))}

                <Chip
                  variant="outlined"
                  color="primary"
                  startDecorator={<AddIcon />}
                  onClick={() => setShowCustomForm(true)}
                  slotProps={{
                    action: {
                      'data-testid': 'add-custom-equipment-button',
                    },
                  }}
                >
                  {t('pages.rooms.field.equipment.custom')}
                </Chip>
              </Box>
              {showCustomForm && (
                <Box
                  sx={{
                    marginTop: 2,
                    padding: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 'sm',
                  }}
                >
                  <Typography level="body-sm" sx={{ marginBottom: 1 }}>
                    {t('pages.rooms.field.equipment.custom.add')}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
                    <Input
                      placeholder={t(
                        'pages.rooms.field.placeholder.customType'
                      )}
                      value={customType}
                      onChange={(event) => setCustomType(event.target.value)}
                      size="sm"
                      error={standardEquipmentIds.includes(
                        customType.toUpperCase()
                      )}
                    />
                    <Select
                      value={customValueType}
                      onChange={(_event, value) =>
                        setCustomValueType(
                          value as 'boolean' | 'number' | 'string'
                        )
                      }
                      size="sm"
                    >
                      <Option value="boolean">
                        {t('common.value.type.boolean')}
                      </Option>
                      <Option value="number">
                        {t('common.value.type.number')}
                      </Option>
                      <Option value="string">
                        {t('common.value.type.string')}
                      </Option>
                    </Select>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    {customValueType === 'boolean' ? (
                      <Select
                        value={customValue}
                        onChange={(_event, value) =>
                          setCustomValue(value as string)
                        }
                        placeholder={t('pages.rooms.field.placeholder.value')}
                        size="sm"
                      >
                        <Option value="true">{t('common.value.true')}</Option>
                        <Option value="false">{t('common.value.false')}</Option>
                      </Select>
                    ) : (
                      <Input
                        placeholder={t('pages.rooms.field.placeholder.value')}
                        value={customValue}
                        onChange={(event) => setCustomValue(event.target.value)}
                        type={customValueType === 'number' ? 'number' : 'text'}
                        size="sm"
                      />
                    )}
                    <Button
                      size="sm"
                      onClick={handleAddCustomCharacteristic}
                      disabled={
                        !customType ||
                        !customValue ||
                        standardEquipmentIds.includes(customType.toUpperCase())
                      }
                    >
                      {t('common.action.add')}
                    </Button>
                    <Button
                      size="sm"
                      variant="plain"
                      color="neutral"
                      onClick={() => setShowCustomForm(false)}
                    >
                      {t('common.action.cancel')}
                    </Button>
                  </Stack>
                </Box>
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
                data-testid="create-room-cancel-button"
                variant="outlined"
                color="neutral"
                onClick={handleClose}
              >
                {t('common.action.cancel')}
              </Button>
              <Button
                data-testid="create-room-submit-button"
                type="submit"
                loading={createRoom.isPending}
                disabled={!roomNumber || !buildingId || seats <= 0}
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
