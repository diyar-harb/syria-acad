import React from 'react';
import { useTranslation } from 'react-i18next';
import './ErrorFallback.css';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const { t } = useTranslation();

  return (
    <div className="error-fallback">
      <div className="error-content">
        <h1>{t('error.title')}</h1>
        <p>{t('error.message')}</p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="error-details">{error.message}</pre>
        )}
        <button onClick={resetErrorBoundary} className="btn btn-primary">
          {t('error.tryAgain')}
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback; 