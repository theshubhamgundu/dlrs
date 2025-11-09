import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Paper,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import api from '../api/api';
import { Property } from '../types';

const PropertySearch: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchParams, setSearchParams] = useState({
    propertyUid: '',
    address: '',
    ownerName: '',
    minArea: '',
    maxArea: '',
  });
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const params: any = {};
      if (searchParams.propertyUid) params.propertyUid = searchParams.propertyUid;
      if (searchParams.address) params.address = searchParams.address;
      if (searchParams.ownerName) params.ownerName = searchParams.ownerName;
      if (searchParams.minArea) params.minArea = parseFloat(searchParams.minArea);
      if (searchParams.maxArea) params.maxArea = parseFloat(searchParams.maxArea);

      const response = await api.getProperties(params);
      setProperties(response.data);
    } catch (error) {
      console.error('Error searching properties:', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FOR_SALE':
        return 'success';
      case 'PENDING_TRANSFER':
        return 'warning';
      case 'TRANSFERRED':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Property Search
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Property UID"
              value={searchParams.propertyUid}
              onChange={(e) => setSearchParams({ ...searchParams, propertyUid: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Address"
              value={searchParams.address}
              onChange={(e) => setSearchParams({ ...searchParams, address: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Min Area"
              type="number"
              value={searchParams.minArea}
              onChange={(e) => setSearchParams({ ...searchParams, minArea: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Max Area"
              type="number"
              value={searchParams.maxArea}
              onChange={(e) => setSearchParams({ ...searchParams, maxArea: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              sx={{ height: '56px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} md={6} key={property.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {property.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  UID: {property.propertyUid}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {property.address}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Area: {property.area} sq ft
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Owner: {property.ownerName} ({property.ownerEmail})
                </Typography>
                <Chip
                  label={property.status}
                  color={getStatusColor(property.status)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/properties/${property.propertyUid}`)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PropertySearch;

