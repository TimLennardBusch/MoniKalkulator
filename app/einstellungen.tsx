import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../stores/settingsStore';

export default function EinstellungenScreen() {
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
            Alert.alert('Fehler', 'Bitte geben Sie einen gültigen MwSt-Satz (0-100%) ein.');
            return;
        }

        if (isNaN(stundenlohnValue) || stundenlohnValue < 0) {
            Alert.alert('Fehler', 'Bitte geben Sie einen gültigen Stundenlohn ein.');
            return;
        }

        if (isNaN(schnittpreisValue) || schnittpreisValue < 0) {
            Alert.alert('Fehler', 'Bitte geben Sie einen gültigen Schnittpreis ein.');
            return;
        }

        setMwst(mwstValue);
        setStundenlohn(stundenlohnValue);
        setSchnittpreis(schnittpreisValue);
        setEinkaufspreisFormel(localEinkaufspreisFormel);
        setAufwandsentschaedigungFormel(localAufwandsentschaedigungFormel);

        Alert.alert('Gespeichert', 'Ihre Einstellungen wurden gespeichert.');
    };

    const availableVariables = [
        { name: '{preis}', desc: 'Produktpreis' },
        { name: '{anzahl}', desc: 'Benötigte Anzahl' },
        { name: '{zeitaufwand}', desc: 'Zeitaufwand in Stunden' },
        { name: '{stundenlohn}', desc: 'Stundenlohn' },
        { name: '{schnittpreis}', desc: 'Schnittpreis' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Basic Settings */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Grundeinstellungen</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>MwSt (%)</Text>
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={[styles.input, styles.inputWithSuffix]}
                                    value={localMwst}
                                    onChangeText={setLocalMwst}
                                    keyboardType="decimal-pad"
                                    placeholder="19"
                                    placeholderTextColor="#94a3b8"
                                />
                                <View style={styles.suffix}>
                                    <Text style={styles.suffixText}>%</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Stundenlohn (€)</Text>
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={[styles.input, styles.inputWithSuffix]}
                                    value={localStundenlohn}
                                    onChangeText={setLocalStundenlohn}
                                    keyboardType="decimal-pad"
                                    placeholder="60"
                                    placeholderTextColor="#94a3b8"
                                />
                                <View style={styles.suffix}>
                                    <Text style={styles.suffixText}>€</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Schnittpreis (€)</Text>
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={[styles.input, styles.inputWithSuffix]}
                                    value={localSchnittpreis}
                                    onChangeText={setLocalSchnittpreis}
                                    keyboardType="decimal-pad"
                                    placeholder="60"
                                    placeholderTextColor="#94a3b8"
                                />
                                <View style={styles.suffix}>
                                    <Text style={styles.suffixText}>€</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Formulas Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Formeln</Text>

                        <View style={styles.infoBox}>
                            <Ionicons name="information-circle-outline" size={20} color="#0891b2" />
                            <Text style={styles.infoText}>
                                Verwenden Sie Variablen in geschweiften Klammern. Beispiel: {'{preis}'} * {'{anzahl}'}
                            </Text>
                        </View>

                        <View style={styles.variablesBox}>
                            <Text style={styles.variablesTitle}>Verfügbare Variablen:</Text>
                            <View style={styles.variablesList}>
                                {availableVariables.map((v) => (
                                    <View key={v.name} style={styles.variableItem}>
                                        <Text style={styles.variableName}>{v.name}</Text>
                                        <Text style={styles.variableDesc}>{v.desc}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Einkaufspreis (Brutto) - Formel</Text>
                            <TextInput
                                style={[styles.input, styles.formulaInput]}
                                value={localEinkaufspreisFormel}
                                onChangeText={setLocalEinkaufspreisFormel}
                                placeholder="{preis} * {anzahl}"
                                placeholderTextColor="#94a3b8"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Text style={styles.formulaHint}>
                                Berechnet den Gesamteinkaufspreis basierend auf der Auswahl
                            </Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Aufwandsentschädigung - Formel</Text>
                            <TextInput
                                style={[styles.input, styles.formulaInput]}
                                value={localAufwandsentschaedigungFormel}
                                onChangeText={setLocalAufwandsentschaedigungFormel}
                                placeholder="{zeitaufwand} * {stundenlohn}"
                                placeholderTextColor="#94a3b8"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Text style={styles.formulaHint}>
                                Berechnet die Arbeitskosten basierend auf dem Zeitaufwand
                            </Text>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
                        <Text style={styles.saveButtonText}>Einstellungen speichern</Text>
                    </TouchableOpacity>

                    <View style={{ height: 60 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    flex: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 16,
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
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
        flex: 1,
    },
    inputWithSuffix: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRightWidth: 0,
    },
    suffix: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    suffixText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748b',
    },
    formulaInput: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 15,
    },
    formulaHint: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 6,
        fontStyle: 'italic',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f0fdfa',
        padding: 14,
        borderRadius: 12,
        marginBottom: 16,
        gap: 10,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#0891b2',
        lineHeight: 20,
    },
    variablesBox: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    variablesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 12,
    },
    variablesList: {
        gap: 8,
    },
    variableItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    variableName: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 13,
        color: '#0891b2',
        backgroundColor: '#f0fdfa',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        overflow: 'hidden',
    },
    variableDesc: {
        fontSize: 13,
        color: '#64748b',
        flex: 1,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#0891b2',
        padding: 16,
        borderRadius: 14,
        shadowColor: '#0891b2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});
