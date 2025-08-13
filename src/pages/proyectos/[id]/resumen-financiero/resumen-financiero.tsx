import { FC, useCallback, useState } from 'react';
import { Box, Card, Grid, Stack, Typography, Button } from '@mui/material';
import { ModalRegistrarIngreso } from './registrar-ingreso-modal';
import { ModalRegistrarPago } from './registrar-costo-modal';
import { ModalListaIngresos } from './ingresos-modal';
import { ModalListaCostos } from './costos-modal';
import { ModalMovimientos } from './movimientos-modal';
import { Ingreso, Costo } from '../index.d';
import { formatearQuetzales } from 'src/utils/format-currency';
import { TipoIngreso } from '../../configuracion/tipo-ingresos/index.d';
import { TipoPago } from '../../configuracion/tipo-pagos/index.d';
import { obtenerUltimoMovimiento, transformarMovimientos } from './utils';
import { formatearFechaHora } from 'src/utils/format-date';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/pages/oficina/roles/permissions';

type ButtonColor = 'inherit' | 'success' | 'error' | 'info' | 'primary' | 'secondary' | 'warning';

const isValidButtonColor = (value: any): value is ButtonColor =>
  ['inherit', 'success', 'error', 'info', 'primary', 'secondary', 'warning'].includes(value);

interface ResumenFinancieroProps {
  totalIngresos: number;
  totalPagos: number;
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
    anotaciones?: string;
    correlativo?: string;
  }) => void;
  onActualizarIngreso: (
    ingreso_id: number,
    data: {
      monto_total: number;
      tipo_ingreso: number;
      tipo_documento: string;
      fecha_ingreso: string;
      anotaciones?: string;
      correlativo?: string;
    }
  ) => Promise<void>;
  onEliminarIngreso: (ingreso_id: number) => Promise<void>;
  onCrearPago: (data: {
    monto_total: number;
    tipo_pago: number;
    tipo_documento: string;
    fecha_pago: string;
    anotaciones?: string;
    correlativo?: string;
  }) => void;
  onActualizarPago: (
    pago_id: number,
    data: {
      monto_total: number;
      tipo_pago: number;
      tipo_documento: string;
      fecha_pago: string;
      anotaciones?: string;
      correlativo?: string;
    }
  ) => Promise<void>;
  onEliminarPago: (pago_id: number) => Promise<void>;
}

export const ResumenFinanciero: FC<ResumenFinancieroProps> = ({
  totalIngresos,
  totalPagos,
  ingresos,
  pagos: costos,
  tiposIngreso,
  tiposPago,
  presupuestoInicial,
  onCrearIngreso,
  onActualizarIngreso,
  onEliminarIngreso,
  onCrearPago,
  onActualizarPago,
  onEliminarPago,
}) => {
  const [openIngreso, setOpenIngreso] = useState(false);
  const [openCosto, setOpenCosto] = useState(false);
  const [openListaIngresos, setOpenListaIngresos] = useState(false);
  const [openListaCostos, setOpenListaCostos] = useState(false);
  const [openMovimientos, setOpenMovimientos] = useState(false);


  const canRegistrarIngresosCostos = useHasPermission(PermissionId.REGISTRAR_INGRESOS_COSTOS_PROYECTO)

  const ultimoMovimiento = obtenerUltimoMovimiento(ingresos, costos);
  const progresoIngresos = Math.min((totalIngresos / presupuestoInicial) * 100, 100);
  const progresoCostos = Math.min((totalPagos / presupuestoInicial) * 100, 100);
  const ganancia = totalIngresos - totalPagos;

  const tarjetas = [
    {
      label: 'Ingresos',
      value: `${formatearQuetzales(totalIngresos)}`,
      secondaryText: `${progresoIngresos.toFixed(0)} % del presupuesto alcanzado`,
      buttonLabel: 'Nuevo ingreso',
      secondaryButtonLabel: 'Ver ingresos',
      buttonColor: 'success',
      modalType: 'ingreso',
    },
    {
      label: 'Costos',
      value: `${formatearQuetzales(totalPagos)}`,
      secondaryText: `${progresoCostos.toFixed(0)} % del presupuesto gastado`,
      buttonLabel: 'Nuevo costo',
      secondaryButtonLabel: 'Ver costos',
      buttonColor: 'error',
      modalType: 'costo',
    },
    {
      label: 'Ganancia bruta',
      value: `${formatearQuetzales(ganancia)}`,
      secondaryText: `${ingresos.length} ingresos - ${costos.length} costos`,
    },
    {
      label: 'Último movimiento',
      value: ultimoMovimiento ? formatearFechaHora(ultimoMovimiento.fecha) : '-',
      secondaryText: ultimoMovimiento ? formatearQuetzales(Number(ultimoMovimiento.monto)) : '-',
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

  const handleCrearIngreso = useCallback(
    (data: any) => {
      onCrearIngreso(data);
      setOpenIngreso(false);
    },
    [onCrearIngreso]
  );

  const handleActualizarIngreso = useCallback(
    async (id: number, data: any) => {
      await onActualizarIngreso(id, data);
      setOpenListaIngresos(false);
    },
    [onActualizarIngreso]
  );

  const handleCrearPago = useCallback(
    (data: any) => {
      onCrearPago(data);
      setOpenCosto(false);
    },
    [onCrearPago]
  );

  const handleActualizarPago = useCallback(
    async (id: number, data: any) => {
      await onActualizarPago(id, data);
      setOpenListaCostos(false);
    },
    [onActualizarPago]
  );

  const handleEliminarPago = useCallback(
    async (pagoId: number) => {
      await onEliminarPago(pagoId);
      setOpenListaIngresos(false);
    },
    [onEliminarPago]
  );

  const movimientos = transformarMovimientos(ingresos, costos);

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
                      {item.secondaryText ?? '-'}
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
                        { canRegistrarIngresosCostos && <Button
                          size="large"
                          variant="contained"
                          color={color}
                          onClick={() => handleClick(item.modalType)}
                          sx={{ flex: 1, minWidth: 130 }}
                        >
                          {item.buttonLabel}
                        </Button>}
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
      <ModalRegistrarPago
        open={openCosto}
        tiposPago={tiposPago}
        onClose={() => setOpenCosto(false)}
        onSave={handleCrearPago}
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
        tiposPago={tiposPago}
        onActualizarCosto={handleActualizarPago}
        onEliminarCosto={handleEliminarPago}
      />
      <ModalMovimientos
        open={openMovimientos}
        onClose={() => setOpenMovimientos(false)}
        movimientos={movimientos}
      />
    </>
  );
};
