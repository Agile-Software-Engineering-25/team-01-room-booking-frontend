import {
  DateTimePicker,
  type DateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMemo } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function JoyDateTimePicker(props: DateTimePickerProps) {
  const joyTheme = useMemo(
    () =>
      createTheme({
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: 'var(--joy-palette-background-level1)',
                color: 'var(--joy-palette-text-primary)',
              },
            },
          },
          MuiDialogActions: {
            styleOverrides: {
              root: {
                backgroundColor: 'var(--joy-palette-background-level1)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                color: 'var(--joy-palette-primary-500)',
              },
            },
          },
        },
      }),
    []
  );

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
              borderColor:
                'var(--joy-palette-neutral-outlinedBorder) !important',
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
      popper: {
        sx: {
          '& .MuiPaper-root': {
            backgroundColor: 'var(--joy-palette-background-level1) !important',
            color: 'var(--joy-palette-text-primary) !important',
          },
          '& .MuiPickersCalendarHeader-label': {
            color: 'var(--joy-palette-text-primary) !important',
          },
          '& .MuiIconButton-root': {
            color: 'var(--joy-palette-text-secondary) !important',
          },
          '& .MuiPickersDay-root': {
            color: 'var(--joy-palette-text-primary) !important',
          },
          '& .MuiPickersDay-root.Mui-selected': {
            backgroundColor: 'var(--joy-palette-primary-500) !important',
            color: 'var(--joy-palette-common-white) !important',
          },
          '& .MuiClock-clock': {
            backgroundColor: 'var(--joy-palette-background-level2) !important',
            color: 'var(--joy-palette-text-primary) !important',
          },
          '& .MuiClockNumber-root': {
            color: 'var(--joy-palette-text-primary) !important',
          },
          '& .MuiDialogActions-root': {
            backgroundColor: 'var(--joy-palette-background-level1) !important',
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
