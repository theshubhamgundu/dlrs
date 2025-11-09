import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Search, VerifiedUser, Security, Timeline } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Home: React.FC = () => {
  const [searchUid, setSearchUid] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (searchUid) {
      navigate(`/properties/${searchUid}`);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 4, mb: 4, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Decentralized Land Registry System
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Secure, Transparent, and Immutable Land Ownership Records
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Enter Property UID or Address"
            value={searchUid}
            onChange={(e) => setSearchUid(e.target.value)}
            sx={{ backgroundColor: 'white', minWidth: 300 }}
            onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleVerify}
            sx={{ backgroundColor: 'white', color: '#667eea', '&:hover': { backgroundColor: '#f5f5f5' } }}
          >
            Verify Property
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Security sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Blockchain Security
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Immutable ledger with SHA-256 hashing ensures data integrity and prevents tampering.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <VerifiedUser sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Role-Based Access
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Secure access control with roles: Seller, Buyer, Inspector, and Admin.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Timeline sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Complete History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track all ownership transfers with a complete audit trail and verification.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Search sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Easy Verification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verify property ownership and chain integrity with a single click.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;

