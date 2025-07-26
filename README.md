# 🧾 Receipt Scanner API

A secure, production-ready receipt scanning application that uses Mistral AI for OCR and text parsing. Built with FastAPI backend and React Native/Expo frontends.

## 🚀 Features

- **Secure OCR Processing**: Uses Mistral AI for accurate text extraction
- **Smart Receipt Parsing**: Extracts merchant, date, items, prices, and totals
- **Dual Frontend Options**: Choose between two React Native implementations
- **Robust Error Handling**: Comprehensive validation and retry logic
- **File Security**: Upload validation, size limits, and safe file handling
- **Environment Configuration**: Flexible settings management
- **Database Ready**: Schema included for data persistence
- **Production Security**: CORS restrictions, input validation, and proper error handling

## 🏗️ Architecture

```
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/v1/         # API routes
│   │   ├── core/           # Configuration
│   │   └── services/       # Business logic
├── frontend/               # React Native apps
│   ├── ReceiptScanner/     # Original implementation
│   └── fresh-receipt-scanner/ # TypeScript implementation
└── database/              # Database schema
```

## ⚡ Quick Start

### 1. Backend Setup

```bash
# Clone and navigate to project
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your Mistral API key
```

### 2. Environment Configuration

Create `.env` file in project root:

```env
MISTRAL_API_KEY=your_mistral_api_key_here
DEBUG=false
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:19006,http://localhost:8081
```

### 3. Start Backend

```bash
# From project root
python main.py

# Or with uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Frontend Setup

Choose either frontend implementation:

#### Option A: Original Frontend (JavaScript)
```bash
cd frontend/ReceiptScanner
npm install
cp .env.example .env
# Edit .env with your backend URL
expo start
```

#### Option B: Fresh Frontend (TypeScript)
```bash
cd frontend/fresh-receipt-scanner
npm install
cp .env.example .env
# Edit .env with your backend URL
expo start
```

## 🔧 Configuration

### Backend Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `MISTRAL_API_KEY` | Mistral AI API key | Required |
| `DEBUG` | Enable debug mode | `false` |
| `MAX_FILE_SIZE` | Max upload size in bytes | `10485760` (10MB) |
| `ALLOWED_FILE_TYPES` | Comma-separated MIME types | `image/jpeg,image/png,image/webp` |
| `CORS_ORIGINS` | Allowed origins for CORS | `http://localhost:19006,http://localhost:8081` |

### Frontend Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |
| `EXPO_PUBLIC_DEBUG` | Enable debug logging | `true` |

## 📱 Usage

1. **Start the backend server**
2. **Launch the mobile app** (iOS/Android via Expo)
3. **Take a photo** or select from gallery
4. **Wait for processing** (OCR + AI parsing)
5. **View results** with extracted receipt data

## 🛡️ Security Features

- ✅ **CORS Restrictions**: Only allowed origins can access the API
- ✅ **File Validation**: Type and size checking
- ✅ **Input Sanitization**: Safe filename generation
- ✅ **Error Handling**: No sensitive data in error responses
- ✅ **Rate Limiting Ready**: Configuration included
- ✅ **Temporary File Cleanup**: Automatic cleanup after processing

## 📊 API Endpoints

### Health Check
```http
GET /health
GET /api/v1/receipt/health
```

### Receipt Processing
```http
POST /api/v1/receipt/upload-receipt/
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "message": "Receipt processed successfully",
  "data": {
    "merchant": "Store Name",
    "date": "2024-01-15",
    "total": 25.99,
    "subtotal": 24.00,
    "tax": 1.99,
    "items": [
      {"name": "Item 1", "price": 12.99},
      {"name": "Item 2", "price": 11.01}
    ]
  }
}
```

## 🗄️ Database

SQLite schema included for storing receipt data:

```bash
# Initialize database
sqlite3 receipts.db < database/schema.sql
```

Tables:
- `receipts` - Main receipt data
- `receipt_items` - Individual items
- `processing_logs` - Error tracking

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Test API endpoints
curl -X GET http://localhost:8000/health
```

## 🔍 Troubleshooting

### Common Issues

1. **"CORS Error"**
   - Update `CORS_ORIGINS` in `.env`
   - Ensure frontend URL is included

2. **"Invalid API Key"**
   - Verify `MISTRAL_API_KEY` in `.env`
   - Check API key permissions

3. **"File Too Large"**
   - Reduce image quality in app
   - Check `MAX_FILE_SIZE` setting

4. **"Network Error"**
   - Verify backend is running
   - Check `EXPO_PUBLIC_API_URL` in frontend

### Debug Mode

Enable debug logging:
```env
DEBUG=true
EXPO_PUBLIC_DEBUG=true
```

## 📝 Development

### Code Quality
- **Type hints** throughout Python code
- **Error handling** at all levels
- **Logging** for debugging and monitoring
- **Environment separation** for dev/prod

### Adding Features
1. Update API schema in `backend/app/api/v1/schemas.py`
2. Add endpoint in `backend/app/api/v1/endpoints/`
3. Update frontend services
4. Add tests

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: See `/docs` folder (when available)

---

**Built with ❤️ using FastAPI, React Native, and Mistral AI**