import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Container, TextField, Typography } from '@mui/material';
import './App.css';

const API_KEY = '4490f3b5fd564a37ac8143640232405';
const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&aqi=no`;

const App = () => {
  const [ciudad, setCiudad] = useState('');
  const [datosClima, setDatosClima] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const obtenerDatosClima = async () => {
      try {
        if (!ciudad.trim()) {
          setDatosClima(null);
          return;
        }

        setCargando(true);

        const respuesta = await fetch(`${API_WEATHER}&q=${encodeURIComponent(ciudad)}`);
        const datos = await respuesta.json();

        if (datos.error) {
          throw new Error(datos.error.message);
        }

        setDatosClima(datos);
      } catch (error) {
        setError(error.message);
        setDatosClima(null);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosClima();
  }, [ciudad]);

  const handleChangeCiudad = (event) => {
    setCiudad(event.target.value);
  };

  return (
    <Container maxWidth="sm" className="container">
      <Typography variant="h4" align="center" gutterBottom>
        Aplicación del Clima
      </Typography>

      <Box className="input-container">
        <TextField
          id="ciudad"
          label="Ciudad"
          variant="outlined"
          size="small"
          value={ciudad}
          onChange={handleChangeCiudad}
        />
      </Box>

      {cargando && <Typography variant="body1" align="center" className="loading">Cargando...</Typography>}

     

      {datosClima && (
        <Card className="card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {datosClima.location.name}, {datosClima.location.country}
            </Typography>
            <Typography variant="body1" className="temperature">
              Temperatura: {datosClima.current.temp_c} °C
            </Typography>
            <Typography variant="body1" className="condition">
              Condición: {datosClima.current.condition.text}
            </Typography>
            <Box className="icon-container">
              <img
                src={datosClima.current.condition.icon}
                alt="Clima"
                className="icon"
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default App;
