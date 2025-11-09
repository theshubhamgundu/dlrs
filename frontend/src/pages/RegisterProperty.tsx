import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import api from '../api/api';

const RegisterProperty: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    area: '',
    gisCoordinates: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.createProperty({
        ...formData,
        area: parseFloat(formData.area),
      });
      setSuccess(`Property registered successfully! UID: ${response.data.propertyUid}`);
      setTimeout(() => {
        navigate('/my-properties');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error registering property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Register Property
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Address"
            margin="normal"
            multiline
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Area (sq ft)"
            type="number"
            margin="normal"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="GIS Coordinates"
            margin="normal"
            placeholder="e.g., 28.6139,77.2090"
            value={formData.gisCoordinates}
            onChange={(e) => setFormData({ ...formData, gisCoordinates: e.target.value })}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register Property'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterProperty;

