import { useState } from 'react';
import { type Product } from '../stores/productStore';
import './ImportModal.css';

interface ImportModalProps {
  existingBehandlungen: string[];
  onImport: (products: Omit<Product, 'id'>[]) => void;
  onClose: () => void;
}

// Table columns for import
const COLUMNS = ['produkt', 'typ', 'laenge', 'artikel_id', 'preis', 'info'] as const;
const COLUMN_HEADERS = {
  produkt: 'Produkt',
  typ: 'Typ',
  laenge: 'Länge',
  artikel_id: 'Artikel-ID',
  preis: 'Preis',
  info: 'Info',
};

type RowData = {
  produkt: string;
  typ: string;
  laenge: string;
  artikel_id: string;
  preis: string;
  info: string;
};

const emptyRow = (): RowData => ({
  produkt: '',
  typ: '',
  laenge: '',
  artikel_id: '',
  preis: '',
  info: '',
});

export default function ImportModal({ existingBehandlungen, onImport, onClose }: ImportModalProps) {
  const [behandlung, setBehandlung] = useState('');
  const [rows, setRows] = useState<RowData[]>([emptyRow(), emptyRow(), emptyRow()]);

  const updateCell = (rowIndex: number, column: keyof RowData, value: string) => {
    setRows((prev) => {
      const newRows = [...prev];
      newRows[rowIndex] = { ...newRows[rowIndex], [column]: value };
      return newRows;
    });
  };

  const addRow = () => {
    setRows((prev) => [...prev, emptyRow()]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleImport = () => {
    if (!behandlung.trim()) {
      alert('Bitte wählen Sie eine Behandlung aus oder geben Sie eine neue ein.');
      return;
    }

    const validRows = rows.filter(
      (row) => row.produkt.trim() && row.preis.trim()
    );

    if (validRows.length === 0) {
      alert('Bitte füllen Sie mindestens eine Zeile mit Produkt und Preis aus.');
      return;
    }

    const products: Omit<Product, 'id'>[] = validRows.map((row) => ({
      behandlung: behandlung.trim(),
      produkt: row.produkt.trim(),
      typ: row.typ.trim(),
      laenge: row.laenge.trim(),
      artikelId: row.artikel_id.trim(),
      preis: parseFloat(row.preis.replace(',', '.')) || 0,
      info: row.info.trim(),
    }));

    onImport(products);
  };

  const handlePaste = (e: React.ClipboardEvent, rowIndex: number, colIndex: number) => {
    const pasteData = e.clipboardData.getData('text');
    const lines = pasteData.split('\n').filter(line => line.trim());
    
    if (lines.length > 1 || pasteData.includes('\t')) {
      e.preventDefault();
      
      const parsedRows: RowData[] = lines.map(line => {
        const cells = line.split('\t');
        const row = emptyRow();
        COLUMNS.forEach((col, idx) => {
          if (cells[colIndex + idx] !== undefined) {
            row[col] = cells[colIndex + idx].trim();
          }
        });
        return row;
      });

      setRows(prev => {
        const newRows = [...prev];
        parsedRows.forEach((parsedRow, idx) => {
          const targetIndex = rowIndex + idx;
          if (targetIndex < newRows.length) {
            // Merge with existing row
            COLUMNS.forEach((col, cIdx) => {
              if (colIndex + cIdx < COLUMNS.length && parsedRow[COLUMNS[cIdx]]) {
                newRows[targetIndex][col] = parsedRow[COLUMNS[cIdx]];
              }
            });
          } else {
            newRows.push(parsedRow);
          }
        });
        return newRows;
      });
    }
  };

  return (
    <div className="import-overlay" onClick={onClose}>
      <div className="import-modal" onClick={(e) => e.stopPropagation()}>
        <div className="import-header">
          <button className="text-button" onClick={onClose}>Abbrechen</button>
          <h3>Massenimport</h3>
          <button className="text-button primary" onClick={handleImport}>Importieren</button>
        </div>

        <div className="import-content">
          <div className="behandlung-section">
            <label className="behandlung-label">Behandlung für alle Zeilen:</label>
            <div className="behandlung-input-row">
              <input
                className="behandlung-input"
                value={behandlung}
                onChange={(e) => setBehandlung(e.target.value)}
                placeholder="z.B. Einsetzen"
                list="behandlungen"
              />
              <datalist id="behandlungen">
                {existingBehandlungen.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="table-container">
            <table className="import-table">
              <thead>
                <tr>
                  {COLUMNS.map((col) => (
                    <th key={col}>{COLUMN_HEADERS[col]}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {COLUMNS.map((col, colIndex) => (
                      <td key={col}>
                        <input
                          className="table-input"
                          value={row[col]}
                          onChange={(e) => updateCell(rowIndex, col, e.target.value)}
                          onPaste={(e) => handlePaste(e, rowIndex, colIndex)}
                          placeholder={col === 'preis' ? '0.00' : ''}
                        />
                      </td>
                    ))}
                    <td>
                      <button
                        className="remove-row-btn"
                        onClick={() => removeRow(rowIndex)}
                        disabled={rows.length <= 1}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="add-row-btn" onClick={addRow}>
            + Zeile hinzufügen
          </button>

          <p className="paste-hint">
            💡 Tipp: Sie können Daten direkt aus Excel einfügen!
          </p>
        </div>
      </div>
    </div>
  );
}
