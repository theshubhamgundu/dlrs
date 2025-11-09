import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import { Add, Edit, CloudUpload, Sell } from '@mui/icons-material';
import api from '../api/api';
import { Property } from '../types';

const MyProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await api.getMyProperties();
      setProperties(response.data);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const handleUpdateStatus = async (propertyId: number, status: string) => {
    try {
      await api.updatePropertyStatus(propertyId, status);
      loadProperties();
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Properties</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/register-property')}
        >
          Register Property
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>UID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>{property.propertyUid}</TableCell>
                <TableCell>{property.title}</TableCell>
                <TableCell>{property.address}</TableCell>
                <TableCell>{property.area} sq ft</TableCell>
                <TableCell>
                  <Chip label={property.status} size="small" />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/properties/${property.propertyUid}`)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/properties/${property.propertyUid}`)}
                  >
                    <CloudUpload />
                  </IconButton>
                  {property.status === 'REGISTERED' && (
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateStatus(property.id, 'FOR_SALE')}
                    >
                      <Sell />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyProperties;

