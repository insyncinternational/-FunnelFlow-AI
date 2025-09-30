# 🚀 SaaS Funnel Builder Platform

A complete SaaS platform for building AI-powered video funnels with HeyGen integration, drag-and-drop interface, and advanced analytics.

## 📁 Project Structure

```
SAAS FUNNEL PROJECT/
├── 📁 backend/                    # Node.js Backend API
├── 📁 frontend/                   # React Frontend App
├── 📁 database/                   # PostgreSQL Database
├── 📁 deployment/                 # Docker & Deployment
├── 📁 shared/                     # Shared Types & Utils
└── 📁 docs/                       # Documentation
```

## 🎯 Features

### 🎬 **AI-Powered Video Generation**
- HeyGen integration for professional talking avatars
- Script-to-video automation
- Custom avatar creation
- Voice cloning capabilities

### 🎨 **Drag & Drop Funnel Builder**
- Visual funnel creation interface
- Multiple step types (video, question, form, pricing)
- Real-time preview
- Mobile optimization

### 📊 **Advanced Analytics**
- Conversion tracking
- A/B testing capabilities
- Performance metrics
- Export functionality

### 🎭 **Custom Branding**
- Logo upload and positioning
- Color palette customization
- Typography settings
- White-label solution

## 🛠️ Tech Stack

### **Backend**
- **Node.js** with Express
- **PostgreSQL** database
- **Redis** for caching
- **JWT** authentication
- **Stripe** for payments
- **HeyGen** API integration

### **Frontend**
- **React 18** with TypeScript
- **React Router** for navigation
- **Framer Motion** for animations
- **React Query** for data fetching
- **Styled Components** for styling
- **React DnD** for drag-and-drop

### **Database**
- **PostgreSQL** with UUID primary keys
- **Sequelize** ORM
- **Redis** for session management
- **Comprehensive indexing** for performance

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd "E:\JONEAST\JAY SIR\SAAS FUNNEL PROJECT"
```

### **2. Database Setup**
```bash
# Create PostgreSQL database
createdb saas_funnel_db

# Run schema
psql saas_funnel_db < database/schema.sql

# Seed initial data
psql saas_funnel_db < database/seeds/initial_data.sql
```

### **3. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### **4. Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### **5. Using Docker (Recommended)**
```bash
cd deployment
docker-compose up -d
```

## 🔧 Configuration

### **Environment Variables**

#### **Backend (.env)**
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saas_funnel_db
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
HEYGEN_API_KEY=your-heygen-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

#### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
VITE_HEYGEN_API_URL=http://localhost:5000/api/heygen
```

## 📊 Database Schema

### **Core Tables**
- **users** - User accounts and authentication
- **funnels** - Funnel configurations
- **funnel_steps** - Individual funnel steps
- **templates** - Pre-built funnel templates
- **analytics** - User interaction tracking
- **subscriptions** - Billing and plans
- **payments** - Payment transactions
- **avatars** - Avatar configurations
- **videos** - Generated video metadata

### **Key Relationships**
- Users → Funnels (1:many)
- Funnels → Steps (1:many)
- Users → Analytics (1:many)
- Users → Subscriptions (1:many)

## 🎨 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### **Funnels**
- `GET /api/funnels` - List user funnels
- `POST /api/funnels` - Create new funnel
- `GET /api/funnels/:id` - Get funnel details
- `PUT /api/funnels/:id` - Update funnel
- `DELETE /api/funnels/:id` - Delete funnel

### **HeyGen Integration**
- `POST /api/heygen/create-video` - Generate video
- `GET /api/heygen/video-status/:id` - Check video status
- `GET /api/heygen/avatars` - List available avatars
- `GET /api/heygen/voices` - List available voices

### **Analytics**
- `GET /api/analytics/funnel/:id` - Funnel analytics
- `GET /api/analytics/overview` - User analytics overview
- `POST /api/analytics/track` - Track user interaction

## 🚀 Deployment

### **Docker Deployment**
```bash
cd deployment
docker-compose up -d
```

### **Production Deployment**
1. **Database**: Set up PostgreSQL with proper backups
2. **Backend**: Deploy to cloud provider (AWS, DigitalOcean, etc.)
3. **Frontend**: Deploy to Vercel, Netlify, or similar
4. **CDN**: Configure for video and asset delivery
5. **SSL**: Set up SSL certificates
6. **Monitoring**: Add logging and monitoring

## 📈 Performance Optimization

### **Database**
- Proper indexing on frequently queried columns
- Connection pooling
- Query optimization
- Regular maintenance

### **Frontend**
- Code splitting and lazy loading
- Image optimization
- CDN for static assets
- Caching strategies

### **Backend**
- Redis caching
- Rate limiting
- Compression
- Database connection pooling

## 🔒 Security

### **Authentication**
- JWT tokens with expiration
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Email verification

### **API Security**
- CORS configuration
- Input validation
- SQL injection prevention
- XSS protection

### **Data Protection**
- Encrypted sensitive data
- Secure file uploads
- GDPR compliance
- Data retention policies

## 🧪 Testing

### **Backend Tests**
```bash
cd backend
npm test
npm run test:watch
```

### **Frontend Tests**
```bash
cd frontend
npm test
npm run test:coverage
```

### **E2E Tests**
```bash
npm run test:e2e
```

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guide](docs/CONTRIBUTING.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the docs folder
- **Issues**: Create a GitHub issue
- **Email**: support@saasfunnel.com
- **Discord**: Join our community server

## 🎯 Roadmap

### **Phase 1** ✅
- [x] Basic funnel builder
- [x] HeyGen integration
- [x] User authentication
- [x] Database schema

### **Phase 2** 🚧
- [ ] Advanced analytics
- [ ] A/B testing
- [ ] Team collaboration
- [ ] API access

### **Phase 3** 📋
- [ ] White-label solution
- [ ] Custom integrations
- [ ] Advanced AI features
- [ ] Enterprise features

---

**Built with ❤️ for the future of video marketing**
