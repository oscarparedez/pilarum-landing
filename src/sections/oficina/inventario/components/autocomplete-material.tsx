import { Autocomplete, TextField } from '@mui/material';
import { Inventario } from 'src/api/types';
import { formatearQuetzales } from 'src/utils/format-currency';

interface Props {
  value: Inventario | null;
  options: Inventario[];
  excluirIds?: number[];
  onChange: (value: Inventario | null) => void;
}

export const AutocompleteMaterial = ({ value, options, excluirIds = [], onChange }: Props) => {
  const filtrados = options.filter((o) => !excluirIds.includes(o.id));

  return (
    <Autocomplete
      options={filtrados}
      getOptionLabel={(option) =>
        `${option.material.nombre} - ${formatearQuetzales(Number(option.precio_unitario))}`
      }
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Material"
          fullWidth
        />
      )}
      isOptionEqualToValue={(option, val) => option.id === val?.id}
    />
  );
};
