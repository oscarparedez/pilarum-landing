import { FC } from 'react';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

interface CustomDatePickerProps extends DatePickerProps<Date> {}

export const CustomDatePicker: FC<CustomDatePickerProps> = (props) => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={es}
    >
      <DatePicker {...props} />
    </LocalizationProvider>
  );
};
