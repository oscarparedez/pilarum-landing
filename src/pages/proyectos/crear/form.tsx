import type { FC } from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';

export const CrearProyectoForm: FC = () => {
  const router = useRouter();

  const [values, setValues] = useState({
    nombre: '',
    ubicacion: '',
    fechaInicio: '',
    fechaFin: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Proyecto creado:', values);
    router.push(paths.dashboard.proyectos.index);
  };

  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Nombre del proyecto"
              name="nombre"
              value={values.nombre}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Ubicación"
              name="ubicacion"
              value={values.ubicacion}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Fecha de inicio"
              name="fechaInicio"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={values.fechaInicio}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha estimada de finalización"
              name="fechaFin"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={values.fechaFin}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Button type="submit" variant="contained">
            Guardar proyecto
          </Button>
        </Box>
      </form>
    </Box>
  );
};
