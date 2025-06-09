import { FC, useState } from 'react';
import { Box, Card, Grid, Stack, Typography, Button } from '@mui/material';
import { ModalRegistrarIngreso } from './registrar-ingreso-modal';
import { ModalRegistrarCobro } from './registrar-pago-modal';
import { ModalListaIngresos } from './ingresos-modal';
import { ModalListaPagos } from './pagos-modal';
import { ModalMovimientos } from './movimientos-modal';
import { Ingreso, Pago } from '../index.d';
import { formatearQuetzales } from 'src/utils/format-currency';

type ButtonColor = 'inherit' | 'success' | 'error' | 'info' | 'primary' | 'secondary' | 'warning';

const isValidButtonColor = (value: any): value is ButtonColor =>
  ['inherit', 'success', 'error', 'info', 'primary', 'secondary', 'warning'].includes(value);

interface ResumenFinancieroProps {
  ingresos: Ingreso[];
  pagos: Pago[];
  presupuestoInicial: number;
}

export const ResumenFinanciero: FC<ResumenFinancieroProps> = ({
  ingresos,
  pagos,
  presupuestoInicial,
}) => {
  const [openIngreso, setOpenIngreso] = useState(false);
  const [openCobro, setOpenCobro] = useState(false);
  const [openListaIngresos, setOpenListaIngresos] = useState(false);
  const [openListaPagos, setOpenListaPagos] = useState(false);
  const [openMovimientos, setOpenMovimientos] = useState(false);

  const totalIngresos = ingresos.reduce((acc, curr) => acc + curr.monto_total, 0);

  const ultimoIngreso = ingresos.reduce((latest, curr) =>
    new Date(curr.fecha_ingreso) > new Date(latest.fecha_ingreso) ? curr : latest
  ).fecha_ingreso;

  const totalPagos = pagos.reduce((acc, curr) => acc + curr.monto_total, 0);

  const progreso = Math.min((totalIngresos / presupuestoInicial) * 100, 100);
  const ganancia = totalIngresos - totalPagos;

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
      label: 'Pagos',
      value: `${formatearQuetzales(totalPagos)}`,
      buttonLabel: 'Nuevo pago',
      secondaryButtonLabel: 'Ver pagos',
      buttonColor: 'error',
      modalType: 'pago',
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
      case 'pago':
        return setOpenCobro(true);
      case 'movimientos':
        return setOpenMovimientos(true);
    }
  };

  const handleSecondaryClick = (modalType?: string) => {
    switch (modalType) {
      case 'ingreso':
        return setOpenListaIngresos(true);
      case 'pago':
        return setOpenListaPagos(true);
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
                      sx={{ p: 0}}
                    >
                      {item.label === 'Ingresos' ? `${progreso.toFixed(0)} % del presupuesto alcanzado` : '-' }
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

      {/* Modales */}
      <ModalRegistrarIngreso
        open={openIngreso}
        onClose={() => setOpenIngreso(false)}
      />
      <ModalRegistrarCobro
        open={openCobro}
        onClose={() => setOpenCobro(false)}
      />
      <ModalListaIngresos
        open={openListaIngresos}
        onClose={() => setOpenListaIngresos(false)}
        ingresos={ingresos}
        fetchIngresos={() => {}}
      />
      <ModalListaPagos
        open={openListaPagos}
        onClose={() => setOpenListaPagos(false)}
        pagos={pagos}
        fetchPagos={() => {}}
      />
      <ModalMovimientos
        open={openMovimientos}
        onClose={() => setOpenMovimientos(false)}
        //TODO - Implementar la agrupación de movimientos en redux
        movimientos={[
          ...ingresos.map((ing) => ({
            tipo: 'Ingreso' as const,
            monto: ing.monto_total,
            fecha: ing.fecha_ingreso,
            descripcion: ing.tipo_ingreso,
            usuario: ing.usuario_registro,
          })),
          ...pagos.map((pag) => ({
            tipo: 'Pago' as const,
            monto: pag.monto_total,
            fecha: pag.fecha_pago,
            descripcion: pag.tipo_pago,
            usuario: pag.usuario_registro,
          })),
        ]}
        fetchMovimientos={() => {}}
      />
    </>
  );
};
