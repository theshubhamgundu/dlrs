import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
  Pagination,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import api from '../api/api';
import { Block } from '../types';

const AdminLedger: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    try {
      const response = await api.getAllBlocks();
      setBlocks(response.data);
    } catch (error) {
      console.error('Error loading blocks:', error);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Block Index', 'Timestamp', 'Transaction ID', 'Data Hash', 'Previous Hash', 'Current Hash', 'Nonce'];
    const rows = blocks.map(block => [
      block.blockIndex,
      new Date(block.timestamp).toISOString(),
      block.transactionId,
      block.dataHash,
      block.previousHash,
      block.currentHash,
      block.nonce
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ledger.csv';
    a.click();
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(blocks, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ledger.json';
    a.click();
  };

  const truncateHash = (hash: string) => {
    if (hash.length <= 16) return hash;
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const paginatedBlocks = blocks.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Full Ledger</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportCSV}
            sx={{ mr: 2 }}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportJSON}
          >
            Export JSON
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Block Index</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Data Hash</TableCell>
              <TableCell>Previous Hash</TableCell>
              <TableCell>Current Hash</TableCell>
              <TableCell>Nonce</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBlocks.map((block) => (
              <TableRow key={block.id}>
                <TableCell>{block.blockIndex}</TableCell>
                <TableCell>{new Date(block.timestamp).toLocaleString()}</TableCell>
                <TableCell>{block.transactionId}</TableCell>
                <TableCell>
                  <Tooltip title={block.dataHash}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {truncateHash(block.dataHash)}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={block.previousHash}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {truncateHash(block.previousHash)}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={block.currentHash}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {truncateHash(block.currentHash)}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{block.nonce}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(blocks.length / itemsPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
      />
    </Box>
  );
};

export default AdminLedger;

