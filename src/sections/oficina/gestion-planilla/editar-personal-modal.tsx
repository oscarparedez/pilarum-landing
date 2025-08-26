import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import { useRolesApi } from 'src/api/roles/useRolesApi';
import { NuevoUsuario, Rol, Usuario } from 'src/api/types';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';

interface Props {
  open: boolean;
  onClose: () => void;
  initialData: Usuario;
  onConfirm: (usuario: NuevoUsuario) => void;
}

export const ModalEditarPersona: FC<Props> = ({ open, onClose, initialData, onConfirm }) => {
  const { getRoles } = useRolesApi();
  const canUnsubscribeUser = useHasPermission(PermissionId.BAJA_USUARIO_PLANILLA);

  const [roles, setRoles] = useState<Rol[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const [form, setForm] = useState<NuevoUsuario>({
    username: initialData.username,
    first_name: initialData.first_name,
    last_name: initialData.last_name,
    telefono: initialData.telefono ?? '',
    is_active: initialData.is_active,
    groups: initialData.groups?.length ? [initialData.groups[0].id] : [],
  });

  // Reset form cuando cambie initialData
  useEffect(() => {
    setForm({
      username: initialData.username,
      first_name: initialData.first_name,
      last_name: initialData.last_name,
      telefono: initialData.telefono ?? '',
      is_active: initialData.is_active,
      groups: initialData.groups?.length ? [initialData.groups[0].id] : [],
    });
  }, [initialData]);

  // Cargar roles
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setRolesLoading(true);
        const data = await getRoles();
        if (!mounted) return;
        setRoles(data);
      } finally {
        if (mounted) setRolesLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [getRoles]);

  const handleChangeBasic = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof NuevoUsuario; value: string };
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleChangeEstado = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as 'Activo' | 'Inactivo';
    setForm((prev) => ({ ...prev, is_active: value === 'Activo' }));
  }, []);

  const handleChangeRol = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const roleId = Number(e.target.value);
    setForm((prev) => ({ ...prev, groups: roleId ? [roleId] : [] }));
  }, []);

  const handleGuardar = useCallback(() => {
    const payload: NuevoUsuario = {
      ...form,
      telefono: form.telefono?.toString().trim() && form.telefono,
    };
    onConfirm(payload);
  }, [form, onConfirm]);

  const estadoUI = useMemo(() => (form.is_active ? 'Activo' : 'Inactivo'), [form.is_active]);
  const rolIdSeleccionado = useMemo(() => form.groups?.[0] ?? '', [form.groups]);
  const isValid = useMemo(
    () => form.first_name.trim() && form.last_name.trim() && !!rolIdSeleccionado,
    [form.first_name, form.last_name, rolIdSeleccionado]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>Editar persona</DialogTitle>
      <DialogContent
        dividers
        sx={{ pt: 2 }}
      >
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={2}
          >
            <TextField
              fullWidth
              label="Nombre(s)"
              name="first_name"
              value={form.first_name}
              onChange={handleChangeBasic}
            />
            <TextField
              fullWidth
              label="Apellido(s)"
              name="last_name"
              value={form.last_name}
              onChange={handleChangeBasic}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={2}
          >
            <TextField
              fullWidth
              label="Usuario"
              name="username"
              value={form.username}
              onChange={handleChangeBasic}
              disabled
            />
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={form.telefono ?? ''}
              onChange={handleChangeBasic}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={2}
          >
            <TextField
              select
              fullWidth
              label="Rol / especialidad"
              name="rolId"
              value={rolIdSeleccionado}
              onChange={handleChangeRol}
              disabled={rolesLoading}
            >
              {rolesLoading ? (
                <MenuItem value="">
                  <CircularProgress size={18} />
                </MenuItem>
              ) : (
                roles.map((r) => (
                  <MenuItem
                    key={r.id}
                    value={r.id}
                  >
                    {r.name}
                  </MenuItem>
                ))
              )}
            </TextField>

            {canUnsubscribeUser && (
              <TextField
                select
                fullWidth
                label="Estado"
                name="estado"
                value={estadoUI}
                onChange={handleChangeEstado}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </TextField>
            )}
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleGuardar}
          disabled={!isValid || rolesLoading}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
