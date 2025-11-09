import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { VerifiedUser } from '@mui/icons-material';
import api from '../api/api';
import { ChainVerificationResponse } from '../types';

const AuditTools: React.FC = () => {
  const [verificationResult, setVerificationResult] = useState<ChainVerificationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyAllChains = async () => {
    setLoading(true);
    try {
      const response = await api.verifyChain();
      setVerificationResult(response.data);
    } catch (error) {
      console.error('Error verifying chains:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Audit & Verification Tools
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<VerifiedUser />}
          onClick={handleVerifyAllChains}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Verify All Chains'}
        </Button>
      </Paper>

      {verificationResult && (
        <Paper sx={{ p: 3 }}>
          <Alert
            severity={verificationResult.isValid ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {verificationResult.message}
          </Alert>

          {verificationResult.tamperedBlocks.length > 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Block Index</TableCell>
                    <TableCell>Issue</TableCell>
                    <TableCell>Expected Hash</TableCell>
                    <TableCell>Actual Hash</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {verificationResult.tamperedBlocks.map((block, index) => (
                    <TableRow key={index}>
                      <TableCell>{block.blockIndex}</TableCell>
                      <TableCell>{block.issue}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {block.expectedHash.substring(0, 16)}...
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {block.actualHash.substring(0, 16)}...
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AuditTools;

