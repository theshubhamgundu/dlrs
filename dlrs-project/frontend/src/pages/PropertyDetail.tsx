import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Tooltip,
} from '@mui/material';
import { VerifiedUser, Download } from '@mui/icons-material';
import api from '../api/api';
import { Property, Block, Document, ChainVerificationResponse } from '../types';
import { useAuth } from '../context/AuthContext';

const PropertyDetail: React.FC = () => {
  const { propertyUid } = useParams<{ propertyUid: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [verificationResult, setVerificationResult] = useState<ChainVerificationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockDialog, setBlockDialog] = useState<Block | null>(null);

  useEffect(() => {
    loadProperty();
  }, [propertyUid]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const propResponse = await api.getPropertyByUid(propertyUid!);
      setProperty(propResponse.data);

      const blocksResponse = await api.getBlocksByProperty(propResponse.data.id);
      setBlocks(blocksResponse.data);

      const docsResponse = await api.getDocuments(propResponse.data.id);
      setDocuments(docsResponse.data);
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyChain = async () => {
    try {
      const response = await api.verifyChain(property?.id);
      setVerificationResult(response.data);
    } catch (error) {
      console.error('Error verifying chain:', error);
    }
  };

  const handleRequestPurchase = async () => {
    const amount = prompt('Enter purchase amount:');
    if (amount) {
      try {
        await api.createTransaction({
          propertyId: property!.id,
          amount: parseFloat(amount),
        });
        alert('Purchase request created successfully');
        navigate('/my-transactions');
      } catch (error: any) {
        alert(error.response?.data?.error || 'Error creating purchase request');
      }
    }
  };

  const truncateHash = (hash: string) => {
    if (hash.length <= 16) return hash;
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!property) {
    return <Alert severity="error">Property not found</Alert>;
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {property.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          UID: {property.propertyUid}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Address: {property.address}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Area: {property.area} sq ft
        </Typography>
        <Typography variant="body1" gutterBottom>
          Owner: {property.ownerName} ({property.ownerEmail})
        </Typography>
        <Chip
          label={property.status}
          color={property.status === 'FOR_SALE' ? 'success' : 'default'}
          sx={{ mt: 1 }}
        />
        {property.status === 'FOR_SALE' && user?.role === 'BUYER' && (
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2, mt: 1 }}
            onClick={handleRequestPurchase}
          >
            Request Purchase
          </Button>
        )}
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Details" />
          <Tab label="Documents" />
          <Tab label="Ledger" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Property Details
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>GIS Coordinates:</strong> {property.gisCoordinates || 'N/A'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Created At:</strong> {new Date(property.createdAt).toLocaleString()}
            </Typography>
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Documents
            </Typography>
            {documents.length === 0 ? (
              <Typography>No documents available</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>File Name</TableCell>
                      <TableCell>Checksum</TableCell>
                      <TableCell>Uploaded By</TableCell>
                      <TableCell>Uploaded At</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.fileName}</TableCell>
                        <TableCell>
                          <Tooltip title={doc.fileChecksum}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {truncateHash(doc.fileChecksum)}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{doc.uploadedByName}</TableCell>
                        <TableCell>{new Date(doc.uploadedAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<Download />}
                            onClick={() => window.open(`http://localhost:8080${doc.filePath}`, '_blank')}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Block Ledger
              </Typography>
              <Button
                variant="contained"
                startIcon={<VerifiedUser />}
                onClick={handleVerifyChain}
              >
                Verify Chain
              </Button>
            </Box>

            {verificationResult && (
              <Alert
                severity={verificationResult.isValid ? 'success' : 'error'}
                sx={{ mb: 2 }}
              >
                {verificationResult.message}
              </Alert>
            )}

            {blocks.length === 0 ? (
              <Typography>No blocks found for this property</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Previous Hash</TableCell>
                      <TableCell>Current Hash</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {blocks.map((block) => (
                      <TableRow key={block.id}>
                        <TableCell>{block.blockIndex}</TableCell>
                        <TableCell>{new Date(block.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{block.transactionId}</TableCell>
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
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => setBlockDialog(block)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Paper>

      <Dialog open={!!blockDialog} onClose={() => setBlockDialog(null)} maxWidth="md" fullWidth>
        <DialogTitle>Block Details</DialogTitle>
        <DialogContent>
          {blockDialog && (
            <>
              <DialogContentText>
                <strong>Block Index:</strong> {blockDialog.blockIndex}
              </DialogContentText>
              <DialogContentText>
                <strong>Timestamp:</strong> {new Date(blockDialog.timestamp).toLocaleString()}
              </DialogContentText>
              <DialogContentText>
                <strong>Transaction ID:</strong> {blockDialog.transactionId}
              </DialogContentText>
              <DialogContentText>
                <strong>Data Hash:</strong> {blockDialog.dataHash}
              </DialogContentText>
              <DialogContentText>
                <strong>Previous Hash:</strong> {blockDialog.previousHash}
              </DialogContentText>
              <DialogContentText>
                <strong>Current Hash:</strong> {blockDialog.currentHash}
              </DialogContentText>
              <DialogContentText>
                <strong>Nonce:</strong> {blockDialog.nonce}
              </DialogContentText>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PropertyDetail;

