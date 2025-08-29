import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Divider,
  Checkbox,
  FormControlLabel,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { usePermisosPorGrupo } from 'src/hooks/roles/usePermisosPorGrupo';
import { permisosAgrupados } from 'src/constants/roles/permissions';
import { Rol } from 'src/api/types';

interface DetalleRolModalProps {
  open: boolean;
  onClose: () => void;
  rol: Rol;
  onUpdate: (permissionsIds: number[]) => void;
}

export const DetalleRolModal: FC<DetalleRolModalProps> = ({ open, onClose, rol, onUpdate }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    seleccionados,
    togglePermiso,
    seleccionarTodos,
    deseleccionarTodos,
    estaSeleccionado,
    todosSeleccionados,
    cantidadSeleccionados,
    isEqualToOriginal,
    selectedIds,
  } = usePermisosPorGrupo(permisosAgrupados, rol.permissions);

  const handleUpdate = () => {
    onUpdate(selectedIds());
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      keepMounted
    >
      <DialogTitle>Detalle del rol: {rol.name}</DialogTitle>
      <DialogContent 
        dividers
        sx={{
          maxHeight: { xs: '90dvh', sm: '80vh' },
          overflow: 'auto',
        }}
      >
        {Object.entries(permisosAgrupados).map(([modulo, secciones]) => (
          <Box
            key={modulo}
            sx={{ mt: 3 }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 1 }}
            >
              {modulo}
            </Typography>
            {Object.entries(secciones).map(([subgrupo, permisos]) => (
              <Box
                key={subgrupo}
                sx={{ pl: 2, mb: 2 }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="500"
                  >
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
                <Grid
                  container
                  spacing={1}
                  mt={1}
                >
                  {permisos.map((permiso) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={permiso}
                    >
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
        <Button onClick={onClose}>Cerrar</Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={isEqualToOriginal()}
        >
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
