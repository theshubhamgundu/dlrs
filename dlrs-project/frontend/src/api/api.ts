import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Configure axios defaults
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
axios.defaults.baseURL = API_BASE_URL;

export const api = {
  // Auth
  login: (username: string, password: string) =>
    axios.post('/auth/login', { username, password }),
  
  register: (data: any) =>
    axios.post('/auth/register', data),

  // Properties
  getProperties: (params?: any) =>
    axios.get('/properties', { params }),
  
  getPropertyByUid: (propertyUid: string) =>
    axios.get(`/properties/${propertyUid}`),
  
  createProperty: (data: any) =>
    axios.post('/properties', data),
  
  getMyProperties: () =>
    axios.get('/properties/my-properties'),
  
  updatePropertyStatus: (propertyId: number, status: string) =>
    axios.put(`/properties/${propertyId}/status`, null, { params: { status } }),

  // Documents
  uploadDocument: (propertyId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`/properties/${propertyId}/documents/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  getDocuments: (propertyId: number) =>
    axios.get(`/properties/${propertyId}/documents`),

  // Transactions
  createTransaction: (data: any) =>
    axios.post('/transactions', data),
  
  getTransaction: (id: number) =>
    axios.get(`/transactions/${id}`),
  
  getMyTransactions: () =>
    axios.get('/transactions/my-transactions'),
  
  getMyRequests: () =>
    axios.get('/transactions/my-requests'),
  
  getPendingTransactions: () =>
    axios.get('/transactions/pending'),
  
  approveTransaction: (id: number, approve: boolean) =>
    axios.post(`/transactions/${id}/approve`, null, { params: { approve } }),
  
  acceptTransaction: (id: number) =>
    axios.post(`/transactions/${id}/accept`),

  // Blocks
  getAllBlocks: () =>
    axios.get('/blocks'),
  
  getBlocksByProperty: (propertyId: number) =>
    axios.get(`/blocks/property/${propertyId}`),
  
  verifyChain: (propertyId?: number) =>
    axios.post('/blocks/verify', null, { params: propertyId ? { propertyId } : {} }),

  // Admin
  getAllUsers: () =>
    axios.get('/admin/users'),
  
  updateUserRole: (userId: number, role: string) =>
    axios.put(`/admin/users/${userId}/role`, null, { params: { role } }),
  
  deleteUser: (userId: number) =>
    axios.delete(`/admin/users/${userId}`),
};

export default api;

