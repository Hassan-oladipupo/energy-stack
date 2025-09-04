# EnergyStack Storefront

A modern, full-stack e-commerce platform for solar equipment with integrated financing solutions. Built with React, Node.js, PostgreSQL, and TypeScript.

##  Features

### Frontend
- **Product Catalog**: Browse solar panels, inverters, batteries, and accessories
- **Advanced Filtering**: Search by name, filter by category and price range
- **Responsive Design**: Mobile-first design that works on all devices
- **Shopping Cart**: Add, update, and remove items with real-time updates
- **Checkout Flow**: Complete order processing with simulated payment
- **Order Management**: View order confirmation and details

### Backend
- **REST API**: Comprehensive API with OpenAPI documentation
- **Database**: PostgreSQL with Sequelize ORM for data persistence
- **Input Validation**: Robust validation on all endpoints
- **Error Handling**: Consistent error responses and logging
- **Rate Limiting**: Protection against abuse with configurable limits
- **CORS Support**: Secure cross-origin resource sharing

##  Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Development**: Vite, Docker Compose, Jest
- **Deployment**: Docker, Vercel-ready configuration

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)

##  Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd energy-stack
   \`\`\`

2. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Start with Docker Compose**
   \`\`\`bash
   docker-compose up --build
   \`\`\`

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api/docs

### Local Development Setup

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Database Setup**
   \`\`\`bash
   # Start PostgreSQL (using Docker)
   docker run --name energystack-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=energystack -p 5432:5432 -d postgres:15
   
   # Run migrations and seed data
   npm run db:migrate
   npm run db:seed
   \`\`\`

3. **Start development servers**
   \`\`\`bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run server:dev  # Backend only
   npm run client:dev  # Frontend only
   \`\`\`

##  Database Schema

### Products
- `id` (Primary Key)
- `name` (String, required)
- `description` (Text, required)
- `price` (Decimal, required)
- `category` (Enum: solar-panels, inverters, batteries, accessories)
- `stock` (Integer, required)
- `images` (Array of strings)

### Carts
- `id` (Primary Key)
- `sessionId` (String, unique)

### Cart Items
- `id` (Primary Key)
- `cartId` (Foreign Key to Carts)
- `productId` (Foreign Key to Products)
- `quantity` (Integer, min: 1)

### Orders
- `id` (Primary Key)
- `sessionId` (String)
- `status` (Enum: pending, placed, shipped, delivered)
- `subtotal` (Decimal)
- `tax` (Decimal)
- `total` (Decimal)

### Order Items
- `id` (Primary Key)
- `orderId` (Foreign Key to Orders)
- `productId` (Foreign Key to Products)
- `quantity` (Integer)
- `price` (Decimal, snapshot of product price)

##🔌 API Endpoints

### Products
- `GET /api/products` - List products with pagination and filtering
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart/:sessionId` - Get cart by session ID
- `POST /api/cart/:sessionId` - Add item to cart
- `PUT /api/cart/:sessionId/items/:itemId` - Update cart item quantity
- `DELETE /api/cart/:sessionId/items/:itemId` - Remove item from cart

### Orders
- `POST /api/orders` - Create order from cart
- `GET /api/orders/:id` - Get order by ID

### Documentation
- `GET /api/docs` - OpenAPI documentation
- `GET /health` - Health check endpoint

##  Testing

### Run Tests
\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
\`\`\`

### Test Structure
- **Unit Tests**: Core business logic and utilities
- **Integration Tests**: API endpoints and database operations
- **Component Tests**: React component functionality

##  Environment Variables

Create a `.env` file based on `.env.example`:

\`\`\`env
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/energystack

# Redis (for rate limiting)
REDIS_URL=redis://localhost:6379

# Tax rate (as decimal, e.g., 0.08 for 8%)
TAX_RATE=0.08

# CORS origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
\`\`\`

##  Deployment

### Docker Production Build
\`\`\`bash
# Build production image
docker build -t energystack-storefront .

# Run production container
docker run -p 3001:3001 --env-file .env energystack-storefront
\`\`\`

### Vercel Deployment
The project is configured for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

##  Project Structure

\`\`\`
src/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Cart, etc.)
│   │   ├── pages/          # Route components
│   │   ├── services/       # API client services
│   │   ├── types/          # TypeScript type definitions
│   └── index.html
      └── maintsx
├── server/                 # Node.js backend
│   ├── models/             # Sequelize database models
│   ├── routes/             # Express route handlers
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── __tests__/          # Test files
│   └── index.ts            # Server entry point
└── shared/                 # Shared types and utilities
\`\`\`

##  Development Scripts

\`\`\`bash
npm run dev              # Start both frontend and backend
npm run build            # Build for production
npm run start            # Start production server
npm run test             # Run tests
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data
\`\`\`

## Known Trade-offs & Future Improvements

### Current Limitations
1. **Session Management**: Uses localStorage for session persistence (not suitable for production)
2. **Payment Processing**: Simulated only - no real payment gateway integration
3. **Authentication**: No user authentication system implemented
4. **Image Storage**: Uses placeholder images - needs proper image upload/storage
5. **Inventory Management**: Basic stock tracking without reservation during checkout

### Recommended Improvements
1. **Authentication & Authorization**
   - Implement JWT-based authentication
   - Add user registration and login
   - Role-based access control for admin functions

2. **Payment Integration**
   - Integrate with Stripe, PayPal, or similar payment processor
   - Add support for multiple payment methods
   - Implement proper payment security measures

3. **Enhanced Features**
   - Product reviews and ratings system
   - Wishlist functionality
   - Order tracking and notifications
   - Inventory reservation during checkout
   - Advanced search with filters (brand, ratings, etc.)

4. **Performance Optimizations**
   - Image optimization and CDN integration
   - Database query optimization and caching
   - Frontend code splitting and lazy loading
   - API response caching with Redis

5. **Monitoring & Analytics**
   - Error tracking (Sentry)
   - Performance monitoring (New Relic)
   - User analytics (Google Analytics)
   - Business metrics dashboard

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

---

**Live Demo**: [Deployed URL will be here]
**API Documentation**: [API Docs URL will be here]
**Wireframes**: [Wireframe Link will be here]
