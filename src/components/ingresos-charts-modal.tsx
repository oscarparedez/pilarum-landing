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
import type { ApexOptions } from 'apexcharts';
import { useTheme } from '@mui/material/styles';
import { Chart } from 'src/components/chart';
import { IngresoGeneral } from 'src/api/types';
import { formatearQuetzales } from 'src/utils/format-currency';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';
import { formatearFecha } from 'src/utils/format-date';

interface IngresosChartsModalProps {
  open: boolean;
  onClose: () => void;
  ingresos: IngresoGeneral[];
  proyectoFiltrado?: string;
  socioFiltrado?: string;
  tipoIngresoFiltrado?: string;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
}

export const IngresosChartsModal: React.FC<IngresosChartsModalProps> = ({
  open,
  onClose,
  ingresos,
  proyectoFiltrado,
  socioFiltrado,
  tipoIngresoFiltrado,
  fechaInicio,
  fechaFin,
}) => {
  const theme = useTheme();
  const router = useRouter();

  // Función para truncar texto
  const truncateText = (text: string, maxLength: number = 20): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Procesar datos para gráficos
  const procesarDatosPorProyecto = () => {
    const proyectosMap = new Map();
    const proyectosInfo = new Map(); // Para guardar info adicional
    
    ingresos.forEach(ingreso => {
      const nombreProyecto = ingreso.proyecto?.nombre || 'Sin proyecto';
      const monto = Number(ingreso.monto_total || 0);
      
      if (proyectosMap.has(nombreProyecto)) {
        proyectosMap.set(nombreProyecto, proyectosMap.get(nombreProyecto) + monto);
      } else {
        proyectosMap.set(nombreProyecto, monto);
      }
      
      // Guardar info del proyecto para navegación
      if (ingreso.proyecto && !proyectosInfo.has(nombreProyecto)) {
        proyectosInfo.set(nombreProyecto, {
          id: ingreso.proyecto.id,
          nombre: nombreProyecto
        });
      }
    });

    const proyectos = Array.from(proyectosMap.entries())
      .sort((a, b) => b[1] - a[1]) // Ordenar por monto descendente
      .slice(0, 10); // Solo top 10

    return {
      categories: proyectos.map(([nombre]) => truncateText(nombre)),
      fullNames: proyectos.map(([nombre]) => nombre), // Nombres completos para tooltip
      projectsInfo: proyectos.map(([nombre]) => proyectosInfo.get(nombre)), // Info para navegación
      series: [{
        name: 'Ingresos',
        data: proyectos.map(([, monto]) => monto)
      }]
    };
  };

  const procesarDatosPorSocio = () => {
    const sociosMap = new Map();
    
    ingresos.forEach(ingreso => {
      const nombreSocio = ingreso.proyecto?.socio_asignado?.nombre || 'Sin socio';
      const monto = Number(ingreso.monto_total || 0);
      
      if (sociosMap.has(nombreSocio)) {
        sociosMap.set(nombreSocio, sociosMap.get(nombreSocio) + monto);
      } else {
        sociosMap.set(nombreSocio, monto);
      }
    });

    const socios = Array.from(sociosMap.entries())
      .sort((a, b) => b[1] - a[1]);

    return {
      labels: socios.map(([nombre]) => nombre),
      series: socios.map(([, monto]) => monto)
    };
  };

  const procesarDatosPorTipoIngreso = () => {
    const tiposMap = new Map();
    
    ingresos.forEach(ingreso => {
      const tipoIngreso = ingreso.tipo_ingreso?.nombre || 'Sin tipo';
      const monto = Number(ingreso.monto_total || 0);
      
      if (tiposMap.has(tipoIngreso)) {
        tiposMap.set(tipoIngreso, tiposMap.get(tipoIngreso) + monto);
      } else {
        tiposMap.set(tipoIngreso, monto);
      }
    });

    const tipos = Array.from(tiposMap.entries())
      .sort((a, b) => b[1] - a[1]);

    return {
      labels: tipos.map(([nombre]) => nombre),
      series: tipos.map(([, monto]) => monto)
    };
  };

  const procesarDatosTemporal = () => {
    const mesesMap = new Map();
    
    ingresos.forEach(ingreso => {
      const fecha = new Date(ingreso.fecha_ingreso);
      const mesAnio = format(fecha, 'MMM yyyy', { locale: es });
      const monto = Number(ingreso.monto_total || 0);
      
      if (mesesMap.has(mesAnio)) {
        mesesMap.set(mesAnio, mesesMap.get(mesAnio) + monto);
      } else {
        mesesMap.set(mesAnio, monto);
      }
    });

    // Ordenar por fecha
    const mesesOrdenados = Array.from(mesesMap.entries())
      .sort((a, b) => {
        const fechaA = new Date(a[0]);
        const fechaB = new Date(b[0]);
        return fechaA.getTime() - fechaB.getTime();
      });

    return {
      categories: mesesOrdenados.map(([mes]) => mes),
      series: [{
        name: 'Ingresos',
        data: mesesOrdenados.map(([, monto]) => monto)
      }]
    };
  };

  // Opciones para gráfico de barras (por proyecto)
  const useBarChartOptions = (categories: string[], fullNames: string[], projectsInfo: any[]): ApexOptions => ({
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      events: {
        legendClick: function(chartContext: any, seriesIndex: number) {
          const projectInfo = projectsInfo[seriesIndex];
          if (projectInfo && projectInfo.id) {
            // Navegar al detalle del proyecto
            router.push(paths.dashboard.proyectos.detalle(projectInfo.id));
            onClose(); // Cerrar el modal
          }
        }
      }
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main, 
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main,
      '#9C27B0', // Purple
      '#FF9800', // Orange  
      '#607D8B', // Blue Grey
      '#795548', // Brown
    ],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      labels: {
        colors: theme.palette.text.primary,
      },
      markers: {
        width: 12,
        height: 12,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        distributed: true, // Cada barra un color diferente
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

  // Opciones para gráfico de dona (por socio)
  const useDonutChartOptions = (labels: string[]): ApexOptions => ({
    chart: {
      background: 'transparent',
      toolbar: { show: false },
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main,
      '#9C27B0', // Purple
      '#FF9800', // Orange  
      '#607D8B', // Blue Grey
      '#795548', // Brown
    ],
    dataLabels: { 
      enabled: false, // Quitar los porcentajes
    },
    fill: { opacity: 1, type: 'solid' },
    labels: labels.map(label => truncateText(label, 15)), // Truncar también las etiquetas
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      labels: {
        colors: theme.palette.text.primary,
      },
      formatter: function(seriesName: string, opts: any) {
        // Mostrar nombre completo en la leyenda
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

  // Opciones para gráfico de pie (por tipo de ingreso)
  const usePieChartOptions = (labels: string[]): ApexOptions => ({
    chart: {
      background: 'transparent',
      toolbar: { show: false },
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main,
      '#9C27B0', // Purple
      '#FF9800', // Orange  
      '#607D8B', // Blue Grey
      '#795548', // Brown
    ],
    dataLabels: { 
      enabled: false, // Quitar los porcentajes
    },
    fill: { opacity: 1, type: 'solid' },
    labels: labels.map(label => truncateText(label, 20)),
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      labels: {
        colors: theme.palette.text.primary,
      },
      formatter: function(seriesName: string, opts: any) {
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

  // Opciones para gráfico temporal (línea)
  const useLineChartOptions = (categories: string[]): ApexOptions => ({
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: [theme.palette.primary.main],
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: [theme.palette.primary.light],
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

  const datosProyecto = procesarDatosPorProyecto();
  const datosSocio = procesarDatosPorSocio();
  const datosTipoIngreso = procesarDatosPorTipoIngreso();
  const datosTemporal = procesarDatosTemporal();
  
  const totalIngresos = ingresos.reduce((acc, ing) => acc + Number(ing.monto_total || 0), 0);

  const renderFiltrosInfo = () => {
    const filtros = [];
    
    // Socio - siempre mostrar
    filtros.push(
      <Chip
        key="socio"
        icon={<BusinessIcon />}
        label={socioFiltrado ? `Socio: ${socioFiltrado}` : 'Socio: Todos'}
        size="small"
        color={socioFiltrado ? "primary" : "default"}
        variant={socioFiltrado ? "outlined" : "filled"}
      />
    );
    
    // Proyecto - siempre mostrar
    filtros.push(
      <Chip
        key="proyecto"
        icon={<AccountTreeIcon />}
        label={proyectoFiltrado ? `Proyecto: ${truncateText(proyectoFiltrado, 25)}` : 'Proyecto: Todos'}
        size="small"
        color={proyectoFiltrado ? "secondary" : "default"}
        variant={proyectoFiltrado ? "outlined" : "filled"}
      />
    );

    // Tipo de ingreso - siempre mostrar
    filtros.push(
      <Chip
        key="tipo-ingreso"
        icon={<CategoryIcon />}
        label={tipoIngresoFiltrado ? `Tipo de ingreso: ${tipoIngresoFiltrado}` : 'Tipo de ingreso: Todos'}
        size="small"
        color={tipoIngresoFiltrado ? "success" : "default"}
        variant={tipoIngresoFiltrado ? "outlined" : "filled"}
      />
    );
    
    // Fechas - siempre mostrar
    if (fechaInicio && fechaFin) {
      filtros.push(
        <Chip
          key="fechas"
          icon={<CalendarTodayIcon />}
          label={`${formatearFecha(fechaInicio)} - ${formatearFecha(fechaFin)}`}
          size="small"
          color="info"
          variant="outlined"
        />
      );
    } else if (fechaInicio) {
      filtros.push(
        <Chip
          key="fecha-inicio"
          icon={<CalendarTodayIcon />}
          label={`Desde: ${formatearFecha(fechaInicio)}`}
          size="small"
          color="info"
          variant="outlined"
        />
      );
    } else if (fechaFin) {
      filtros.push(
        <Chip
          key="fecha-fin"
          icon={<CalendarTodayIcon />}
          label={`Hasta: ${formatearFecha(fechaFin)}`}
          size="small"
          color="info"
          variant="outlined"
        />
      );
    } else {
      filtros.push(
        <Chip
          key="fechas-todas"
          icon={<CalendarTodayIcon />}
          label="Fechas: Sin filtro"
          size="small"
          color="default"
          variant="filled"
        />
      );
    }

    return filtros;
  };

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
            xs: '95vw',     // Móvil: 95% del ancho
            sm: '90vw',     // Tablet pequeña: 90%
            md: '85vw',     // Tablet grande: 85%
            lg: '80vw',     // Desktop: 80%
            xl: '75vw'      // Desktop grande: 75%
          }
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Análisis de Ingresos</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 0 }}>
        {/* Información de filtros y resumen */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
            {renderFiltrosInfo()}
          </Stack>
          
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: 'background.default', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {ingresos.length} {ingresos.length === 1 ? 'ingreso encontrado' : 'ingresos encontrados'}
              </Typography>
              <Box textAlign="right">
                <Typography variant="caption" color="text.secondary" display="block">
                  Total General
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {formatearQuetzales(totalIngresos)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {/* Gráficos para filtro específico: Socio + Proyecto */}
          {socioFiltrado && proyectoFiltrado && (
            <>
              {/* Gráfico de Tipos de Ingreso */}
              {datosTipoIngreso.labels.length > 0 && (
                <Grid item xs={12} sm={12} md={datosTemporal.categories.length > 1 ? 6 : 12}>
                  <Card variant="outlined">
                    <CardHeader 
                      title={
                        <Typography variant="subtitle1" fontWeight={600}>
                          Distribución por Tipo de Ingreso
                        </Typography>
                      }
                      subtitle={
                        <Typography variant="body2" color="text.secondary">
                          {truncateText(proyectoFiltrado, 30)} - {truncateText(socioFiltrado, 30)}
                        </Typography>
                      }
                      sx={{ pb: 1 }}
                    />
                    <CardContent sx={{ pt: 0 }}>
                      <Chart
                        height={350}
                        options={usePieChartOptions(datosTipoIngreso.labels)}
                        series={datosTipoIngreso.series}
                        type="pie"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Gráfico Temporal */}
              {datosTemporal.categories.length > 1 && (
                <Grid item xs={12} sm={12} md={datosTipoIngreso.labels.length > 0 ? 6 : 12}>
                  <Card variant="outlined">
                    <CardHeader 
                      title={
                        <Typography variant="subtitle1" fontWeight={600}>
                          Evolución Temporal
                        </Typography>
                      }
                      subtitle={
                        <Typography variant="body2" color="text.secondary">
                          Ingresos mes a mes
                        </Typography>
                      }
                      sx={{ pb: 1 }}
                    />
                    <CardContent sx={{ pt: 0 }}>
                      <Chart
                        height={350}
                        options={useLineChartOptions(datosTemporal.categories)}
                        series={datosTemporal.series}
                        type="area"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}              {/* Mensaje si solo hay datos de un período */}
              {datosTemporal.categories.length <= 1 && datosTipoIngreso.labels.length === 0 && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ textAlign: 'center', py: 4 }}>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        📊 Análisis Específico
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        No hay datos suficientes para mostrar gráficos detallados.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Total de ingresos: {formatearQuetzales(totalIngresos)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </>
          )}

          {/* Gráficos para otros casos (sin filtros específicos) */}
          {!(socioFiltrado && proyectoFiltrado) && (
            <>
              {/* Gráfico de Barras por Proyecto */}
              {datosProyecto.categories.length > 1 && (
                <Grid item xs={12} sm={12} md={datosProyecto.categories.length > 1 && datosSocio.labels.length >= 1 && !socioFiltrado ? 6 : 12}>
                  <Card variant="outlined">
                    <CardHeader 
                      title={
                        <Typography variant="subtitle1" fontWeight={600}>
                          {socioFiltrado ? `Proyectos de ${truncateText(socioFiltrado, 20)}` : "Ingresos por Proyecto"}
                        </Typography>
                      }
                      sx={{ pb: 1 }}
                    />
                    <CardContent sx={{ pt: 0 }}>
                      <Chart
                        height={350}
                        options={useBarChartOptions(datosProyecto.categories, datosProyecto.fullNames, datosProyecto.projectsInfo)}
                        series={datosProyecto.series}
                        type="bar"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Gráfico de Dona por Socio - mostrar cuando NO hay filtro de socio */}
              {!socioFiltrado && datosSocio.labels.length >= 1 && (
                <Grid item xs={12} sm={12} md={datosProyecto.categories.length > 1 ? 6 : 12}>
                  <Card variant="outlined">
                    <CardHeader 
                      title={
                        <Typography variant="subtitle1" fontWeight={600}>
                          Distribución por Socio
                        </Typography>
                      }
                      sx={{ pb: 1 }}
                    />
                    <CardContent sx={{ pt: 0 }}>
                      <Chart
                        height={350}
                        options={useDonutChartOptions(datosSocio.labels)}
                        series={datosSocio.series}
                        type="donut"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Mensaje informativo para casos generales */}
              {datosProyecto.categories.length <= 1 && (socioFiltrado || datosSocio.labels.length <= 1) && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ textAlign: 'center', py: 4 }}>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        📊 Vista Simplificada
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {datosProyecto.categories.length <= 1 
                          ? "Solo hay un proyecto en los resultados filtrados."
                          : "Los filtros aplicados muestran datos de un solo socio."
                        }
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Intenta ajustar los filtros para ver comparaciones entre múltiples proyectos o socios.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
