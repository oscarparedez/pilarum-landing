import type { NextPage } from 'next';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import CalendarIcon from '@untitled-ui/icons-react/build/esm/Calendar';
import TrashIcon from '@untitled-ui/icons-react/build/esm/Trash01';
import VisibilityIcon from '@untitled-ui/icons-react/build/esm/Eye';

import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  alpha,
  Chip,
} from '@mui/material';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { CrearProyectoModal } from 'src/sections/proyectos/creacion/crear-proyecto-modal';
import { useProyectosApi } from 'src/api/proyectos/useProyectosApi';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { formatearFecha } from 'src/utils/format-date';
import { FullPageLoader } from 'src/components/loader/Loader';
import { ModalEliminar } from 'src/components/eliminar-modal';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { Proyecto, Socio } from 'src/api/types';
import { useSociosApi } from 'src/api/socios/useSociosApi';

const Page: NextPage = () => {
  const settings = useSettings();
  const router = useRouter();
  const { getProyectos, crearProyecto, eliminarProyecto } = useProyectosApi();
  const { getSociosInternos } = useSociosApi();

  const canCreateProyecto = useHasPermission(PermissionId.CREAR_PROYECTO);
  const canDeleteProyecto = useHasPermission(PermissionId.ELIMINAR_PROYECTO);

  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [filteredProyectos, setFilteredProyectos] = useState<Proyecto[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [modalCrearProyectoOpen, setModalCrearProyectoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  usePageView();

  const cargarProyectos = useCallback(async () => {
    setLoading(true);
    try {
      const [proyectosData, sociosData] = await Promise.all([getProyectos(), getSociosInternos()]);
      setProyectos(proyectosData);
      setFilteredProyectos(proyectosData);
      setSocios(sociosData);
    } catch {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [getProyectos, getSociosInternos]);

  useEffect(() => {
    cargarProyectos();
  }, [cargarProyectos]);

  const handleCrearProyecto = async (data: any) => {
    setLoading(true);
    try {
      await crearProyecto(data);
      toast.success('Proyecto creado exitosamente');
      setModalCrearProyectoOpen(false);
      cargarProyectos();
    } catch {
      toast.error('Error al crear proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalles = useCallback(
    (id: number) => {
      router.push(paths.dashboard.proyectos.detalle(id));
    },
    [router]
  );

  const handleDelete = async () => {
    if (deleteId !== null) {
      setLoading(true);
      try {
        await eliminarProyecto(deleteId);
        toast.success('Proyecto eliminado correctamente');
        cargarProyectos();
      } catch (err: any) {
        toast.error(err.message || 'Error al eliminar proyecto');
      } finally {
        setLoading(false);
        setDeleteId(null);
      }
    }
  };

  const handleFiltrar = useCallback(
    (filtros: {
      search: string;
      fechaInicio?: Date | null;
      fechaFin?: Date | null;
      empresa?: string;
      estado?: string;
    }) => {
      let filtered = [...proyectos];

      // Filtro por búsqueda de texto
      if (filtros.search) {
        const searchLower = filtros.search.toLowerCase();
        filtered = filtered.filter(
          (proyecto) =>
            proyecto.nombre?.toLowerCase().includes(searchLower) ||
            proyecto.ubicacion?.toLowerCase().includes(searchLower) ||
            proyecto.identificador?.toLowerCase().includes(searchLower) ||
            proyecto.socio_asignado?.nombre?.toLowerCase().includes(searchLower)
        );
      }

      // Filtro por fecha de inicio - proyectos que inician en o después de esta fecha
      if (filtros.fechaInicio) {
        filtered = filtered.filter(
          (proyecto) => new Date(proyecto.fechaInicio) >= filtros.fechaInicio!
        );
      }

      // Filtro por fecha de fin - proyectos que terminan en o antes de esta fecha
      if (filtros.fechaFin) {
        filtered = filtered.filter((proyecto) => new Date(proyecto.fechaFin) <= filtros.fechaFin!);
      }

      // Filtro por socio
      if (filtros.empresa) {
        filtered = filtered.filter(
          (proyecto) => proyecto.socio_asignado?.nombre === filtros.empresa
        );
      }

      // Filtro por estado
      if (filtros.estado) {
        filtered = filtered.filter((proyecto) => proyecto.estado === filtros.estado);
      }

      setFilteredProyectos(filtered);
    },
    [proyectos]
  );

  const renderProyectoCard = (proyecto: Proyecto) => (
    <Card
      key={proyecto.id}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 2 }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600 }}
          >
            {proyecto.nombre}
          </Typography>
          <Chip
            label={
              proyecto.estado === 'en_progreso'
                ? 'En Progreso'
                : proyecto.estado === 'pendiente'
                ? 'Pendiente'
                : proyecto.estado === 'pausado'
                ? 'Pausado'
                : proyecto.estado === 'completado'
                ? 'Completado'
                : 'Archivado'
            }
            size="small"
            sx={{
              backgroundColor:
                proyecto.estado === 'completado'
                  ? '#e8f5e8'
                  : proyecto.estado === 'en_progreso'
                  ? '#e3f2fd'
                  : proyecto.estado === 'pausado'
                  ? '#fff8e1'
                  : proyecto.estado === 'archivado'
                  ? '#fce4ec'
                  : '#f5f5f5',
              color:
                proyecto.estado === 'completado'
                  ? '#2e7d32'
                  : proyecto.estado === 'en_progreso'
                  ? '#1565c0'
                  : proyecto.estado === 'pausado'
                  ? '#ef6c00'
                  : proyecto.estado === 'archivado'
                  ? '#c62828'
                  : '#616161',
              border: `1px solid ${
                proyecto.estado === 'completado'
                  ? '#66bb6a'
                  : proyecto.estado === 'en_progreso'
                  ? '#42a5f5'
                  : proyecto.estado === 'pausado'
                  ? '#ffa726'
                  : proyecto.estado === 'archivado'
                  ? '#ef5350'
                  : '#bdbdbd'
              }`,
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            📍 {proyecto.ubicacion}
          </Typography>

          {proyecto.identificador && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              🏷️ Identificador: {proyecto.identificador}
            </Typography>
          )}

          <Typography
            variant="body2"
            color="primary.main"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}
          >
            <SvgIcon fontSize="small">
              <CalendarIcon />
            </SvgIcon>
            Inicio: {formatearFecha(proyecto.fechaInicio)}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <SvgIcon fontSize="small">
              <CalendarIcon />
            </SvgIcon>
            Fin: {formatearFecha(proyecto.fechaFin)}
          </Typography>

          {proyecto.socio_asignado && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              👥 Socio: {proyecto.socio_asignado.nombre}
            </Typography>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <IconButton
          color="success"
          onClick={() => handleVerDetalles(proyecto.id)}
        >
          <SvgIcon>
            <VisibilityIcon />
          </SvgIcon>
        </IconButton>
        {canDeleteProyecto && (
          <IconButton
            color="error"
            onClick={() => setDeleteId(proyecto.id)}
          >
            <SvgIcon>
              <TrashIcon />
            </SvgIcon>
          </IconButton>
        )}
      </CardActions>
    </Card>
  );

  return (
    <>
      {loading && <FullPageLoader />}
      <Seo title="Proyectos" />
      <Box
        component="main"
        sx={{ flexGrow: 1, py: 8 }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={4}
            sx={{ mb: 4 }}
          >
            <Typography variant="h4">Proyectos</Typography>
            {canCreateProyecto && (
              <Button
                startIcon={
                  <SvgIcon>
                    <PlusIcon />
                  </SvgIcon>
                }
                variant="contained"
                onClick={() => setModalCrearProyectoOpen(true)}
              >
                Crear nuevo proyecto
              </Button>
            )}
          </Stack>

          <TablaPaginadaConFiltros
            onFiltrar={handleFiltrar}
            totalItems={filteredProyectos.length}
            itemsPerPage={6}
            filtrosSearch={true}
            filtrosFecha={true}
            filtrosEstado={false}
            filtrosRol={false}
            filtrosEmpresa={true}
            empresas={socios.map((socio) => ({ id: socio.id, nombre: socio.nombre }))}
            filtrosTipoIngreso={false}
            filtrosTipoOrigen={false}
            filtrosEstadoOpciones={[
              'pendiente',
              'en_progreso',
              'pausado',
              'completado',
              'archivado',
            ]}
            estadoLabel="Estado proyecto"
          >
            {(currentPage) => {
              const startIndex = (currentPage - 1) * 6;
              const endIndex = startIndex + 6;
              const paginatedProyectos = filteredProyectos.slice(startIndex, endIndex);

              if (paginatedProyectos.length === 0) {
                return (
                  <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No hay proyectos disponibles
                    </Typography>
                  </Box>
                );
              }

              return (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)',
                    },
                    gap: 3,
                  }}
                >
                  {paginatedProyectos.map((proyecto) => renderProyectoCard(proyecto))}
                </Box>
              );
            }}
          </TablaPaginadaConFiltros>
        </Container>

        <CrearProyectoModal
          open={modalCrearProyectoOpen}
          onClose={() => setModalCrearProyectoOpen(false)}
          onConfirm={handleCrearProyecto}
        />

        {deleteId !== null && (
          <ModalEliminar
            type="proyecto"
            open={true}
            onClose={() => setDeleteId(null)}
            onConfirm={handleDelete}
          />
        )}
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
