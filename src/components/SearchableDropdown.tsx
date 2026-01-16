import { useState, useMemo } from 'react';
import './SearchableDropdown.css';

interface SearchableDropdownProps {
  label: string;
  value: string;
  placeholder?: string;
  availableOptions: string[];
  unavailableOptions: string[];
  onSelect: (value: string) => void;
  onClear?: () => void;
}

export default function SearchableDropdown({
  label,
  value,
  placeholder = 'Auswählen...',
  availableOptions,
  unavailableOptions,
  onSelect,
  onClear,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredAvailable = useMemo(() => {
    let options = availableOptions;
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      options = availableOptions.filter((opt) => opt.toLowerCase().includes(search));
    }
    return options.slice().sort((a, b) => a.localeCompare(b, 'de'));
  }, [availableOptions, searchText]);

  const filteredUnavailable = useMemo(() => {
    let options = unavailableOptions;
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      options = unavailableOptions.filter((opt) => opt.toLowerCase().includes(search));
    }
    return options.slice().sort((a, b) => a.localeCompare(b, 'de'));
  }, [unavailableOptions, searchText]);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
    setSearchText('');
  };

  const handleClear = () => {
    if (onClear) onClear();
    setIsOpen(false);
    setSearchText('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchText('');
  };

  return (
    <div className="dropdown-container">
      <label className="dropdown-label">{label}</label>

      <button
        className={`dropdown-button ${value ? 'selected' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <span className={`dropdown-text ${!value ? 'placeholder' : ''}`}>
          {value || placeholder}
        </span>
        <div className="dropdown-icons">
          {value && onClear && (
            <span
              className="clear-icon"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              ✕
            </span>
          )}
          <span className="chevron">▼</span>
        </div>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{label}</h3>
              <button className="close-button" onClick={handleClose}>✕</button>
            </div>

            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Suchen..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <button className="search-clear" onClick={() => setSearchText('')}>✕</button>
              )}
            </div>

            <div className="options-list">
              {filteredAvailable.map((opt) => (
                <button
                  key={opt}
                  className={`option-item ${opt === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt)}
                >
                  <span className="option-text">{opt}</span>
                  {opt === value && <span className="check-icon">✓</span>}
                </button>
              ))}
              {filteredUnavailable.map((opt) => (
                <button key={opt} className="option-item disabled" disabled>
                  <span className="option-text">{opt}</span>
                  <span className="unavailable-hint">nicht verfügbar</span>
                </button>
              ))}
              {filteredAvailable.length === 0 && filteredUnavailable.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">🔍</span>
                  <span>Keine Optionen gefunden</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
