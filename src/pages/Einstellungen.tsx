import { useState } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import './Einstellungen.css';

export default function Einstellungen() {
  const {
    mwst,
    stundenlohn,
    schnittpreis,
    einkaufspreisFormel,
    aufwandsentschaedigungFormel,
    setMwst,
    setStundenlohn,
    setSchnittpreis,
    setEinkaufspreisFormel,
    setAufwandsentschaedigungFormel,
  } = useSettingsStore();

  const [localMwst, setLocalMwst] = useState(mwst.toString());
  const [localStundenlohn, setLocalStundenlohn] = useState(stundenlohn.toString());
  const [localSchnittpreis, setLocalSchnittpreis] = useState(schnittpreis.toString());
  const [localEinkaufspreisFormel, setLocalEinkaufspreisFormel] = useState(einkaufspreisFormel);
  const [localAufwandsentschaedigungFormel, setLocalAufwandsentschaedigungFormel] = useState(
    aufwandsentschaedigungFormel
  );

  const handleSave = () => {
    const mwstValue = parseFloat(localMwst);
    const stundenlohnValue = parseFloat(localStundenlohn);
    const schnittpreisValue = parseFloat(localSchnittpreis);

    if (isNaN(mwstValue) || mwstValue < 0 || mwstValue > 100) {
      alert('Bitte geben Sie einen gültigen MwSt-Satz (0-100%) ein.');
      return;
    }

    if (isNaN(stundenlohnValue) || stundenlohnValue < 0) {
      alert('Bitte geben Sie einen gültigen Stundenlohn ein.');
      return;
    }

    if (isNaN(schnittpreisValue) || schnittpreisValue < 0) {
      alert('Bitte geben Sie einen gültigen Schnittpreis ein.');
      return;
    }

    setMwst(mwstValue);
    setStundenlohn(stundenlohnValue);
    setSchnittpreis(schnittpreisValue);
    setEinkaufspreisFormel(localEinkaufspreisFormel);
    setAufwandsentschaedigungFormel(localAufwandsentschaedigungFormel);

    alert('Einstellungen gespeichert!');
  };

  const availableVariables = [
    { name: '{preis}', desc: 'Produktpreis' },
    { name: '{anzahl}', desc: 'Benötigte Anzahl' },
    { name: '{zeitaufwand}', desc: 'Zeitaufwand in Stunden' },
    { name: '{stundenlohn}', desc: 'Stundenlohn' },
    { name: '{schnittpreis}', desc: 'Schnittpreis' },
  ];

  return (
    <div className="einstellungen-page">
      <section className="section">
        <h2 className="section-title">Grundeinstellungen</h2>

        <div className="input-group">
          <label className="label">MwSt (%)</label>
          <div className="input-with-suffix">
            <input
              type="number"
              className="input"
              value={localMwst}
              onChange={(e) => setLocalMwst(e.target.value)}
              placeholder="19"
            />
            <span className="suffix">%</span>
          </div>
        </div>

        <div className="input-group">
          <label className="label">Stundenlohn (€)</label>
          <div className="input-with-suffix">
            <input
              type="number"
              className="input"
              value={localStundenlohn}
              onChange={(e) => setLocalStundenlohn(e.target.value)}
              placeholder="60"
            />
            <span className="suffix">€</span>
          </div>
        </div>

        <div className="input-group">
          <label className="label">Schnittpreis (€)</label>
          <div className="input-with-suffix">
            <input
              type="number"
              className="input"
              value={localSchnittpreis}
              onChange={(e) => setLocalSchnittpreis(e.target.value)}
              placeholder="60"
            />
            <span className="suffix">€</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Formeln</h2>

        <div className="info-box">
          <span className="info-icon">ℹ️</span>
          <p>Verwenden Sie Variablen in geschweiften Klammern. Beispiel: {'{preis}'} * {'{anzahl}'}</p>
        </div>

        <div className="variables-box">
          <h4 className="variables-title">Verfügbare Variablen:</h4>
          <div className="variables-list">
            {availableVariables.map((v) => (
              <div key={v.name} className="variable-item">
                <code className="variable-name">{v.name}</code>
                <span className="variable-desc">{v.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label className="label">Einkaufspreis (Brutto) - Formel</label>
          <input
            className="input formula-input"
            value={localEinkaufspreisFormel}
            onChange={(e) => setLocalEinkaufspreisFormel(e.target.value)}
            placeholder="{preis} * {anzahl}"
          />
          <p className="formula-hint">Berechnet den Gesamteinkaufspreis basierend auf der Auswahl</p>
        </div>

        <div className="input-group">
          <label className="label">Aufwandsentschädigung - Formel</label>
          <input
            className="input formula-input"
            value={localAufwandsentschaedigungFormel}
            onChange={(e) => setLocalAufwandsentschaedigungFormel(e.target.value)}
            placeholder="{zeitaufwand} * {stundenlohn}"
          />
          <p className="formula-hint">Berechnet die Arbeitskosten basierend auf dem Zeitaufwand</p>
        </div>
      </section>

      <button className="save-button" onClick={handleSave}>
        ✓ Einstellungen speichern
      </button>
    </div>
  );
}
