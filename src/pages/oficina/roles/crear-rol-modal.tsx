// src/oficina/roles/crear-rol-modal.tsx

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Divider,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material';
import { FC, useState } from 'react';
import { usePermisosPorGrupo } from './usePermisosPorGrupo';
import permisosAgrupados from './permisos.json';

interface CrearRolModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (nombre: string, permisos: { [key: string]: string[] }) => void;
}

export const CrearRolModal: FC<CrearRolModalProps> = ({ open, onClose, onConfirm }) => {
  const [nombreRol, setNombreRol] = useState('');

  const {
    seleccionados,
    togglePermiso,
    seleccionarTodos,
    deseleccionarTodos,
    estaSeleccionado,
    todosSeleccionados,
    cantidadSeleccionados,
    setSeleccionados,
  } = usePermisosPorGrupo(permisosAgrupados);

  const nombreValido = nombreRol.trim().length > 0;
  const hayPermisos = Object.values(seleccionados).some(arr => arr.length > 0);

  const handleGuardar = () => {
    onConfirm(nombreRol, seleccionados);
    setNombreRol('');
    setSeleccionados({});
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Crear nuevo rol</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Nombre del rol"
          fullWidth
          value={nombreRol}
          onChange={(e) => setNombreRol(e.target.value)}
          margin="normal"
        />

        {Object.entries(permisosAgrupados).map(([modulo, secciones]) => (
          <Box key={modulo} sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>{modulo}</Typography>

            {Object.entries(secciones).map(([subgrupo, permisos]) => (
              <Box key={subgrupo} sx={{ pl: 2, mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="500">
                    {subgrupo} — {cantidadSeleccionados(subgrupo)} de {permisos.length}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() =>
                      todosSeleccionados(subgrupo, permisos)
                        ? deseleccionarTodos(subgrupo)
                        : seleccionarTodos(subgrupo, permisos)
                    }
                  >
                    {todosSeleccionados(subgrupo, permisos)
                      ? 'Deseleccionar todos'
                      : 'Seleccionar todos'}
                  </Button>
                </Stack>
                <Grid container spacing={1} mt={1}>
                  {permisos.map((permiso) => (
                    <Grid item xs={12} sm={6} md={4} key={permiso}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={estaSeleccionado(subgrupo, permiso)}
                            onChange={() => togglePermiso(subgrupo, permiso)}
                          />
                        }
                        label={permiso}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleGuardar}
          disabled={!nombreValido || !hayPermisos}
        >
          Guardar rol
        </Button>
      </DialogActions>
    </Dialog>
  );
};
