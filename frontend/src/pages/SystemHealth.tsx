import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import { Business, SwapHoriz, VerifiedUser, AccessTime } from '@mui/icons-material';
import api from '../api/api';

const SystemHealth: React.FC = () => {
  const [stats, setStats] = useState({
    propertyCount: 0,
    pendingTransactions: 0,
    lastVerification: null as string | null,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [propertiesResponse, transactionsResponse] = await Promise.all([
        api.getProperties(),
        api.getPendingTransactions(),
      ]);

      setStats({
        propertyCount: propertiesResponse.data.length,
        pendingTransactions: transactionsResponse.data.length,
        lastVerification: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Health
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Business sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4">{stats.propertyCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Properties
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <SwapHoriz sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
              <Typography variant="h4">{stats.pendingTransactions}</Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <AccessTime sx={{ fontSize: 40, color: 'info.main', mb: 2 }} />
              <Typography variant="h6">
                {stats.lastVerification
                  ? new Date(stats.lastVerification).toLocaleString()
                  : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Verification
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemHealth;

