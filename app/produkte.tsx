import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore, Product } from '../stores/productStore';
import ProductEditModal from '../components/ProductEditModal';
import ImportModal from '../components/ImportModal';

export default function ProdukteScreen() {
    const { products, addProduct, updateProduct, deleteProduct, importProducts, getUniqueValues } =
        useProductStore();

    const [filters, setFilters] = useState({
        produkt: '',
        typ: '',
        laenge: '',
        artikelId: '',
        preis: '',
        info: '',
    });

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [importModalVisible, setImportModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            if (filters.produkt && !p.produkt.toLowerCase().includes(filters.produkt.toLowerCase()))
                return false;
            if (filters.typ && !p.typ.toLowerCase().includes(filters.typ.toLowerCase())) return false;
            if (filters.laenge && !p.laenge.toLowerCase().includes(filters.laenge.toLowerCase()))
                return false;
            if (
                filters.artikelId &&
                !p.artikelId.toLowerCase().includes(filters.artikelId.toLowerCase())
            )
                return false;
            if (filters.preis && !p.preis.toString().includes(filters.preis)) return false;
            if (filters.info && !p.info.toLowerCase().includes(filters.info.toLowerCase())) return false;
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
        Alert.alert(
            'Produkt löschen',
            `Möchten Sie "${product.produkt}" wirklich löschen?`,
            [
                { text: 'Abbrechen', style: 'cancel' },
                {
                    text: 'Löschen',
                    style: 'destructive',
                    onPress: () => deleteProduct(product.id),
                },
            ]
        );
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
    };

    const handleImport = (newProducts: Omit<Product, 'id'>[]) => {
        const productsWithIds = newProducts.map((p) => ({
            ...p,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        }));
        importProducts(productsWithIds);
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR',
        });
    };

    const existingBehandlungen = getUniqueValues('behandlung');

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <StatusBar style="dark" />

            {/* Header Actions */}
            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => setImportModalVisible(true)}>
                    <Ionicons name="cloud-upload-outline" size={18} color="#0891b2" />
                    <Text style={styles.actionButtonText}>CSV Import</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleAddNew}>
                    <Ionicons name="add" size={18} color="#ffffff" />
                    <Text style={styles.primaryButtonText}>Neu</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Row */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TextInput
                        style={styles.filterInput}
                        placeholder="Produkt"
                        placeholderTextColor="#94a3b8"
                        value={filters.produkt}
                        onChangeText={(text) => setFilters({ ...filters, produkt: text })}
                    />
                    <TextInput
                        style={styles.filterInput}
                        placeholder="Typ"
                        placeholderTextColor="#94a3b8"
                        value={filters.typ}
                        onChangeText={(text) => setFilters({ ...filters, typ: text })}
                    />
                    <TextInput
                        style={styles.filterInput}
                        placeholder="Länge"
                        placeholderTextColor="#94a3b8"
                        value={filters.laenge}
                        onChangeText={(text) => setFilters({ ...filters, laenge: text })}
                    />
                    <TextInput
                        style={styles.filterInput}
                        placeholder="Artikel-ID"
                        placeholderTextColor="#94a3b8"
                        value={filters.artikelId}
                        onChangeText={(text) => setFilters({ ...filters, artikelId: text })}
                    />
                    <TextInput
                        style={styles.filterInput}
                        placeholder="Preis"
                        placeholderTextColor="#94a3b8"
                        value={filters.preis}
                        onChangeText={(text) => setFilters({ ...filters, preis: text })}
                        keyboardType="decimal-pad"
                    />
                </ScrollView>
            </View>

            {/* Product Count */}
            <View style={styles.countContainer}>
                <Text style={styles.countText}>
                    {filteredProducts.length} von {products.length} Produkte(n)
                </Text>
            </View>

            {/* Product List */}
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                {filteredProducts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cube-outline" size={64} color="#e2e8f0" />
                        <Text style={styles.emptyTitle}>Keine Produkte</Text>
                        <Text style={styles.emptyText}>
                            Fügen Sie Produkte hinzu oder importieren Sie sie per CSV.
                        </Text>
                        <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
                            <Ionicons name="add-circle-outline" size={20} color="#0891b2" />
                            <Text style={styles.emptyButtonText}>Erstes Produkt anlegen</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    filteredProducts.map((product) => (
                        <View key={product.id} style={styles.productCard}>
                            <View style={styles.productHeader}>
                                <View style={styles.productTitleRow}>
                                    <Text style={styles.productName}>{product.produkt}</Text>
                                    <Text style={styles.productPrice}>{formatCurrency(product.preis)}</Text>
                                </View>
                                <View style={styles.productActions}>
                                    <TouchableOpacity
                                        style={styles.iconButton}
                                        onPress={() => handleEdit(product)}
                                    >
                                        <Ionicons name="pencil-outline" size={18} color="#64748b" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.iconButton}
                                        onPress={() => handleDelete(product)}
                                    >
                                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.productDetails}>
                                <View style={styles.detailChip}>
                                    <Text style={styles.detailLabel}>Behandlung</Text>
                                    <Text style={styles.detailValue}>{product.behandlung || '-'}</Text>
                                </View>
                                <View style={styles.detailChip}>
                                    <Text style={styles.detailLabel}>Typ</Text>
                                    <Text style={styles.detailValue}>{product.typ || '-'}</Text>
                                </View>
                                <View style={styles.detailChip}>
                                    <Text style={styles.detailLabel}>Länge</Text>
                                    <Text style={styles.detailValue}>{product.laenge || '-'}</Text>
                                </View>
                            </View>

                            {(product.artikelId || product.info) && (
                                <View style={styles.productFooter}>
                                    {product.artikelId && (
                                        <Text style={styles.footerText}>ID: {product.artikelId}</Text>
                                    )}
                                    {product.info && (
                                        <Text style={styles.footerText} numberOfLines={1}>
                                            {product.info}
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                    ))
                )}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Modals */}
            <ProductEditModal
                visible={editModalVisible}
                product={editingProduct}
                onClose={() => setEditModalVisible(false)}
                onSave={handleSaveProduct}
                existingBehandlungen={existingBehandlungen}
            />

            <ImportModal
                visible={importModalVisible}
                onClose={() => setImportModalVisible(false)}
                onImport={handleImport}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    headerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0891b2',
    },
    primaryButton: {
        backgroundColor: '#0891b2',
        borderColor: '#0891b2',
    },
    primaryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    filterContainer: {
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    filterInput: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#0f172a',
        marginRight: 8,
        minWidth: 100,
    },
    countContainer: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    countText: {
        fontSize: 13,
        color: '#94a3b8',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    productCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    productTitleRow: {
        flex: 1,
    },
    productName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0891b2',
    },
    productActions: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 8,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
    },
    productDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    detailChip: {
        backgroundColor: '#f8fafc',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    detailLabel: {
        fontSize: 10,
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 13,
        color: '#475569',
        fontWeight: '500',
    },
    productFooter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    footerText: {
        fontSize: 12,
        color: '#94a3b8',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#475569',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 15,
        color: '#94a3b8',
        textAlign: 'center',
        paddingHorizontal: 40,
        marginBottom: 24,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#f0fdfa',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#99f6e4',
    },
    emptyButtonText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#0891b2',
    },
});
