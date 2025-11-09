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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import api from '../api/api';
import { Transaction } from '../types';

const PendingTransfers: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await api.getPendingTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleApprove = async (transactionId: number, approve: boolean) => {
    try {
      await api.approveTransaction(transactionId, approve);
      loadTransactions();
      setDialogOpen(false);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error processing transaction');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Pending Transfers
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property UID</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Seller</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.propertyUid}</TableCell>
                <TableCell>{transaction.buyerName}</TableCell>
                <TableCell>{transaction.sellerName}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>
                  <Chip label={transaction.status} color="warning" size="small" />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ mr: 1 }}
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setDialogOpen(true);
                    }}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Transaction Review</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <>
              <Typography><strong>Property UID:</strong> {selectedTransaction.propertyUid}</Typography>
              <Typography><strong>Property Title:</strong> {selectedTransaction.propertyTitle}</Typography>
              <Typography><strong>Buyer:</strong> {selectedTransaction.buyerName}</Typography>
              <Typography><strong>Seller:</strong> {selectedTransaction.sellerName}</Typography>
              <Typography><strong>Amount:</strong> ${selectedTransaction.amount}</Typography>
              <Typography><strong>Created At:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => selectedTransaction && handleApprove(selectedTransaction.id, false)}
            color="error"
          >
            Reject
          </Button>
          <Button
            onClick={() => selectedTransaction && handleApprove(selectedTransaction.id, true)}
            color="primary"
            variant="contained"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingTransfers;

