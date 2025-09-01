import { FC } from 'react';
import { MobileDatePicker, MobileDatePickerProps } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

interface CustomMobileDatePickerProps extends MobileDatePickerProps<Date> {}

export const CustomMobileDatePicker: FC<CustomMobileDatePickerProps> = (props) => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={es}
    >
      <MobileDatePicker {...props} />
    </LocalizationProvider>
  );
};
