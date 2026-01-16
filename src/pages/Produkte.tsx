import { useState, useMemo } from 'react';
import { useProductStore, type Product } from '../stores/productStore';
import ImportModal from '../components/ImportModal';
import './Produkte.css';

export default function Produkte() {
  const { products, addProduct, updateProduct, deleteProduct, getUniqueValues, importProducts } =
    useProductStore();

  const [filters, setFilters] = useState({
    produkt: '',
    typ: '',
    laenge: '',
    artikelId: '',
    preis: '',
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filters.produkt && !p.produkt.toLowerCase().includes(filters.produkt.toLowerCase())) return false;
      if (filters.typ && !p.typ.toLowerCase().includes(filters.typ.toLowerCase())) return false;
      if (filters.laenge && !p.laenge.toLowerCase().includes(filters.laenge.toLowerCase())) return false;
      if (filters.artikelId && !p.artikelId.toLowerCase().includes(filters.artikelId.toLowerCase())) return false;
      if (filters.preis && !p.preis.toString().includes(filters.preis)) return false;
      return true;
    });
  }, [products, filters]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setEditModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditModalVisible(true);
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Möchten Sie "${product.produkt}" wirklich löschen?`)) {
      deleteProduct(product.id);
    }
  };

  const handleSaveProduct = (data: Omit<Product, 'id'> | Product) => {
    if ('id' in data && data.id) {
      updateProduct(data.id, data);
    } else {
      addProduct({
        ...data,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      } as Product);
    }
    setEditModalVisible(false);
  };

  const handleImport = (products: Omit<Product, 'id'>[]) => {
    const newProducts: Product[] = products.map((p) => ({
      ...p,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }));
    importProducts(newProducts);
    setImportModalVisible(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  };

  const existingBehandlungen = getUniqueValues('behandlung');

  return (
    <div className="produkte-page">
      <div className="header-actions">
        <button className="action-button" onClick={() => setImportModalVisible(true)}>
          📋 Import
        </button>
        <button className="action-button primary" onClick={handleAddNew}>
          + Neu
        </button>
      </div>

      <div className="filter-container">
        <input
          className="filter-input"
          placeholder="Produkt"
          value={filters.produkt}
          onChange={(e) => setFilters({ ...filters, produkt: e.target.value })}
        />
        <input
          className="filter-input"
          placeholder="Typ"
          value={filters.typ}
          onChange={(e) => setFilters({ ...filters, typ: e.target.value })}
        />
        <input
          className="filter-input"
          placeholder="Länge"
          value={filters.laenge}
          onChange={(e) => setFilters({ ...filters, laenge: e.target.value })}
        />
      </div>

      <div className="count-container">
        <span className="count-text">{filteredProducts.length} von {products.length} Produkte(n)</span>
      </div>

      <div className="product-list">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>Keine Produkte</h3>
            <p>Fügen Sie Produkte hinzu.</p>
            <button className="empty-button" onClick={handleAddNew}>
              + Erstes Produkt anlegen
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-header">
                <div className="product-title-row">
                  <span className="product-name">{product.produkt}</span>
                  <span className="product-price">{formatCurrency(product.preis)}</span>
                </div>
                <div className="product-actions">
                  <button className="icon-button" onClick={() => handleEdit(product)}>✏️</button>
                  <button className="icon-button delete" onClick={() => handleDelete(product)}>🗑️</button>
                </div>
              </div>
              <div className="product-details">
                <div className="detail-chip">
                  <span className="detail-label">Behandlung</span>
                  <span className="detail-value">{product.behandlung || '-'}</span>
                </div>
                <div className="detail-chip">
                  <span className="detail-label">Typ</span>
                  <span className="detail-value">{product.typ || '-'}</span>
                </div>
                <div className="detail-chip">
                  <span className="detail-label">Länge</span>
                  <span className="detail-value">{product.laenge || '-'}</span>
                </div>
              </div>
              {(product.artikelId || product.info) && (
                <div className="product-footer">
                  {product.artikelId && <span>ID: {product.artikelId}</span>}
                  {product.info && <span>{product.info}</span>}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {editModalVisible && (
        <ProductEditModal
          product={editingProduct}
          existingBehandlungen={existingBehandlungen}
          onSave={handleSaveProduct}
          onClose={() => setEditModalVisible(false)}
        />
      )}

      {importModalVisible && (
        <ImportModal
          existingBehandlungen={existingBehandlungen}
          onImport={handleImport}
          onClose={() => setImportModalVisible(false)}
        />
      )}
    </div>
  );
}

interface ProductEditModalProps {
  product: Product | null;
  existingBehandlungen: string[];
  onSave: (data: Omit<Product, 'id'> | Product) => void;
  onClose: () => void;
}

function ProductEditModal({ product, existingBehandlungen, onSave, onClose }: ProductEditModalProps) {
  const [formData, setFormData] = useState({
    behandlung: product?.behandlung || '',
    produkt: product?.produkt || '',
    typ: product?.typ || '',
    laenge: product?.laenge || '',
    artikelId: product?.artikelId || '',
    preis: product?.preis?.toString() || '',
    info: product?.info || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.behandlung.trim() || !formData.produkt.trim() || !formData.preis) {
      alert('Bitte füllen Sie Behandlung, Produkt und Preis aus.');
      return;
    }
    const data = {
      ...(product?.id ? { id: product.id } : {}),
      behandlung: formData.behandlung.trim(),
      produkt: formData.produkt.trim(),
      typ: formData.typ.trim(),
      laenge: formData.laenge.trim(),
      artikelId: formData.artikelId.trim(),
      preis: parseFloat(formData.preis) || 0,
      info: formData.info.trim(),
    };
    onSave(data as Product);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="text-button" onClick={onClose}>Abbrechen</button>
          <h3>{product ? 'Produkt bearbeiten' : 'Neues Produkt'}</h3>
          <button className="text-button primary" onClick={handleSubmit}>Speichern</button>
        </div>
        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Behandlung *</label>
            <input
              value={formData.behandlung}
              onChange={(e) => setFormData({ ...formData, behandlung: e.target.value })}
              placeholder="z.B. Einsetzen"
            />
            {existingBehandlungen.length > 0 && (
              <div className="suggestions">
                {existingBehandlungen.slice(0, 5).map((b) => (
                  <button
                    key={b}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => setFormData({ ...formData, behandlung: b })}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Produkt *</label>
            <input
              value={formData.produkt}
              onChange={(e) => setFormData({ ...formData, produkt: e.target.value })}
              placeholder="z.B. Easy Invisible"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Typ</label>
              <input
                value={formData.typ}
                onChange={(e) => setFormData({ ...formData, typ: e.target.value })}
                placeholder="z.B. 3,5 OM"
              />
            </div>
            <div className="form-group">
              <label>Länge</label>
              <input
                value={formData.laenge}
                onChange={(e) => setFormData({ ...formData, laenge: e.target.value })}
                placeholder="z.B. 40 cm"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Artikel-ID</label>
              <input
                value={formData.artikelId}
                onChange={(e) => setFormData({ ...formData, artikelId: e.target.value })}
                placeholder="z.B. 18602360"
              />
            </div>
            <div className="form-group">
              <label>Preis (€) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.preis}
                onChange={(e) => setFormData({ ...formData, preis: e.target.value })}
                placeholder="0,00"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Info</label>
            <textarea
              value={formData.info}
              onChange={(e) => setFormData({ ...formData, info: e.target.value })}
              placeholder="Zusätzliche Informationen..."
              rows={3}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
