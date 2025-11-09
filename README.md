# Decentralized Land Registry System (DLRS)

A web application that simulates blockchain properties (immutability, sequential ledger, tamper detection) for land registration and transfers. The system is role-based with SELLER, BUYER, INSPECTOR, and ADMIN roles.

## Tech Stack

### Backend
- Java 17+
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security (JWT)
- MySQL 8+
- Maven
- Lombok

### Frontend
- React 18
- TypeScript
- Material UI
- Axios
- React Router

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 16+ and npm
- MySQL 8+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

## Setup Instructions

### 1. Database Setup

1. Start MySQL server
2. Create database and run schema:
   ```bash
   mysql -u root -p < backend/schema.sql
   ```
   Or manually:
   ```sql
   mysql -u root -p
   source backend/schema.sql
   ```

### 2. Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Update `application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

3. Build and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   Backend will start on `http://localhost:8080`

### 3. Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

   Frontend will start on `http://localhost:3000`

## Default Users

The schema includes seed data with the following users (password: `password123`):

- **Admin**: username: `admin`, role: ADMIN
- **Inspector**: username: `inspector`, role: INSPECTOR
- **Seller**: username: `seller1`, role: SELLER
- **Buyer**: username: `buyer1`, role: BUYER

## Demo Script

### 1. Register Users and Login
1. Open `http://localhost:3000`
2. Register a new seller and buyer (or use seeded accounts)
3. Login as seller1

### 2. Register Property
1. Navigate to "My Properties"
2. Click "Register Property"
3. Fill in property details (title, address, area, GIS coordinates)
4. Submit and note the Property UID

### 3. Upload Documents
1. Go to property details
2. Navigate to "Documents" tab
3. Upload a deed document
4. Verify file checksum is displayed

### 4. Mark Property for Sale
1. Go to "My Properties"
2. Click the "Sell" icon for the property
3. Property status changes to "FOR_SALE"

### 5. Initiate Transfer (as Buyer)
1. Login as buyer1
2. Search for properties
3. View property details
4. Click "Request Purchase"
5. Enter purchase amount

### 6. Accept Transaction (as Seller)
1. Login as seller1
2. Go to "Transaction Requests"
3. Accept the purchase request

### 7. Approve Transfer (as Inspector)
1. Login as inspector
2. Go to "Pending Transfers"
3. Review transaction details
4. Click "Approve"
5. This creates a new block in the blockchain

### 8. Verify Chain
1. Go to property details
2. Navigate to "Ledger" tab
3. Click "Verify Chain"
4. Verify chain should show as valid (green)

### 9. Simulate Tampering
1. Manually update a block's `current_hash` in the database:
   ```sql
   UPDATE blocks SET current_hash = 'tampered_hash' WHERE block_index = 0;
   ```
2. Run "Verify Chain" again
3. Verification should show tampered blocks (red)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Properties
- `GET /api/properties` - Search/list properties
- `GET /api/properties/{propertyUid}` - Get property details
- `POST /api/properties` - Create property (Seller)
- `GET /api/properties/my-properties` - Get user's properties
- `PUT /api/properties/{propertyId}/status` - Update property status
- `POST /api/properties/{propertyId}/documents/upload` - Upload document
- `GET /api/properties/{propertyId}/documents` - Get property documents

### Transactions
- `POST /api/transactions` - Create transaction (Buyer)
- `GET /api/transactions/{id}` - Get transaction details
- `GET /api/transactions/my-transactions` - Get buyer's transactions
- `GET /api/transactions/my-requests` - Get seller's transaction requests
- `GET /api/transactions/pending` - Get pending transactions (Inspector)
- `POST /api/transactions/{id}/approve` - Approve/reject transaction (Inspector)
- `POST /api/transactions/{id}/accept` - Accept transaction request (Seller)

### Blocks
- `GET /api/blocks` - Get all blocks (Admin)
- `GET /api/blocks/property/{propertyId}` - Get blocks for property
- `POST /api/blocks/verify` - Verify blockchain chain

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}/role` - Update user role
- `DELETE /api/admin/users/{id}` - Delete user

## Testing Checklist

- [x] Register seller & buyer, login as seller
- [x] Seller registers property & uploads deed
- [x] Buyer searches property & initiates transfer
- [x] Inspector approves -> new block created
- [x] Property ledger displays newly created block with correct previous_hash
- [x] Run "verify chain" -> returns OK
- [x] Manually alter a block row in DB -> verify chain returns tamper info

## Project Structure

```
dlrs-project/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/dlrs/
│   │   │   │   ├── model/          # Entity classes
│   │   │   │   ├── repository/     # JPA repositories
│   │   │   │   ├── service/        # Business logic
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── security/       # Security configuration
│   │   │   │   ├── util/           # Utility classes
│   │   │   │   └── dto/            # Data transfer objects
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                   # Test files
│   ├── schema.sql                  # Database schema
│   └── pom.xml                     # Maven configuration
└── frontend/
    ├── src/
    │   ├── components/             # React components
    │   ├── pages/                  # Page components
    │   ├── context/                # React context
    │   ├── api/                    # API service
    │   └── types/                  # TypeScript types
    ├── public/
    └── package.json
```

## Key Features

1. **Blockchain-like Properties**
   - SHA-256 hashing for blocks
   - Sequential ledger with previous hash linking
   - Tamper detection via chain verification

2. **Role-Based Access Control**
   - SELLER: Register properties, upload documents, manage sales
   - BUYER: Search properties, initiate purchases
   - INSPECTOR: Approve/reject transactions, verify chains
   - ADMIN: Manage users, view full ledger, system health

3. **Document Management**
   - File upload with checksum verification
   - Secure document storage
   - Document metadata tracking

4. **Transaction Flow**
   - Initiate → Pending → Approved/Rejected
   - Automatic block creation on approval
   - Complete audit trail

5. **Chain Verification**
   - Verify entire blockchain
   - Verify property-specific chain
   - Detect tampered blocks

## Troubleshooting

### Backend Issues
- **Port already in use**: Change `server.port` in `application.properties`
- **Database connection error**: Verify MySQL is running and credentials are correct
- **JWT errors**: Check `jwt.secret` in `application.properties`

### Frontend Issues
- **API calls failing**: Verify backend is running on port 8080
- **CORS errors**: Check `cors.allowed-origins` in backend security config
- **Authentication issues**: Clear localStorage and login again

## License

This project is for educational purposes.

## Contributors

- Developed as part of DLRS project

## Future Enhancements

- Docker containerization
- Unit and integration tests
- File storage migration to S3
- Real-time notifications
- Advanced search and filtering
- Mobile responsive improvements
- Enhanced security features

