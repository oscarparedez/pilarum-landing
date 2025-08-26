import { FC, useCallback, useState } from 'react';
import { Box, Card, Grid, Stack, Typography, Button } from '@mui/material';
import { ModalRegistrarIngreso } from './registrar-ingreso-modal';
import { ModalRegistrarPago } from './registrar-costo-modal';
import { ModalListaIngresos } from './ingresos-modal';
import { ModalListaCostos } from './costos-modal';
import { ModalMovimientos } from './movimientos-modal';
import { formatearQuetzales } from 'src/utils/format-currency';
import { obtenerUltimoMovimiento, transformarMovimientos } from 'src/utils/proyectos/resumen-financiero-utils';
import { formatearFechaHora } from 'src/utils/format-date';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';
import { Costo, Ingreso, TipoCosto, TipoIngreso } from 'src/api/types';

type ButtonColor = 'inherit' | 'success' | 'error' | 'info' | 'primary' | 'secondary' | 'warning';

const isValidButtonColor = (value: any): value is ButtonColor =>
  ['inherit', 'success', 'error', 'info', 'primary', 'secondary', 'warning'].includes(value);

interface ResumenFinancieroProps {
  totalIngresos: number;
  totalPagos: number; // solo pagos reales
  ingresos: Ingreso[];
  pagos: Costo[];
  tiposIngreso: TipoIngreso[];
  tiposPago: TipoCosto[];
  presupuestoInicial: number;
  valorInventarioProyecto: number; // valor total de materiales asignados al proyecto
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
  valorInventarioProyecto,
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

  const canRegistrarIngresosCostos = useHasPermission(
    PermissionId.REGISTRAR_INGRESOS_COSTOS_PROYECTO
  );

  const ultimoMovimiento = obtenerUltimoMovimiento(ingresos, costos);

  // 🔹 materiales asignados (no son pagos)
  const costoMateriales = Number(valorInventarioProyecto || 0);

  // 🔹 costos totales del proyecto (pagos + materiales)
  const costoTotalProyecto = Number(totalPagos || 0) + costoMateriales;

  // 🔹 progreso relativo al presupuesto
  const safePresupuesto = Math.max(Number(presupuestoInicial || 0), 1);
  const progresoIngresos = Math.min((Number(totalIngresos || 0) / safePresupuesto) * 100, 100);
  const progresoCostos = Math.min((costoTotalProyecto / safePresupuesto) * 100, 100);

  // 🔹 ganancia bruta = ingresos - (pagos + materiales)
  const ganancia = Number(totalIngresos || 0) - costoTotalProyecto;

  // 🔹 desglose para mostrar bajo "Costos"
  const breakdownText =
    costoTotalProyecto > 0
      ? `(${formatearQuetzales(totalPagos)} en pagos, ${formatearQuetzales(
          costoMateriales
        )} en materiales)`
      : '';

  const tarjetas = [
    {
      label: 'Ingresos',
      value: `${formatearQuetzales(totalIngresos)}`,
      secondaryText: `${progresoIngresos.toFixed(0)} % del presupuesto alcanzado`,
      buttonLabel: 'Nuevo ingreso',
      secondaryButtonLabel: 'Ver ingresos',
      buttonColor: 'success' as ButtonColor,
      modalType: 'ingreso',
    },
    {
      label: 'Costos',
      value: `${formatearQuetzales(costoTotalProyecto)}`, // ✅ pagos + materiales
      secondaryText: `${progresoCostos.toFixed(0)} % del presupuesto gastado`,
      breakdownText, // ✅ muestra cuánto es de pagos y cuánto de materiales
      buttonLabel: 'Nuevo costo',
      secondaryButtonLabel: 'Ver costos',
      buttonColor: 'error' as ButtonColor,
      modalType: 'costo',
    },
    {
      label: 'Ganancia bruta',
      value: `${formatearQuetzales(ganancia)}`, // ✅ ingresos - (pagos + materiales)
      secondaryText: `${ingresos.length} ingresos - ${costos.length} costos`,
    },
    {
      label: 'Último movimiento',
      value: ultimoMovimiento ? formatearFechaHora(ultimoMovimiento.fecha) : '-',
      secondaryText: ultimoMovimiento ? formatearQuetzales(Number(ultimoMovimiento.monto)) : '-',
      buttonLabel: 'Ver movimientos',
      buttonColor: 'info' as ButtonColor,
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
      setOpenListaCostos(false); // ✅ cerramos la lista de costos
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
                  item
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

                    {/* 🔹 Desglose para Costos: pagos vs materiales */}
                    {'breakdownText' in item && item.breakdownText && item.label === 'Costos' && (
                      <Typography
                        color="text.secondary"
                        variant="caption"
                        align="center"
                      >
                        {item.breakdownText}
                      </Typography>
                    )}

                    {item.buttonLabel && (
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ flexWrap: 'wrap', width: '100%' }}
                      >
                        {canRegistrarIngresosCostos && (
                          <Button
                            size="large"
                            variant="contained"
                            color={color}
                            onClick={() => handleClick(item.modalType)}
                            sx={{ flex: 1, minWidth: 130 }}
                          >
                            {item.buttonLabel}
                          </Button>
                        )}
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
