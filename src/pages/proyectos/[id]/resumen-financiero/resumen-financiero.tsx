import { FC, useState } from 'react';
import { Box, Card, Grid, Stack, Typography, Button } from '@mui/material';
import { ModalRegistrarIngreso } from './registrar-ingreso-modal';
import { ModalRegistrarCobro } from './registrar-costo-modal';
import { ModalListaIngresos } from './ingresos-modal';
import { ModalMovimientos } from './movimientos-modal';
import { Ingreso, Costo } from '../index.d';
import { formatearQuetzales } from 'src/utils/format-currency';
import { ModalListaCostos } from './costos-modal';

type ButtonColor = 'inherit' | 'success' | 'error' | 'info' | 'primary' | 'secondary' | 'warning';

const isValidButtonColor = (value: any): value is ButtonColor =>
  ['inherit', 'success', 'error', 'info', 'primary', 'secondary', 'warning'].includes(value);

interface ResumenFinancieroProps {
  ingresos: Ingreso[];
  pagos: Costo[];
  presupuestoInicial: number;
}

export const ResumenFinanciero: FC<ResumenFinancieroProps> = ({
  ingresos,
  pagos: costos,
  presupuestoInicial,
}) => {
  const [openIngreso, setOpenIngreso] = useState(false);
  const [openCosto, setOpenCosto] = useState(false);
  const [openListaIngresos, setOpenListaIngresos] = useState(false);
  const [openListaCostos, setOpenListaCostos] = useState(false);
  const [openMovimientos, setOpenMovimientos] = useState(false);

  const totalIngresos = ingresos.reduce((acc, curr) => acc + curr.monto_total, 0);
  const ultimoIngreso = ingresos.reduce((latest, curr) =>
    new Date(curr.fecha_ingreso) > new Date(latest.fecha_ingreso) ? curr : latest
  ).fecha_ingreso;
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

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Card>
          <Grid
            container
            sx={{
              '& > *:not(:last-of-type)': {
                borderRight: (theme) => ({
                  md: `1px solid ${theme.palette.divider}`,
                }),
                borderBottom: (theme) => ({
                  xs: `1px solid ${theme.palette.divider}`,
                  md: 'none',
                }),
              },
            }}
          >
            {tarjetas.map((item, index) => {
              const color = isValidButtonColor(item.buttonColor) ? item.buttonColor : 'primary';

              return (
                <Grid
                  key={index}
                  xs={12}
                  sm={6}
                  md={3}
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
                      sx={{ p: 0 }}
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
                        sx={{ width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}
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
        onClose={() => setOpenIngreso(false)}
      />
      <ModalRegistrarCobro
        open={openCosto}
        onClose={() => setOpenCosto(false)}
      />
      <ModalListaIngresos
        open={openListaIngresos}
        onClose={() => setOpenListaIngresos(false)}
        ingresos={ingresos}
        fetchIngresos={() => {}}
      />
      <ModalListaCostos
        open={openListaCostos}
        onClose={() => setOpenListaCostos(false)}
        costos={costos}
        fetchCostos={() => {}}
      />
      <ModalMovimientos
        open={openMovimientos}
        onClose={() => setOpenMovimientos(false)}
        movimientos={[
          ...ingresos.map((ing) => ({
            tipo: 'Ingreso' as const,
            monto: ing.monto_total,
            fecha: ing.fecha_ingreso,
            descripcion: ing.tipo_ingreso,
            usuario: ing.usuario_registro,
          })),
          ...costos.map((costo) => ({
            tipo: 'Costo' as const,
            monto: costo.monto_total,
            fecha: costo.fecha_pago,
            descripcion: costo.tipo_pago,
            usuario: costo.usuario_registro,
          })),
        ]}
        fetchMovimientos={() => {}}
      />
    </>
  );
};
