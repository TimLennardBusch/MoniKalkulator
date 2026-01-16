import { useState, useMemo } from 'react';
import { useProductStore } from '../stores/productStore';
import { useSettingsStore, parseFormula } from '../stores/settingsStore';
import SearchableDropdown from '../components/SearchableDropdown';
import './Kalkulation.css';

type SelectionKeys = 'behandlung' | 'produkt' | 'typ' | 'laenge';

export default function Kalkulation() {
  const { products, getFilteredOptions } = useProductStore();
  const { mwst, stundenlohn, schnittpreis, einkaufspreisFormel, aufwandsentschaedigungFormel } =
    useSettingsStore();

  const [selection, setSelection] = useState<Record<SelectionKeys, string>>({
    behandlung: '',
    produkt: '',
    typ: '',
    laenge: '',
  });

  const [anzahl, setAnzahl] = useState('1');
  const [zeitaufwand, setZeitaufwand] = useState('');

  const behandlungOptions = useMemo(
    () => getFilteredOptions('behandlung', selection),
    [products, selection]
  );
  const produktOptions = useMemo(
    () => getFilteredOptions('produkt', selection),
    [products, selection]
  );
  const typOptions = useMemo(
    () => getFilteredOptions('typ', selection),
    [products, selection]
  );
  const laengeOptions = useMemo(
    () => getFilteredOptions('laenge', selection),
    [products, selection]
  );

  const selectedProduct = useMemo(() => {
    if (!selection.behandlung || !selection.produkt) return null;
    return products.find((p) => {
      const matches = p.behandlung === selection.behandlung && p.produkt === selection.produkt;
      if (!matches) return false;
      if (selection.typ && p.typ !== selection.typ) return false;
      if (selection.laenge && p.laenge !== selection.laenge) return false;
      return true;
    });
  }, [products, selection]);

  const calculations = useMemo(() => {
    const anzahlNum = parseFloat(anzahl) || 0;
    const zeitaufwandNum = parseFloat(zeitaufwand) || 0;
    const preis = selectedProduct?.preis || 0;

    const variables = {
      preis,
      anzahl: anzahlNum,
      zeitaufwand: zeitaufwandNum,
      stundenlohn,
      schnittpreis,
    };

    const einkaufspreisBrutto = parseFormula(einkaufspreisFormel, variables);
    const aufwandsentschaedigung = parseFormula(aufwandsentschaedigungFormel, variables);
    const mwstBetrag = einkaufspreisBrutto * (mwst / 100);
    const gesamtpreis = einkaufspreisBrutto + aufwandsentschaedigung;

    return { einkaufspreisBrutto, mwstBetrag, aufwandsentschaedigung, gesamtpreis };
  }, [selectedProduct, anzahl, zeitaufwand, mwst, stundenlohn, schnittpreis, einkaufspreisFormel, aufwandsentschaedigungFormel]);

  const handleSelect = (field: SelectionKeys, value: string) => {
    setSelection((prev) => ({ ...prev, [field]: value }));
  };

  const handleClear = (field: SelectionKeys) => {
    setSelection((prev) => ({ ...prev, [field]: '' }));
  };

  const handleReset = () => {
    setSelection({ behandlung: '', produkt: '', typ: '', laenge: '' });
    setAnzahl('1');
    setZeitaufwand('');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  };

  const hasSelection = selection.behandlung || selection.produkt || selection.typ || selection.laenge;

  return (
    <div className="kalkulation-page">
      <div className="kalkulation-scroll">
        <section className="section">
          <h2 className="section-title">Produktauswahl</h2>

          <SearchableDropdown
            label="Behandlung"
            value={selection.behandlung}
            placeholder="Behandlung auswählen"
            availableOptions={behandlungOptions.available}
            unavailableOptions={behandlungOptions.unavailable}
            onSelect={(v) => handleSelect('behandlung', v)}
            onClear={() => handleClear('behandlung')}
          />

          <SearchableDropdown
            label="Produkt"
            value={selection.produkt}
            placeholder="Produkt auswählen"
            availableOptions={produktOptions.available}
            unavailableOptions={produktOptions.unavailable}
            onSelect={(v) => handleSelect('produkt', v)}
            onClear={() => handleClear('produkt')}
          />

          <SearchableDropdown
            label="Typ"
            value={selection.typ}
            placeholder="Typ auswählen"
            availableOptions={typOptions.available}
            unavailableOptions={typOptions.unavailable}
            onSelect={(v) => handleSelect('typ', v)}
            onClear={() => handleClear('typ')}
          />

          <SearchableDropdown
            label="Länge"
            value={selection.laenge}
            placeholder="Länge auswählen"
            availableOptions={laengeOptions.available}
            unavailableOptions={laengeOptions.unavailable}
            onSelect={(v) => handleSelect('laenge', v)}
            onClear={() => handleClear('laenge')}
          />
        </section>

        {selectedProduct && (
          <div className="product-info-card">
            <div className="product-info-row">
              <span className="product-info-label">Einkaufspreis (Brutto) pro Stück</span>
              <span className="product-info-value">{formatCurrency(selectedProduct.preis)}</span>
            </div>
            {selectedProduct.artikelId && (
              <div className="product-info-row">
                <span className="product-info-label">Artikel-ID</span>
                <span className="product-info-value-small">{selectedProduct.artikelId}</span>
              </div>
            )}
            {selectedProduct.info && (
              <div className="product-info-row">
                <span className="product-info-label">Info</span>
                <span className="product-info-value-small">{selectedProduct.info}</span>
              </div>
            )}
          </div>
        )}

        <section className="section">
          <h2 className="section-title">Mengen & Zeitaufwand</h2>

          <div className="input-group">
            <label className="label">Benötigte Anzahl</label>
            <input
              type="number"
              className="input"
              value={anzahl}
              onChange={(e) => setAnzahl(e.target.value)}
              placeholder="1"
            />
          </div>

          <div className="input-group">
            <label className="label">Zeitaufwand (Stunden)</label>
            <input
              type="number"
              step="0.1"
              className="input"
              value={zeitaufwand}
              onChange={(e) => setZeitaufwand(e.target.value)}
              placeholder="0"
            />
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Kalkulation</h2>

          <div className="calculation-card">
            <div className="calc-row">
              <span className="calc-label">Einkaufspreis (Brutto)</span>
              <span className="calc-value">{formatCurrency(calculations.einkaufspreisBrutto)}</span>
            </div>
            <div className="calc-row">
              <span className="calc-label-small">davon MwSt ({mwst}%)</span>
              <span className="calc-value-small">{formatCurrency(calculations.mwstBetrag)}</span>
            </div>
            <div className="divider"></div>
            <div className="calc-row">
              <span className="calc-label">Stundenlohn</span>
              <span className="calc-value">{formatCurrency(stundenlohn)}</span>
            </div>
            <div className="calc-row">
              <span className="calc-label">Schnittpreis</span>
              <span className="calc-value">{formatCurrency(schnittpreis)}</span>
            </div>
            <div className="calc-row">
              <span className="calc-label">Aufwandsentschädigung</span>
              <span className="calc-value">{formatCurrency(calculations.aufwandsentschaedigung)}</span>
            </div>
          </div>
        </section>

        <div className="spacer"></div>
      </div>

      <div className="bottom-container">
        <div className="summary-container">
          <div className="summary-row">
            <span className="summary-label">Einkaufspreis (Brutto)</span>
            <span className="summary-value">{formatCurrency(calculations.einkaufspreisBrutto)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Aufwandsentschädigung</span>
            <span className="summary-value">{formatCurrency(calculations.aufwandsentschaedigung)}</span>
          </div>
          <div className="total-row">
            <span className="total-label">Gesamtpreis</span>
            <span className="total-value">{formatCurrency(calculations.gesamtpreis)}</span>
          </div>
        </div>
        {hasSelection && (
          <button className="reset-button" onClick={handleReset}>
            <span className="reset-icon">↻</span>
            Zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
}
