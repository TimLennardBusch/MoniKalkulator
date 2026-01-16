import { useState, useMemo } from 'react';
import { useProductStore } from '../stores/productStore';
import { useSettingsStore, parseFormula } from '../stores/settingsStore';
import SearchableDropdown from '../components/SearchableDropdown';
import './Kalkulation.css';

type SelectionKeys = 'produkt' | 'typ' | 'laenge';

// Fixed Behandlung options
const BEHANDLUNG_OPTIONS = ['Einsetzen', 'Hochsetzen', 'Rausnehmen'];

export default function Kalkulation() {
  const { products, getFilteredOptions } = useProductStore();
  const { mwst, stundenlohn, schnittpreis, einkaufspreisFormel, aufwandsentschaedigungFormel } =
    useSettingsStore();

  const [behandlung, setBehandlung] = useState('');
  const [selection, setSelection] = useState<Record<SelectionKeys, string>>({
    produkt: '',
    typ: '',
    laenge: '',
  });

  const [anzahl, setAnzahl] = useState('1');
  const [zeitaufwand, setZeitaufwand] = useState('');
  const [schneiden, setSchneiden] = useState(false);

  // Determine if we should show product selection (for "Einsetzen" or when nothing selected)
  const showProductSelection = !behandlung || behandlung === 'Einsetzen';

  const produktOptions = useMemo(
    () => getFilteredOptions('produkt', { behandlung: 'Einsetzen', ...selection }),
    [products, selection]
  );
  const typOptions = useMemo(
    () => getFilteredOptions('typ', { behandlung: 'Einsetzen', ...selection }),
    [products, selection]
  );
  const laengeOptions = useMemo(
    () => getFilteredOptions('laenge', { behandlung: 'Einsetzen', ...selection }),
    [products, selection]
  );

  const selectedProduct = useMemo(() => {
    if (!showProductSelection || !selection.produkt) return null;
    return products.find((p) => {
      const matches = p.behandlung === 'Einsetzen' && p.produkt === selection.produkt;
      if (!matches) return false;
      if (selection.typ && p.typ !== selection.typ) return false;
      if (selection.laenge && p.laenge !== selection.laenge) return false;
      return true;
    });
  }, [products, selection, showProductSelection]);

  const calculations = useMemo(() => {
    const anzahlNum = parseFloat(anzahl) || 0;
    const zeitaufwandNum = parseFloat(zeitaufwand) || 0;
    const preis = selectedProduct?.preis || 0;

    // Only calculate product price for "Einsetzen"
    const einkaufspreisBrutto = showProductSelection
      ? parseFormula(einkaufspreisFormel, { preis, anzahl: anzahlNum, zeitaufwand: zeitaufwandNum, stundenlohn, schnittpreis, mwst })
      : 0;

    // Calculate aufwandsentschädigung for all treatment types
    const aufwandsentschaedigung = parseFormula(aufwandsentschaedigungFormel, {
      preis: 0,
      anzahl: anzahlNum,
      zeitaufwand: zeitaufwandNum,
      stundenlohn,
      schnittpreis,
    });

    // Add Schnittpreis if schneiden is enabled
    const schnittpreisTotal = schneiden ? schnittpreis : 0;

    const mwstBetrag = einkaufspreisBrutto * (mwst / 100);
    const gesamtpreis = einkaufspreisBrutto + aufwandsentschaedigung + schnittpreisTotal;

    return { einkaufspreisBrutto, mwstBetrag, aufwandsentschaedigung, schnittpreisTotal, gesamtpreis };
  }, [selectedProduct, anzahl, zeitaufwand, mwst, stundenlohn, schnittpreis, einkaufspreisFormel, aufwandsentschaedigungFormel, showProductSelection, schneiden]);

  const handleSelect = (field: SelectionKeys, value: string) => {
    setSelection((prev) => ({ ...prev, [field]: value }));
  };

  const handleClear = (field: SelectionKeys) => {
    setSelection((prev) => ({ ...prev, [field]: '' }));
  };

  const handleBehandlungChange = (value: string) => {
    setBehandlung(value);
    // Reset product selection when changing treatment type
    if (value !== 'Einsetzen') {
      setSelection({ produkt: '', typ: '', laenge: '' });
      setAnzahl('1');
    }
  };

  const handleReset = () => {
    setBehandlung('');
    setSelection({ produkt: '', typ: '', laenge: '' });
    setAnzahl('1');
    setZeitaufwand('');
    setSchneiden(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  };

  const hasSelection = behandlung || selection.produkt || selection.typ || selection.laenge;

  // Dynamic section title
  const kalkulationTitle = behandlung ? `Kalkulation: ${behandlung}` : 'Kalkulation';

  return (
    <div className="kalkulation-page">
      <div className="kalkulation-scroll">
        {/* Behandlung Selection (always visible) */}
        <section className="section">
          <h2 className="section-title">Behandlung</h2>
          <SearchableDropdown
            label="Behandlung"
            value={behandlung}
            placeholder="Behandlung auswählen"
            availableOptions={BEHANDLUNG_OPTIONS}
            unavailableOptions={[]}
            onSelect={handleBehandlungChange}
            onClear={() => setBehandlung('')}
          />
        </section>

        {/* Product Selection (only for "Einsetzen") */}
        {showProductSelection && (
          <>
            <section className="section">
              <h2 className="section-title">Produktauswahl</h2>

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

              <div className="toggle-group">
                <label className="toggle-label">Schneiden?</label>
                <button
                  type="button"
                  className={`toggle-button ${schneiden ? 'active' : ''}`}
                  onClick={() => setSchneiden(!schneiden)}
                >
                  <span className="toggle-track">
                    <span className="toggle-thumb"></span>
                  </span>
                  <span className="toggle-text">{schneiden ? 'Ja (+60€)' : 'Nein'}</span>
                </button>
              </div>
            </section>
          </>
        )}

        {/* For Hochsetzen/Rausnehmen: only Zeitaufwand */}
        {behandlung && !showProductSelection && (
          <section className="section">
            <h2 className="section-title">Zeitaufwand</h2>

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

            <div className="toggle-group">
              <label className="toggle-label">Schneiden?</label>
              <button
                type="button"
                className={`toggle-button ${schneiden ? 'active' : ''}`}
                onClick={() => setSchneiden(!schneiden)}
              >
                <span className="toggle-track">
                  <span className="toggle-thumb"></span>
                </span>
                <span className="toggle-text">{schneiden ? 'Ja (+60€)' : 'Nein'}</span>
              </button>
            </div>
          </section>
        )}

        {/* Kalkulation section (always visible when Behandlung is selected) */}
        {behandlung && (
          <section className="section">
            <h2 className="section-title">{kalkulationTitle}</h2>

            <div className="calculation-card">
              {showProductSelection && (
                <>
                  <div className="calc-row">
                    <span className="calc-label">Einkaufspreis (Brutto)</span>
                    <span className="calc-value">{formatCurrency(calculations.einkaufspreisBrutto)}</span>
                  </div>
                  <div className="calc-row">
                    <span className="calc-label-small">davon MwSt ({mwst}%)</span>
                    <span className="calc-value-small">{formatCurrency(calculations.mwstBetrag)}</span>
                  </div>
                  <div className="divider"></div>
                </>
              )}
              {schneiden && (
                <div className="calc-row">
                  <span className="calc-label">Schnittpreis</span>
                  <span className="calc-value">{formatCurrency(schnittpreis)}</span>
                </div>
              )}
              <div className="calc-row">
                <span className="calc-label">
                  {zeitaufwand ? `Aufwandsentschädigung (für ${zeitaufwand} Stunden)` : 'Aufwandsentschädigung'}
                </span>
                <span className="calc-value">{formatCurrency(calculations.aufwandsentschaedigung)}</span>
              </div>
            </div>
          </section>
        )}

        <div className="spacer"></div>
      </div>

      <div className="bottom-container">
        <div className="summary-container">
          {showProductSelection && (
            <div className="summary-row">
              <span className="summary-label">Einkaufspreis (Brutto)</span>
              <span className="summary-value">{formatCurrency(calculations.einkaufspreisBrutto)}</span>
            </div>
          )}
          <div className="summary-row">
            <span className="summary-label">
              {zeitaufwand ? `Aufwandsentschädigung (${zeitaufwand}h)` : 'Aufwandsentschädigung'}
            </span>
            <span className="summary-value">{formatCurrency(calculations.aufwandsentschaedigung)}</span>
          </div>
          {schneiden && (
            <div className="summary-row">
              <span className="summary-label">Schnittpreis</span>
              <span className="summary-value">{formatCurrency(calculations.schnittpreisTotal)}</span>
            </div>
          )}
        </div>
        <div className="total-row">
          <span className="total-label">Gesamtpreis</span>
          <span className="total-value">{formatCurrency(calculations.gesamtpreis)}</span>
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
