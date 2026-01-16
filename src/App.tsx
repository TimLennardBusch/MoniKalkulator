import { useState } from 'react';
import AuthGate from './AuthGate';
import Kalkulation from './pages/Kalkulation';
import Produkte from './pages/Produkte';
import Einstellungen from './pages/Einstellungen';
import './App.css';

type TabName = 'kalkulation' | 'produkte' | 'einstellungen';

function App() {
  const [activeTab, setActiveTab] = useState<TabName>('kalkulation');

  const renderPage = () => {
    switch (activeTab) {
      case 'kalkulation':
        return <Kalkulation />;
      case 'produkte':
        return <Produkte />;
      case 'einstellungen':
        return <Einstellungen />;
    }
  };

  return (
    <AuthGate>
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">
            {activeTab === 'kalkulation' && 'Kalkulation'}
            {activeTab === 'produkte' && 'Produkte'}
            {activeTab === 'einstellungen' && 'Einstellungen'}
          </h1>
        </header>

        <main className="app-main">
          {renderPage()}
        </main>

        <nav className="tab-bar">
          <button
            className={`tab-item ${activeTab === 'kalkulation' ? 'active' : ''}`}
            onClick={() => setActiveTab('kalkulation')}
          >
            <span className="tab-icon">🧮</span>
            <span className="tab-label">Kalkulation</span>
          </button>
          <button
            className={`tab-item ${activeTab === 'produkte' ? 'active' : ''}`}
            onClick={() => setActiveTab('produkte')}
          >
            <span className="tab-icon">📦</span>
            <span className="tab-label">Produkte</span>
          </button>
          <button
            className={`tab-item ${activeTab === 'einstellungen' ? 'active' : ''}`}
            onClick={() => setActiveTab('einstellungen')}
          >
            <span className="tab-icon">⚙️</span>
            <span className="tab-label">Einstellungen</span>
          </button>
        </nav>
      </div>
    </AuthGate>
  );
}

export default App;
