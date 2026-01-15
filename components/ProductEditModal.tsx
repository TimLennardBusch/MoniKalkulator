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
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../stores/productStore';

interface ProductEditModalProps {
    visible: boolean;
    product?: Product | null;
    onClose: () => void;
    onSave: (product: Omit<Product, 'id'> | Product) => void;
    existingBehandlungen: string[];
}

export default function ProductEditModal({
    visible,
    product,
    onClose,
    onSave,
    existingBehandlungen,
}: ProductEditModalProps) {
    const [formData, setFormData] = useState({
        behandlung: product?.behandlung || '',
        produkt: product?.produkt || '',
        typ: product?.typ || '',
        laenge: product?.laenge || '',
        artikelId: product?.artikelId || '',
        preis: product?.preis?.toString() || '',
        info: product?.info || '',
    });

    React.useEffect(() => {
        if (visible) {
            setFormData({
                behandlung: product?.behandlung || '',
                produkt: product?.produkt || '',
                typ: product?.typ || '',
                laenge: product?.laenge || '',
                artikelId: product?.artikelId || '',
                preis: product?.preis?.toString() || '',
                info: product?.info || '',
            });
        }
    }, [visible, product]);

    const handleSave = () => {
        // Validation
        if (!formData.behandlung.trim()) {
            Alert.alert('Fehler', 'Bitte geben Sie eine Behandlung ein.');
            return;
        }
        if (!formData.produkt.trim()) {
            Alert.alert('Fehler', 'Bitte geben Sie einen Produktnamen ein.');
            return;
        }
        if (!formData.preis || isNaN(parseFloat(formData.preis))) {
            Alert.alert('Fehler', 'Bitte geben Sie einen gültigen Preis ein.');
            return;
        }

        const productData = {
            ...(product?.id ? { id: product.id } : {}),
            behandlung: formData.behandlung.trim(),
            produkt: formData.produkt.trim(),
            typ: formData.typ.trim(),
            laenge: formData.laenge.trim(),
            artikelId: formData.artikelId.trim(),
            preis: parseFloat(formData.preis),
            info: formData.info.trim(),
        };

        onSave(productData as any);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                        <Text style={styles.cancelText}>Abbrechen</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        {product ? 'Produkt bearbeiten' : 'Neues Produkt'}
                    </Text>
                    <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                        <Text style={styles.saveText}>Speichern</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.form}
                    contentContainerStyle={styles.formContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Behandlung *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.behandlung}
                            onChangeText={(text) => setFormData({ ...formData, behandlung: text })}
                            placeholder="z.B. Einsetzen"
                            placeholderTextColor="#94a3b8"
                        />
                        {existingBehandlungen.length > 0 && (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.suggestions}
                            >
                                {existingBehandlungen.slice(0, 5).map((b) => (
                                    <TouchableOpacity
                                        key={b}
                                        style={styles.suggestionChip}
                                        onPress={() => setFormData({ ...formData, behandlung: b })}
                                    >
                                        <Text style={styles.suggestionText}>{b}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Produkt *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.produkt}
                            onChangeText={(text) => setFormData({ ...formData, produkt: text })}
                            placeholder="z.B. Easy Invisible"
                            placeholderTextColor="#94a3b8"
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Typ</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.typ}
                                onChangeText={(text) => setFormData({ ...formData, typ: text })}
                                placeholder="z.B. 3,5 OM"
                                placeholderTextColor="#94a3b8"
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Länge</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.laenge}
                                onChangeText={(text) => setFormData({ ...formData, laenge: text })}
                                placeholder="z.B. 40 cm"
                                placeholderTextColor="#94a3b8"
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Artikel-ID</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.artikelId}
                                onChangeText={(text) => setFormData({ ...formData, artikelId: text })}
                                placeholder="z.B. 18602360"
                                placeholderTextColor="#94a3b8"
                                keyboardType="default"
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Preis (€) *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.preis}
                                onChangeText={(text) => setFormData({ ...formData, preis: text })}
                                placeholder="0,00"
                                placeholderTextColor="#94a3b8"
                                keyboardType="decimal-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Info</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.info}
                            onChangeText={(text) => setFormData({ ...formData, info: text })}
                            placeholder="Zusätzliche Informationen..."
                            placeholderTextColor="#94a3b8"
                            multiline
                            numberOfLines={3}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingTop: 16,
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
    saveText: {
        fontSize: 16,
        color: '#0891b2',
        fontWeight: '600',
        textAlign: 'right',
    },
    form: {
        flex: 1,
    },
    formContent: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#0f172a',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 14,
    },
    row: {
        flexDirection: 'row',
    },
    suggestions: {
        marginTop: 8,
    },
    suggestionChip: {
        backgroundColor: '#f0fdfa',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#99f6e4',
    },
    suggestionText: {
        fontSize: 14,
        color: '#0891b2',
    },
});
