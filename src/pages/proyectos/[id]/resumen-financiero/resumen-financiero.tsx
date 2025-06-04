import { FC, useState } from 'react';
import { Box, Card, Grid, Stack, Typography, Button } from '@mui/material';
import { SeverityPill } from 'src/components/severity-pill';
import { ModalRegistrarIngreso } from './registrar-ingreso-modal';
import { ModalRegistrarCobro } from './registrar-pago-modal';
import { ModalListaIngresos } from './ingresos-modal';
import { ModalListaPagos } from './pagos-modal';
import { ModalMovimientos } from './movimientos-modal';

interface ResumenFinancieroProps {
  data: {
    label: string;
    value: string;
    pill?: string;
    pillColor?: 'primary' | 'success' | 'error' | 'warning';
    buttonColor?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
    buttonLabel?: string;
    secondaryButtonLabel?: string;
    modalType?: 'ingreso' | 'pago' | 'movimientos';
  }[];
}

export const ResumenFinanciero: FC<ResumenFinancieroProps> = ({ data }) => {
  const [openIngreso, setOpenIngreso] = useState(false);
  const [openCobro, setOpenCobro] = useState(false);
  const [openListaIngresos, setOpenListaIngresos] = useState(false);
  const [openListaPagos, setOpenListaPagos] = useState(false);
  const [openMovimientos, setOpenMovimientos] = useState(false);

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
            {data.map((item, index) => {
              const handleClick = (modalType?: string) => {
                switch (modalType) {
                  case 'ingreso':
                    return setOpenIngreso(true);
                  case 'pago':
                    return setOpenCobro(true);
                  case 'movimientos':
                    return setOpenMovimientos(true);
                  default:
                    return;
                }
              };

              const handleSecondaryClick = (modalType?: string) => {
                switch (modalType) {
                  case 'ingreso':
                    return setOpenListaIngresos(true);
                  case 'pago':
                    return setOpenListaPagos(true);
                  default:
                    return;
                }
              };

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
                    {item.pill ? (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Typography
                          component="span"
                          variant="h5"
                        >
                          {item.value}
                        </Typography>
                        <SeverityPill color={item.pillColor || 'primary'}>{item.pill}</SeverityPill>
                      </Stack>
                    ) : (
                      <Typography variant="h5">{item.value}</Typography>
                    )}

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
                          color={item.buttonColor || 'primary'}
                          onClick={() => handleClick(item.modalType)}
                          sx={{ flex: 1, minWidth: 130 }}
                        >
                          {item.buttonLabel}
                        </Button>

                        {item.secondaryButtonLabel && (
                          <Button
                            size="large"
                            variant="text"
                            color={item.buttonColor || 'primary'}
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
        ingresos={[
          {
            id_ingreso: 'ing-001',
            proyecto_id: 'proy-001',
            monto_total: 'Q12,500',
            fecha_ingreso: '2025-06-01',
            tipo_ingreso: 'Avance de obra',
            tipo_documento: 'Transferencia',
            anotaciones: 'Pago parcial del avance #2',
            usuario_registro: 'Andrea López',
          },
          {
            id_ingreso: 'ing-002',
            proyecto_id: 'proy-001',
            monto_total: 'Q8,000',
            fecha_ingreso: '2025-06-02',
            tipo_ingreso: 'Pago final',
            tipo_documento: 'Efectivo',
            anotaciones: '',
            usuario_registro: 'Carlos Ramírez',
          },
        ]}
        open={openListaIngresos}
        onClose={() => setOpenListaIngresos(false)}
      />
      <ModalListaPagos
        pagos={[
          {
            id_pago: 'pag-001',
            proyecto_id: 'proy-001',
            monto_total: 'Q5,000',
            fecha_pago: '2025-06-01',
            tipo_pago: 'Maestro de obra',
            tipo_documento: 'Cheque',
            anotaciones: 'Pago quincenal',
            usuario_registro: 'Andrea López',
          },
          {
            id_pago: 'pag-002',
            proyecto_id: 'proy-001',
            monto_total: 'Q3,000',
            fecha_pago: '2025-06-03',
            tipo_pago: 'Socio',
            tipo_documento: 'Transferencia',
            anotaciones: 'Participación mensual',
            usuario_registro: 'Carlos Ramírez',
          },
        ]}
        open={openListaPagos}
        onClose={() => setOpenListaPagos(false)}
      />
      <ModalMovimientos
        movimientos={[
          {
            tipo: 'Ingreso',
            monto: 'Q12,500',
            fecha: '2025-06-01',
            descripcion: 'Avance de obra - Transferencia',
            usuario: 'Andrea López',
          },
          {
            tipo: 'Pago',
            monto: 'Q5,000',
            fecha: '2025-06-01',
            descripcion: 'Pago a maestro - Cheque',
            usuario: 'Andrea López',
          },
          {
            tipo: 'Ingreso',
            monto: 'Q8,000',
            fecha: '2025-06-02',
            descripcion: 'Pago final - Efectivo',
            usuario: 'Carlos Ramírez',
          },
        ]}
        open={openMovimientos}
        onClose={() => setOpenMovimientos(false)}
      />
    </>
  );
};
