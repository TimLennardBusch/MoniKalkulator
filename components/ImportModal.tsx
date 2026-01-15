import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../stores/productStore';

interface ImportModalProps {
    visible: boolean;
    onClose: () => void;
    onImport: (products: Omit<Product, 'id'>[]) => void;
}

const COLUMNS = ['behandlung', 'produkt', 'typ', 'laenge', 'artikelId', 'preis', 'info'] as const;
const COLUMN_LABELS = ['Behandlung', 'Produkt', 'Typ', 'Länge', 'Artikel-ID', 'Preis', 'Info'];

interface RowData {
    behandlung: string;
    produkt: string;
    typ: string;
    laenge: string;
    artikelId: string;
    preis: string;
    info: string;
}

const emptyRow = (): RowData => ({
    behandlung: '',
    produkt: '',
    typ: '',
    laenge: '',
    artikelId: '',
    preis: '',
    info: '',
});

export default function ImportModal({ visible, onClose, onImport }: ImportModalProps) {
    const [rows, setRows] = useState<RowData[]>([emptyRow(), emptyRow(), emptyRow()]);

    React.useEffect(() => {
        if (visible) {
            setRows([emptyRow(), emptyRow(), emptyRow()]);
        }
    }, [visible]);

    const updateCell = (rowIndex: number, column: keyof RowData, value: string) => {
        setRows((prev) =>
            prev.map((row, idx) =>
                idx === rowIndex ? { ...row, [column]: value } : row
            )
        );
    };

    const addRow = () => {
        setRows((prev) => [...prev, emptyRow()]);
    };

    const removeRow = (index: number) => {
        if (rows.length <= 1) return;
        setRows((prev) => prev.filter((_, idx) => idx !== index));
    };

    const handleImport = () => {
        // Filter out empty rows and validate
        const validRows = rows.filter(
            (row) => row.behandlung.trim() && row.produkt.trim() && row.preis.trim()
        );

        if (validRows.length === 0) {
            Alert.alert(
                'Keine gültigen Daten',
                'Bitte füllen Sie mindestens Behandlung, Produkt und Preis aus.'
            );
            return;
        }

        // Check for invalid prices
        const invalidPrices = validRows.filter((row) => isNaN(parseFloat(row.preis)));
        if (invalidPrices.length > 0) {
            Alert.alert('Ungültige Preise', 'Einige Preise sind ungültig. Bitte nur Zahlen eingeben.');
            return;
        }

        const products = validRows.map((row) => ({
            behandlung: row.behandlung.trim(),
            produkt: row.produkt.trim(),
            typ: row.typ.trim(),
            laenge: row.laenge.trim(),
            artikelId: row.artikelId.trim(),
            preis: parseFloat(row.preis),
            info: row.info.trim(),
        }));

        onImport(products);
        onClose();
        Alert.alert('Erfolg', `${products.length} Produkt(e) importiert.`);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                        <Text style={styles.cancelText}>Abbrechen</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Massenimport</Text>
                    <TouchableOpacity onPress={handleImport} style={styles.headerButton}>
                        <Text style={styles.importText}>Importieren</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={20} color="#0891b2" />
                    <Text style={styles.infoText}>
                        Füllen Sie die Tabelle aus. Pflichtfelder: Behandlung, Produkt, Preis
                    </Text>
                </View>

                <ScrollView style={styles.tableContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <View>
                            {/* Header */}
                            <View style={styles.tableRow}>
                                <View style={styles.rowNumber}>
                                    <Text style={styles.headerText}>#</Text>
                                </View>
                                {COLUMN_LABELS.map((label, idx) => (
                                    <View key={idx} style={styles.headerCell}>
                                        <Text style={styles.headerText}>{label}</Text>
                                    </View>
                                ))}
                                <View style={styles.actionCell}>
                                    <Text style={styles.headerText}></Text>
                                </View>
                            </View>

                            {/* Data rows */}
                            {rows.map((row, rowIdx) => (
                                <View key={rowIdx} style={styles.tableRow}>
                                    <View style={styles.rowNumber}>
                                        <Text style={styles.rowNumberText}>{rowIdx + 1}</Text>
                                    </View>
                                    {COLUMNS.map((col) => (
                                        <View key={col} style={styles.cell}>
                                            <TextInput
                                                style={styles.cellInput}
                                                value={row[col]}
                                                onChangeText={(text) => updateCell(rowIdx, col, text)}
                                                placeholder="..."
                                                placeholderTextColor="#cbd5e1"
                                                keyboardType={col === 'preis' ? 'decimal-pad' : 'default'}
                                            />
                                        </View>
                                    ))}
                                    <View style={styles.actionCell}>
                                        <TouchableOpacity
                                            onPress={() => removeRow(rowIdx)}
                                            disabled={rows.length <= 1}
                                            style={[styles.deleteButton, rows.length <= 1 && styles.deleteButtonDisabled]}
                                        >
                                            <Ionicons
                                                name="trash-outline"
                                                size={18}
                                                color={rows.length <= 1 ? '#e2e8f0' : '#ef4444'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </ScrollView>

                <TouchableOpacity style={styles.addRowButton} onPress={addRow}>
                    <Ionicons name="add-circle-outline" size={20} color="#0891b2" />
                    <Text style={styles.addRowText}>Zeile hinzufügen</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerButton: {
        padding: 4,
        minWidth: 80,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
    },
    cancelText: {
        fontSize: 16,
        color: '#64748b',
    },
    importText: {
        fontSize: 16,
        color: '#0891b2',
        fontWeight: '600',
        textAlign: 'right',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdfa',
        padding: 12,
        margin: 16,
        borderRadius: 12,
        gap: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#0891b2',
    },
    tableContainer: {
        flex: 1,
        marginHorizontal: 16,
    },
    tableRow: {
        flexDirection: 'row',
    },
    rowNumber: {
        width: 40,
        padding: 12,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#e2e8f0',
    },
    rowNumberText: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '500',
    },
    headerCell: {
        width: 110,
        padding: 12,
        backgroundColor: '#f1f5f9',
        borderBottomWidth: 1,
        borderColor: '#e2e8f0',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
        textTransform: 'uppercase',
    },
    cell: {
        width: 110,
        padding: 4,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderColor: '#e2e8f0',
    },
    cellInput: {
        padding: 8,
        fontSize: 14,
        color: '#0f172a',
    },
    actionCell: {
        width: 50,
        padding: 12,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#e2e8f0',
    },
    deleteButton: {
        padding: 4,
    },
    deleteButtonDisabled: {
        opacity: 0.5,
    },
    addRowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        margin: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        gap: 8,
    },
    addRowText: {
        fontSize: 16,
        color: '#0891b2',
        fontWeight: '500',
    },
});
