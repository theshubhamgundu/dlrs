import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PropertySearch from './pages/PropertySearch';
import PropertyDetail from './pages/PropertyDetail';
import MyProperties from './pages/MyProperties';
import RegisterProperty from './pages/RegisterProperty';
import MyTransactions from './pages/MyTransactions';
import TransactionRequests from './pages/TransactionRequests';
import PendingTransfers from './pages/PendingTransfers';
import AuditTools from './pages/AuditTools';
import AdminUsers from './pages/AdminUsers';
import AdminLedger from './pages/AdminLedger';
import SystemHealth from './pages/SystemHealth';
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="properties" element={<PrivateRoute><PropertySearch /></PrivateRoute>} />
              <Route path="properties/:propertyUid" element={<PrivateRoute><PropertyDetail /></PrivateRoute>} />
              <Route path="my-properties" element={<PrivateRoute allowedRoles={['SELLER', 'ADMIN']}><MyProperties /></PrivateRoute>} />
              <Route path="register-property" element={<PrivateRoute allowedRoles={['SELLER', 'ADMIN']}><RegisterProperty /></PrivateRoute>} />
              <Route path="my-transactions" element={<PrivateRoute allowedRoles={['BUYER', 'ADMIN']}><MyTransactions /></PrivateRoute>} />
              <Route path="transaction-requests" element={<PrivateRoute allowedRoles={['SELLER', 'ADMIN']}><TransactionRequests /></PrivateRoute>} />
              <Route path="pending-transfers" element={<PrivateRoute allowedRoles={['INSPECTOR', 'ADMIN']}><PendingTransfers /></PrivateRoute>} />
              <Route path="audit-tools" element={<PrivateRoute allowedRoles={['INSPECTOR', 'ADMIN']}><AuditTools /></PrivateRoute>} />
              <Route path="admin/users" element={<PrivateRoute allowedRoles={['ADMIN']}><AdminUsers /></PrivateRoute>} />
              <Route path="admin/ledger" element={<PrivateRoute allowedRoles={['ADMIN']}><AdminLedger /></PrivateRoute>} />
              <Route path="admin/health" element={<PrivateRoute allowedRoles={['ADMIN']}><SystemHealth /></PrivateRoute>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

