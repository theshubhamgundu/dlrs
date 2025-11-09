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
  Chip,
  Button,
} from '@mui/material';
import api from '../api/api';
import { Transaction } from '../types';

const TransactionRequests: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await api.getMyRequests();
      setTransactions(response.data.filter(t => t.status === 'INITIATED'));
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleAccept = async (transactionId: number) => {
    try {
      await api.acceptTransaction(transactionId);
      loadTransactions();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error accepting transaction');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Transaction Requests
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property UID</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.propertyUid}</TableCell>
                <TableCell>{transaction.buyerName}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>
                  <Chip label={transaction.status} size="small" />
                </TableCell>
                <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  {transaction.status === 'INITIATED' && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAccept(transaction.id)}
                    >
                      Accept
                    </Button>
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

export default TransactionRequests;

