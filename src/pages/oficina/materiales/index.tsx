import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  SvgIcon,
  Button,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { TablaPaginadaConFiltros } from 'src/components/tabla-paginada-con-filtros/tabla-paginada-con-filtros';
import { NextPage } from 'next';

import { ModalEditarMaterial } from './editar-material-modal';
import { ModalCrearMaterial } from './crear-material-modal';
import { useMaterialesApi } from 'src/api/materiales/useMaterialesApi';
import { ConfigMaterial, Material, NuevoMaterial } from 'src/api/types';
import { aplicarFiltros } from 'src/utils/aplicarFiltros';
import toast from 'react-hot-toast';

const Page: NextPage = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState<Material | null>(null);
  const [configMaterial, setConfigMaterial] = useState<ConfigMaterial>({
    materiales: [],
    marcas: [],
    unidades: [],
  });
  const [filtros, setFiltros] = useState({ search: '' });
  const [paginaActual, setPaginaActual] = useState(1);
  const rowsPerPage = 5;

  const { getMaterialesInfo, crearMaterial, actualizarMaterial } = useMaterialesApi();

  const handleGetMateriales = useCallback(async () => {
    try {
      const config = await getMaterialesInfo();
      setConfigMaterial(config);
    } catch (error) {
      toast.error('Error al obtener materiales');
    }
  }, [getMaterialesInfo]);

  const handleCrearMaterial = useCallback(
    async (nuevoMaterial: NuevoMaterial) => {
      try {
        await crearMaterial(nuevoMaterial);
        setModalCrearOpen(false);
        await handleGetMateriales();
        toast.success('Material creado exitosamente');
      } catch (error) {
        toast.error('Error al crear material');
      }
    },
    [crearMaterial, handleGetMateriales]
  );

  const handleActualizarMaterial = useCallback(
    async (id: number, material: NuevoMaterial) => {
      try {
        await actualizarMaterial(id, material);
        setModalEditarOpen(false);
        setMaterialSeleccionado(null);
        await handleGetMateriales();
        toast.success('Material actualizado exitosamente');
      } catch (error) {
        toast.error('Error al actualizar material');
      }
    },
    [actualizarMaterial, handleGetMateriales]
  );

  useEffect(() => {
    handleGetMateriales();
  }, [handleGetMateriales]);

  const materialesFiltrados = useMemo(() => {
    return aplicarFiltros(configMaterial.materiales, filtros, {
      camposTexto: ['nombre', 'unidad.nombre', 'marca.nombre'],
    });
  }, [configMaterial.materiales, filtros]);

  const abrirModalEditar = (material: Material) => {
    setMaterialSeleccionado(material);
    setModalEditarOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 3 }}
        >
          <Typography variant="h5">Materiales</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalCrearOpen(true)}
          >
            Crear material
          </Button>
        </Stack>

        <TablaPaginadaConFiltros
          totalItems={materialesFiltrados.length}
          onFiltrar={(f) => setFiltros((prev) => ({ ...prev, ...f }))}
          onPageChange={(page) => setPaginaActual(page)}
          filtrosSearch
          filtrosFecha={false}
        >
          {(currentPage, estadoFiltro) => {
            const start = (currentPage - 1) * rowsPerPage;
            const paginated = materialesFiltrados.slice(start, start + rowsPerPage);

            return (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Unidad</TableCell>
                      <TableCell>Marca</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.map((material) => (
                      <TableRow
                        key={material.id}
                        hover
                      >
                        <TableCell>{material.nombre}</TableCell>
                        <TableCell>{material.unidad.nombre}</TableCell>
                        <TableCell>{material.marca.nombre}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => abrirModalEditar(material)}>
                            <SvgIcon>
                              <EditIcon />
                            </SvgIcon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          }}
        </TablaPaginadaConFiltros>
      </Card>

      <ModalCrearMaterial
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onCrearMaterial={handleCrearMaterial}
        unidades={configMaterial.unidades}
        marcas={configMaterial.marcas}
      />

      {materialSeleccionado && (
        <ModalEditarMaterial
          open={modalEditarOpen}
          onClose={() => setModalEditarOpen(false)}
          initialData={materialSeleccionado}
          onActualizarMaterial={handleActualizarMaterial}
          unidades={configMaterial.unidades}
          marcas={configMaterial.marcas}
        />
      )}
    </Box>
  );
};

Page.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
