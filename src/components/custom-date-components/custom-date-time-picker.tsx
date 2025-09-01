import { FC } from 'react';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

interface CustomDateTimePickerProps extends DateTimePickerProps<Date> {}

export const CustomDateTimePicker: FC<CustomDateTimePickerProps> = (props) => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={es}
    >
      <DateTimePicker {...props} />
    </LocalizationProvider>
  );
};
