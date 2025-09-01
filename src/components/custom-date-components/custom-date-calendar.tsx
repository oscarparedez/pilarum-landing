import { FC } from 'react';
import { DateCalendar, DateCalendarProps } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { SxProps, Theme } from '@mui/material/styles';

interface CustomDateCalendarProps extends Omit<DateCalendarProps<Date>, 'sx'> {
  sx?: SxProps<Theme>;
}

export const CustomDateCalendar: FC<CustomDateCalendarProps> = ({ sx, ...props }) => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={es}
    >
      <DateCalendar
        {...props}
        sx={{
          width: '100%',
          '& .MuiDayCalendar-header, & .MuiPickersCalendarHeader-root': {
            mx: 0,
          },
          // Capitalize month names
          '& .MuiPickersCalendarHeader-label': {
            textTransform: 'capitalize',
          },
          // Capitalize day names
          '& .MuiDayCalendar-weekDayLabel': {
            textTransform: 'capitalize',
          },
          ...sx,
        }}
      />
    </LocalizationProvider>
  );
};
