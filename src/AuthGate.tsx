import { useState, useEffect, type ReactNode } from 'react';
import './AuthGate.css';

const CORRECT_PASSWORD = 'Moni123';
const AUTH_KEY = 'isAuthorized';

interface AuthGateProps {
  children: ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    setIsAuthorized(stored === 'true');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Falsches Passwort');
      setPassword('');
    }
  };

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // Already authorized
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Show login
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">🔐</div>
        <h1 className="auth-title">Moni Kalkulator</h1>
        <p className="auth-subtitle">Bitte Passwort eingeben</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            className="auth-input"
            autoFocus
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-button">
            Anmelden
          </button>
        </form>
      </div>
    </div>
  );
}
