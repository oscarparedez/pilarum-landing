import { FC } from 'react';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { SxProps, Theme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

interface CustomDatePickerProps extends DatePickerProps<Date> {
  sx?: SxProps<Theme>;
}

export const CustomDatePicker: FC<CustomDatePickerProps> = ({ sx, ...props }) => {
  return (
    <>
      <GlobalStyles
        styles={{
          '.MuiPickersPopper-root': {
            '& .MuiPickersCalendarHeader-label': {
              textTransform: 'capitalize !important',
            },
            '& .MuiDayCalendar-weekDayLabel': {
              textTransform: 'capitalize !important',
            },
          },
        }}
      />
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={es}
      >
        <DatePicker
          {...props}
          sx={sx}
        />
      </LocalizationProvider>
    </>
  );
};
