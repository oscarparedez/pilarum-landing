import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CategoryIcon from '@mui/icons-material/Category';
import SourceIcon from '@mui/icons-material/Source';
import type { ApexOptions } from 'apexcharts';
import { useTheme } from '@mui/material/styles';
import { Chart } from 'src/components/chart';
import { CostoGeneral } from 'src/api/types';
import { formatearQuetzales } from 'src/utils/format-currency';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatearFecha } from 'src/utils/format-date';

interface CostosChartsModalProps {
  open: boolean;
  onClose: () => void;
  costos: CostoGeneral[];
  tipoOrigenFiltrado?: string;
  empresaFiltrada?: string;
  proyectoFiltrado?: string;
  equipoFiltrado?: string;
  ordenCompraFiltrada?: string;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
}

export const CostosChartsModal: React.FC<CostosChartsModalProps> = ({
  open,
  onClose,
  costos,
  tipoOrigenFiltrado,
  empresaFiltrada,
  proyectoFiltrado,
  equipoFiltrado,
  ordenCompraFiltrada,
  fechaInicio,
  fechaFin,
}) => {
  const theme = useTheme();

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getTipoOrigenLabel = (tipo: string) => {
    const labelMap: Record<string, string> = {
      proyecto: 'Proyecto',
      orden_compra: 'Orden de Compra',
      gasto_maquinaria: 'Maquinaria',
      compra_maquinaria: 'Maquinaria',
    };
    return labelMap[tipo] || tipo;
  };

  const getOrigenTitle = () => {
    if (tipoOrigenFiltrado) {
      const prefijo = getTipoOrigenLabel(tipoOrigenFiltrado);
      return `${prefijo} - Top Orígenes de Costos`;
    }
    return 'Top Orígenes de Costos';
  };

  const procesarDatosPorTipoOrigen = () => {
    const tiposMap = new Map();

    costos.forEach((costo) => {
      const tipoOrigen = costo.tipo_origen || 'Sin tipo';
      const monto = Number(costo.monto || 0);

      if (tiposMap.has(tipoOrigen)) {
        tiposMap.set(tipoOrigen, tiposMap.get(tipoOrigen) + monto);
      } else {
        tiposMap.set(tipoOrigen, monto);
      }
    });

    const tipos = Array.from(tiposMap.entries()).sort((a, b) => b[1] - a[1]);

    return {
      labels: tipos.map(([nombre]) => {
        const labelMap: Record<string, string> = {
          proyecto: 'Proyectos',
          orden_compra: 'Órdenes de Compra',
          gasto_maquinaria: 'Gastos de Maquinaria',
          compra_maquinaria: 'Compra de Maquinaria',
        };
        return labelMap[nombre] || nombre;
      }),
      series: tipos.map(([, monto]) => monto),
    };
  };

  const procesarDatosPorOrigen = () => {
    const origenesMap = new Map();
    const origenesInfo = new Map();

    costos.forEach((costo) => {
      const origen = costo.origen || 'Sin origen';
      const tipoOrigenLabel = getTipoOrigenLabel(costo.tipo_origen || '');
      const origenCompleto = `${tipoOrigenLabel} - ${origen}`;
      const monto = Number(costo.monto || 0);

      if (origenesMap.has(origenCompleto)) {
        origenesMap.set(origenCompleto, origenesMap.get(origenCompleto) + monto);
      } else {
        origenesMap.set(origenCompleto, monto);
        origenesInfo.set(origenCompleto, {
          tipo_origen: costo.tipo_origen,
          origen_id: costo.origen_id,
          origen_original: origen,
        });
      }
    });

    const origenes = Array.from(origenesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Top 10

    return {
      categories: origenes.map(([nombre]) => truncateText(nombre, 20)), // Aumentar límite para incluir prefijo
      fullNames: origenes.map(([nombre]) => nombre), // Nombres completos para tooltip
      series: [
        {
          name: 'Costos',
          data: origenes.map(([, monto]) => monto),
        },
      ],
      origenesInfo: origenes.map(([nombre]) => origenesInfo.get(nombre)),
    };
  };

  const procesarDatosTemporal = () => {
    const mesesMap = new Map();

    costos.forEach((costo) => {
      const fecha = new Date(costo.fecha);
      const mesAnio = format(fecha, 'MMM yyyy', { locale: es });
      const monto = Number(costo.monto || 0);

      if (mesesMap.has(mesAnio)) {
        mesesMap.set(mesAnio, mesesMap.get(mesAnio) + monto);
      } else {
        mesesMap.set(mesAnio, monto);
      }
    });

    // Ordenar por fecha usando la fecha original del primer costo de cada mes
    const mesesConFecha = new Map();
    costos.forEach((costo) => {
      const fecha = new Date(costo.fecha);
      const mesAnio = format(fecha, 'MMM yyyy', { locale: es });
      if (!mesesConFecha.has(mesAnio)) {
        // Usar el primer día del mes para ordenamiento
        const año = fecha.getFullYear();
        const mes = fecha.getMonth();
        mesesConFecha.set(mesAnio, new Date(año, mes, 1));
      }
    });

    const mesesOrdenados = Array.from(mesesMap.entries()).sort((a, b) => {
      const fechaA = mesesConFecha.get(a[0]);
      const fechaB = mesesConFecha.get(b[0]);
      return fechaA.getTime() - fechaB.getTime();
    });

    return {
      categories: mesesOrdenados.map(([mes]) => mes),
      series: [
        {
          name: 'Costos',
          data: mesesOrdenados.map(([, monto]) => monto),
        },
      ],
    };
  };

  // Opciones para gráfico de barras (por origen)
  const getBarChartOptions = (categories: string[], fullNames: string[]): ApexOptions => ({
    chart: {
      background: 'transparent',
      toolbar: { show: false },
    },
    colors: [
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.primary.main,
      '#9C27B0', // Purple
      '#FF9800', // Orange
      '#607D8B', // Blue Grey
      '#795548', // Brown
    ],
    dataLabels: { enabled: false },
    fill: { opacity: 0.8 },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      labels: {
        colors: theme.palette.text.primary,
      },
      formatter: function (seriesName: string, opts: any) {
        // Mostrar nombres completos en la leyenda
        return fullNames[opts.seriesIndex] || seriesName;
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '11px',
        },
        rotate: -45,
        maxHeight: 80,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatearQuetzales(value),
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      x: {
        formatter: (value, opts) => {
          return fullNames[opts.dataPointIndex] || '';
        },
      },
      y: {
        formatter: (value) => formatearQuetzales(value),
      },
    },
  });

  // Opciones para gráfico de barras con leyenda (sin etiquetas en X)
  const getBarChartOptionsWithLegend = (fullNames: string[]): ApexOptions => ({
    chart: {
      background: 'transparent',
      toolbar: { show: false },
    },
    colors: [
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.primary.main,
      '#9C27B0', // Purple
      '#FF9800', // Orange
      '#607D8B', // Blue Grey
      '#795548', // Brown
      '#E91E63', // Pink
      '#00BCD4', // Cyan
      '#4CAF50', // Green
      '#FFC107', // Amber
      '#673AB7', // Deep Purple
    ],
    dataLabels: { enabled: false },
    fill: { opacity: 0.8 },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
    },
    legend: {
      show: true,
      position: 'right',
      offsetY: 0,
      height: 400,
      labels: {
        colors: theme.palette.text.primary,
        useSeriesColors: true,
      },
      formatter: function (seriesName: string, opts: any) {
        return fullNames[opts.seriesIndex] || seriesName;
      },
      itemMargin: {
        horizontal: 5,
        vertical: 2,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 4,
        distributed: true, // Cada barra tendrá un color diferente
      },
    },
    xaxis: {
      categories: fullNames.map((_, index) => `Item ${index + 1}`), // Etiquetas genéricas
      labels: {
        show: false, // Ocultar etiquetas del eje X
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatearQuetzales(value),
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      x: {
        formatter: (value, opts) => {
          return fullNames[opts.dataPointIndex] || '';
        },
      },
      y: {
        formatter: (value) => formatearQuetzales(value),
      },
    },
  });

  // Opciones para gráfico de dona
  const getDonutChartOptions = (labels: string[]): ApexOptions => ({
    chart: {
      background: 'transparent',
      toolbar: { show: false },
    },
    colors: [
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.primary.main,
      '#9C27B0', // Purple
      '#FF9800', // Orange
      '#607D8B', // Blue Grey
      '#795548', // Brown
    ],
    dataLabels: {
      enabled: false,
    },
    fill: { opacity: 1, type: 'solid' },
    labels: labels.map((label: string) => truncateText(label, 15)),
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      labels: {
        colors: theme.palette.text.primary,
      },
      formatter: function (seriesName: string, opts: any) {
        return labels[opts.seriesIndex];
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => formatearQuetzales(value),
      },
    },
  });

  // Opciones para gráfico de pie
  const getPieChartOptions = (labels: string[]): ApexOptions => ({
    chart: {
      background: 'transparent',
      toolbar: { show: false },
    },
    colors: [
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.primary.main,
      '#9C27B0', // Purple
      '#FF9800', // Orange
      '#607D8B', // Blue Grey
      '#795548', // Brown
    ],
    dataLabels: {
      enabled: false,
    },
    fill: { opacity: 1, type: 'solid' },
    labels: labels.map((label) => truncateText(label, 20)),
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      labels: {
        colors: theme.palette.text.primary,
      },
      formatter: function (seriesName: string, opts: any) {
        return labels[opts.seriesIndex];
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
      },
    },
    tooltip: {
      y: {
        formatter: (value) => formatearQuetzales(value),
      },
    },
  });

  // Opciones para gráfico temporal (área)
  const getAreaChartOptions = (categories: string[]): ApexOptions => ({
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: [theme.palette.error.main],
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: [theme.palette.error.light],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.1,
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
    },
    markers: {
      size: 6,
      strokeColors: theme.palette.background.paper,
      strokeWidth: 2,
      hover: { size: 8 },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '11px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatearQuetzales(value),
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => formatearQuetzales(value),
      },
    },
  });

  const datosTipoOrigen = procesarDatosPorTipoOrigen();
  const datosOrigen = procesarDatosPorOrigen();
  const datosTemporal = procesarDatosTemporal();

  const totalCostos = costos.reduce((acc, costo) => acc + Number(costo.monto || 0), 0);

  const renderFiltrosInfo = () => {
    const filtros = [];

    // Tipo de origen
    filtros.push(
      <Chip
        key="tipo_origen"
        icon={<SourceIcon />}
        label={tipoOrigenFiltrado ? `Origen: ${tipoOrigenFiltrado}` : 'Origen: Todos'}
        size="small"
        color={tipoOrigenFiltrado ? 'error' : 'default'}
        variant={tipoOrigenFiltrado ? 'outlined' : 'filled'}
      />
    );

    // Empresa
    if (empresaFiltrada) {
      filtros.push(
        <Chip
          key="empresa"
          icon={<BusinessIcon />}
          label={`Empresa: ${empresaFiltrada}`}
          size="small"
          color="error"
          variant="outlined"
        />
      );
    }

    // Proyecto
    if (proyectoFiltrado) {
      filtros.push(
        <Chip
          key="proyecto"
          icon={<AccountTreeIcon />}
          label={`Proyecto: ${truncateText(proyectoFiltrado, 25)}`}
          size="small"
          color="error"
          variant="outlined"
        />
      );
    }

    // Equipo
    if (equipoFiltrado) {
      filtros.push(
        <Chip
          key="equipo"
          icon={<CategoryIcon />}
          label={`Equipo: ${truncateText(equipoFiltrado, 25)}`}
          size="small"
          color="error"
          variant="outlined"
        />
      );
    }

    // Orden de compra
    if (ordenCompraFiltrada) {
      filtros.push(
        <Chip
          key="orden_compra"
          icon={<CategoryIcon />}
          label={`Factura: ${ordenCompraFiltrada}`}
          size="small"
          color="error"
          variant="outlined"
        />
      );
    }

    console.log('fehca inicio', fechaInicio);
    console.log('fehca fin', fechaFin);

    // Fechas - siempre mostrar
    const fechaTexto =
      fechaInicio && fechaFin && !isNaN(fechaInicio.getTime()) && !isNaN(fechaFin.getTime())
        ? `${formatearFecha(fechaInicio.toISOString())} - ${formatearFecha(fechaFin.toISOString())}`
        : fechaInicio && !isNaN(fechaInicio.getTime())
        ? `Desde: ${formatearFecha(fechaInicio.toISOString())}`
        : fechaFin && !isNaN(fechaFin.getTime())
        ? `Hasta: ${formatearFecha(fechaFin.toISOString())}`
        : 'Fechas: Sin filtro';

    filtros.push(
      <Chip
        key="fechas"
        icon={<CalendarTodayIcon />}
        label={fechaTexto}
        size="small"
        color={fechaInicio || fechaFin ? 'error' : 'default'}
        variant={fechaInicio || fechaFin ? 'outlined' : 'filled'}
      />
    );

    return filtros;
  };

  // Determinar qué gráficos mostrar basado en los filtros
  const tieneMultiplesOrigenes = datosOrigen.categories.length > 1;
  const tieneMultiplosTiposOrigen = datosTipoOrigen.labels.length > 1;
  const tieneMultiplesPeriodos = datosTemporal.categories.length > 1;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: 'auto',
          maxHeight: '85vh',
          maxWidth: {
            xs: '95vw', // Móvil: 95% del ancho
            sm: '90vw', // Tablet pequeña: 90%
            md: '85vw', // Tablet grande: 85%
            lg: '80vw', // Desktop: 80%
            xl: '75vw', // Desktop grande: 75%
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Análisis de Costos</Typography>
          <IconButton
            onClick={onClose}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 0, pb: 0, display: 'flex', flexDirection: 'column', height: '70vh' }}>
        {/* Fixed Header Section */}
        <Box sx={{ 
          position: 'sticky',
          top: 0,
          backgroundColor: 'background.paper',
          zIndex: 1,
          pb: 2,
          mb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            sx={{ mb: 2 }}
          >
            {renderFiltrosInfo()}
          </Stack>

          <Box
            sx={{
              p: 2,
              backgroundColor: 'background.default',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {costos.length} {costos.length === 1 ? 'costo encontrado' : 'costos encontrados'}
              </Typography>
              <Box textAlign="right">
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Total General
                </Typography>
                <Typography
                  variant="h6"
                  color="error"
                  fontWeight="bold"
                >
                  {formatearQuetzales(totalCostos)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Scrollable Charts Section */}
        <Box sx={{ 
          flex: 1,
          overflowY: 'auto',
          pr: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0,0,0,0.3)',
          },
        }}>
          <Grid
            container
            spacing={2}
          >
          {/* Siempre mostrar al menos una gráfica */}

          {/* Prioridad 1: Gráfico de Tipo de Origen (siempre que haya datos) */}
          {datosTipoOrigen.labels.length > 0 && (
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
            >
              <Card variant="outlined">
                <CardHeader
                  title={
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                    >
                      Distribución por Tipo de Origen
                    </Typography>
                  }
                  subtitle={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {tieneMultiplosTiposOrigen
                        ? 'Clasificación de costos'
                        : 'Vista consolidada de origen'}
                    </Typography>
                  }
                  sx={{ pb: 1 }}
                />
                <CardContent sx={{ pt: 0 }}>
                  <Chart
                    height={350}
                    options={getDonutChartOptions(datosTipoOrigen.labels)}
                    series={datosTipoOrigen.series}
                    type="donut"
                  />
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Prioridad 2: Gráfico de Orígenes específicos (solo si hay variedad y espacio) */}
          {tieneMultiplesOrigenes && datosTipoOrigen.labels.length > 0 && (
            <Grid
              item
              xs={12}
            >
              <Card variant="outlined">
                <CardHeader
                  title={
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                    >
                      {getOrigenTitle()}
                    </Typography>
                  }
                  subtitle={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Desglose por origen específico
                    </Typography>
                  }
                  sx={{ pb: 1 }}
                />
                <CardContent sx={{ pt: 0 }}>
                  <Chart
                    height={400}
                    options={getBarChartOptionsWithLegend(datosOrigen.fullNames)}
                    series={datosOrigen.series}
                    type="bar"
                  />
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Prioridad 4: Evolución temporal (si hay múltiples períodos O filtros específicos) */}
          {(tieneMultiplesPeriodos ||
            (tipoOrigenFiltrado && empresaFiltrada) ||
            (tipoOrigenFiltrado && proyectoFiltrado) ||
            (empresaFiltrada && proyectoFiltrado)) &&
            datosTemporal.categories.length > 0 && (
              <Grid
                item
                xs={12}
              >
                <Card variant="outlined">
                  <CardHeader
                    title={
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                      >
                        Evolución Temporal
                      </Typography>
                    }
                    subtitle={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {tieneMultiplesPeriodos
                          ? 'Costos mes a mes'
                          : tipoOrigenFiltrado && proyectoFiltrado
                          ? `Historial de ${proyectoFiltrado}`
                          : 'Historial consolidado'}
                      </Typography>
                    }
                    sx={{ pb: 1 }}
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Chart
                      height={300}
                      options={getAreaChartOptions(datosTemporal.categories)}
                      series={datosTemporal.series}
                      type="area"
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}

          {/* Fallback: Si no hay datos para ninguna gráfica */}
          {datosTipoOrigen.labels.length === 0 && datosOrigen.categories.length === 0 && (
            <Grid
              item
              xs={12}
            >
              <Card
                variant="outlined"
                sx={{ textAlign: 'center', py: 4 }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    gutterBottom
                  >
                    📊 Sin Datos Suficientes
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    No hay datos suficientes para generar gráficas con los filtros aplicados.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Total de costos: {formatearQuetzales(totalCostos)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
