import { FC, useState } from 'react';
import { Box, Card, Grid, Stack, Typography, Button } from '@mui/material';
import { ModalRegistrarIngreso } from './registrar-ingreso-modal';
import { ModalRegistrarCobro } from './registrar-costo-modal';
import { ModalListaIngresos } from './ingresos-modal';
import { ModalListaCostos } from './costos-modal';
import { ModalMovimientos } from './movimientos-modal';
import { Ingreso, Costo } from '../index.d';
import { formatearQuetzales } from 'src/utils/format-currency';
import { TipoIngreso } from '../../configuracion/tipo-ingresos/index.d';
import { TipoPago } from '../../configuracion/tipo-pagos/index.d';

type ButtonColor = 'inherit' | 'success' | 'error' | 'info' | 'primary' | 'secondary' | 'warning';

const isValidButtonColor = (value: any): value is ButtonColor =>
  ['inherit', 'success', 'error', 'info', 'primary', 'secondary', 'warning'].includes(value);

interface ResumenFinancieroProps {
  totalIngresos: number;
  ingresos: Ingreso[];
  pagos: Costo[];
  tiposIngreso: TipoIngreso[];
  tiposPago: TipoPago[];
  presupuestoInicial: number;
  onCrearIngreso: (data: {
    monto_total: number;
    tipo_ingreso: number;
    tipo_documento: string;
    fecha_ingreso: string;
    anotaciones: string;
  }) => void;
  onActualizarIngreso: (
    ingreso_id: number,
    data: {
      monto_total: number;
      tipo_ingreso: number;
      tipo_documento: string;
      fecha_ingreso: string;
      anotaciones: string;
    }
  ) => Promise<void>;
  onEliminarIngreso: (ingreso_id: number) => Promise<void>;
  onCrearPago: (data: any) => Promise<void>;
}

export const ResumenFinanciero: FC<ResumenFinancieroProps> = ({
  totalIngresos,
  ingresos,
  pagos: costos,
  tiposIngreso,
  tiposPago,
  presupuestoInicial,
  onCrearIngreso,
  onActualizarIngreso,
  onEliminarIngreso,
  onCrearPago,
}) => {
  const [openIngreso, setOpenIngreso] = useState(false);
  const [openCosto, setOpenCosto] = useState(false);
  const [openListaIngresos, setOpenListaIngresos] = useState(false);
  const [openListaCostos, setOpenListaCostos] = useState(false);
  const [openMovimientos, setOpenMovimientos] = useState(false);

  const ultimoIngreso = ingresos.length
    ? ingresos.reduce((latest, curr) =>
        new Date(curr.fecha_ingreso) > new Date(latest.fecha_ingreso) ? curr : latest
      ).fecha_ingreso
    : '';
  const totalCostos = costos.reduce((acc, curr) => acc + curr.monto_total, 0);
  const progreso = Math.min((totalIngresos / presupuestoInicial) * 100, 100);
  const ganancia = totalIngresos - totalCostos;

  const tarjetas = [
    {
      label: 'Ingresos',
      value: `${formatearQuetzales(totalIngresos)}`,
      buttonLabel: 'Nuevo ingreso',
      secondaryButtonLabel: 'Ver ingresos',
      buttonColor: 'success',
      modalType: 'ingreso',
    },
    {
      label: 'Costos',
      value: `${formatearQuetzales(totalCostos)}`,
      buttonLabel: 'Nuevo costo',
      secondaryButtonLabel: 'Ver costos',
      buttonColor: 'error',
      modalType: 'costo',
    },
    {
      label: 'Ganancia bruta',
      value: `${formatearQuetzales(ganancia)}`,
    },
    {
      label: 'Último ingreso',
      value: ultimoIngreso,
      buttonLabel: 'Ver movimientos',
      buttonColor: 'info',
      modalType: 'movimientos',
    },
  ];

  const handleClick = (modalType?: string) => {
    switch (modalType) {
      case 'ingreso':
        return setOpenIngreso(true);
      case 'costo':
        return setOpenCosto(true);
      case 'movimientos':
        return setOpenMovimientos(true);
    }
  };

  const handleSecondaryClick = (modalType?: string) => {
    switch (modalType) {
      case 'ingreso':
        return setOpenListaIngresos(true);
      case 'costo':
        return setOpenListaCostos(true);
    }
  };

  const handleCrearIngreso = (data: {
    monto_total: number;
    tipo_ingreso: number;
    tipo_documento: string;
    fecha_ingreso: string;
    anotaciones: string;
  }) => {
    onCrearIngreso(data);
    setOpenIngreso(false);
  };

  const handleActualizarIngreso = async (
    id: number,
    data: {
      monto_total: number;
      tipo_ingreso: number;
      tipo_documento: string;
      fecha_ingreso: string;
      anotaciones: string;
    }
  ) => {
    await onActualizarIngreso(id, data);
    setOpenListaIngresos(false);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Card>
          <Grid container>
            {tarjetas.map((item, index) => {
              const color = isValidButtonColor(item.buttonColor) ? item.buttonColor : 'primary';

              return (
                <Grid
                  key={index}
                  xs={12}
                  sm={6}
                  md={3}
                  sx={{
                    borderRight: {
                      md: index < tarjetas.length - 1 ? '1px solid #e0e0e0' : 'none',
                    },
                    borderBottom: {
                      xs: index % 2 === 0 ? '1px solid #e0e0e0' : 'none',
                      md: 'none',
                    },
                  }}
                >
                  <Stack
                    alignItems="center"
                    spacing={1}
                    sx={{ p: 3 }}
                  >
                    <Typography variant="h5">{item.value}</Typography>
                    <Typography
                      color="text.secondary"
                      variant="overline"
                      align="center"
                    >
                      {item.label === 'Ingresos'
                        ? `${progreso.toFixed(0)} % del presupuesto alcanzado`
                        : '-'}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="overline"
                    >
                      {item.label}
                    </Typography>

                    {item.buttonLabel && (
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ flexWrap: 'wrap', width: '100%' }}
                      >
                        <Button
                          size="large"
                          variant="contained"
                          color={color}
                          onClick={() => handleClick(item.modalType)}
                          sx={{ flex: 1, minWidth: 130 }}
                        >
                          {item.buttonLabel}
                        </Button>
                        {item.secondaryButtonLabel && (
                          <Button
                            size="large"
                            variant="text"
                            color={color}
                            onClick={() => handleSecondaryClick(item.modalType)}
                            sx={{ flex: 1, minWidth: 130 }}
                          >
                            {item.secondaryButtonLabel}
                          </Button>
                        )}
                      </Stack>
                    )}
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        </Card>
      </Box>

      <ModalRegistrarIngreso
        open={openIngreso}
        tiposIngreso={tiposIngreso}
        onClose={() => setOpenIngreso(false)}
        onSave={handleCrearIngreso}
      />
      <ModalRegistrarCobro
        open={openCosto}
        // tiposPago={tiposPago}
        onClose={() => setOpenCosto(false)}
        // onConfirm={onCrearPago}
      />
      <ModalListaIngresos
        open={openListaIngresos}
        onClose={() => setOpenListaIngresos(false)}
        ingresos={ingresos}
        tiposIngreso={tiposIngreso}
        onActualizarIngreso={handleActualizarIngreso}
        onEliminarIngreso={onEliminarIngreso}
      />
      <ModalListaCostos
        open={openListaCostos}
        onClose={() => setOpenListaCostos(false)}
        costos={costos}
        fetchCostos={() => console.log('asd')}
      />
      <ModalMovimientos
        open={openMovimientos}
        onClose={() => setOpenMovimientos(false)}
        movimientos={[]}
        fetchMovimientos={() => {}}
      />
    </>
  );
};
