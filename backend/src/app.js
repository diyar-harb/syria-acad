const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exams');
const testRoutes = require('./routes/test');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100,
  message: {
    error: {
      message: 'تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً',
      status: 429
    }
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.firebaseio.com", "https://*.googleapis.com"]
    }
  }
}));

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN.split(',');
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use(limiter);

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/test', testRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Firebase specific errors
  if (err.code === 'auth/invalid-token') {
    return res.status(401).json({
      error: {
        message: 'توكن غير صالح',
        status: 401
      }
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        message: err.message,
        status: 400
      }
    });
  }

  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: {
        message: 'غير مسموح بالوصول من هذا المصدر',
        status: 403
      }
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'خطأ في الخادم',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'المسار غير موجود',
      status: 404
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}); 