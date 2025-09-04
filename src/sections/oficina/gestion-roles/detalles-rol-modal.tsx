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
  CircularProgress,
  Alert,
} from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { usePermisosPorGrupo } from 'src/hooks/roles/usePermisosPorGrupo';
import { permisosAgrupados } from 'src/constants/roles/permissions';
import { Rol } from 'src/api/types';

interface DetalleRolModalProps {
  open: boolean;
  onClose: () => void;
  rol: Rol; // rol.permissions: number[]
  // Ideal: Promise<void> para poder esperar al éxito
  onUpdate: (permissionsIds: number[]) => Promise<void> | void;
}

export const DetalleRolModal: FC<DetalleRolModalProps> = ({ open, onClose, rol, onUpdate }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Evita recrear el objeto si no cambia (opcional, por performance)
  const groups = useMemo(() => permisosAgrupados, []);

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
    markAsSaved,
  } = usePermisosPorGrupo(groups, rol.permissions);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdate = async () => {
    setErrorMsg(null);
    try {
      setLoading(true);
      const ids = selectedIds();

      const result = onUpdate(ids);
      // Si onUpdate retorna promesa, espera
      if (result && typeof (result as Promise<void>).then === 'function') {
        await (result as Promise<void>);
      }

      // Commit local del snapshot
      markAsSaved();

      // Cierra modal
      onClose();
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Ocurrió un error al actualizar el rol.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Detalle del rol: {rol.name}</DialogTitle>

      <DialogContent
        dividers
        sx={{
          maxHeight: { xs: '90dvh', sm: '80vh' },
          overflow: 'auto',
        }}
      >
        {errorMsg && (
          <Box mb={2}>
            <Alert severity="error">{errorMsg}</Alert>
          </Box>
        )}

        {Object.entries(groups).map(([modulo, secciones]) => (
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
                    disabled={loading}
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
                            disabled={loading}
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
        <Button
          onClick={onClose}
          disabled={loading}
        >
          Cerrar
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={isEqualToOriginal() || loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          {loading ? 'Guardando...' : 'Actualizar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
