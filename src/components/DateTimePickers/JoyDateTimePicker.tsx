import {
  DateTimePicker,
  type DateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMemo } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function JoyDateTimePicker(props: DateTimePickerProps) {
  const joyTheme = useMemo(() => createTheme({}), []);

  const defaultSlotProps = useMemo(
    () => ({
      textField: {
        size: 'small' as const,
        sx: {
          '&& .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: 'var(--joy-palette-neutral-outlinedBorder)',
          },
          '&& .MuiPickersOutlinedInput-root': {
            color:
              'var(--variant-outlinedColor, var(--joy-palette-neutral-outlinedColor, var(--joy-palette-neutral-700, #32383E)));',
          },
          '&& .MuiPickersOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
            {
              borderColor: 'var(--joy-palette-neutral-outlinedBorder)',
            },
          '&& .MuiInputLabel-root': {
            color:
              'var(--variant-outlinedColor, var(--joy-palette-neutral-outlinedColor, var(--joy-palette-neutral-700, #32383E)));',
          },
          '&& .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline':
            {
              borderColor: 'var(--joy-palette-primary-500)',
            },
          '&& .MuiSvgIcon-root': {
            fill: 'var(--joy-palette-text-icon)',
          },
        },
      },
    }),
    []
  );

  return (
    <LocalizationProvider adapterLocale={'de'} dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={joyTheme}>
        <DateTimePicker
          slotProps={{
            ...defaultSlotProps,
            ...props.slotProps,
          }}
          {...props}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
}
