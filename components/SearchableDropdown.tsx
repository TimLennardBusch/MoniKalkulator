import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchableDropdownProps {
    label: string;
    value: string;
    placeholder?: string;
    availableOptions: string[];
    unavailableOptions: string[];
    onSelect: (value: string) => void;
    onClear?: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
        if (!searchText.trim()) return availableOptions;
        const search = searchText.toLowerCase();
        return availableOptions.filter((opt) =>
            opt.toLowerCase().includes(search)
        );
    }, [availableOptions, searchText]);

    const filteredUnavailable = useMemo(() => {
        if (!searchText.trim()) return unavailableOptions;
        const search = searchText.toLowerCase();
        return unavailableOptions.filter((opt) =>
            opt.toLowerCase().includes(search)
        );
    }, [unavailableOptions, searchText]);

    const handleSelect = (option: string) => {
        onSelect(option);
        setIsOpen(false);
        setSearchText('');
    };

    const handleClear = () => {
        if (onClear) {
            onClear();
        }
        setIsOpen(false);
        setSearchText('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                style={[styles.selectButton, value && styles.selectButtonSelected]}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.7}
            >
                <Text style={[styles.selectText, !value && styles.selectPlaceholder]}>
                    {value || placeholder}
                </Text>
                <View style={styles.iconContainer}>
                    {value && onClear && (
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                            style={styles.clearButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close-circle" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                    <Ionicons name="chevron-down" size={20} color="#64748b" />
                </View>
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsOpen(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{label}</Text>
                        <TouchableOpacity
                            onPress={() => setIsOpen(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={28} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Suchen..."
                            placeholderTextColor="#94a3b8"
                            value={searchText}
                            onChangeText={setSearchText}
                            autoFocus
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchText('')}>
                                <Ionicons name="close-circle" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <FlatList
                        data={[
                            ...filteredAvailable.map((opt) => ({ value: opt, available: true })),
                            ...filteredUnavailable.map((opt) => ({ value: opt, available: false })),
                        ]}
                        keyExtractor={(item, index) => `${item.value}-${index}`}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.optionItem,
                                    !item.available && styles.optionItemDisabled,
                                    item.value === value && styles.optionItemSelected,
                                ]}
                                onPress={() => item.available && handleSelect(item.value)}
                                disabled={!item.available}
                                activeOpacity={item.available ? 0.7 : 1}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        !item.available && styles.optionTextDisabled,
                                        item.value === value && styles.optionTextSelected,
                                    ]}
                                >
                                    {item.value}
                                </Text>
                                {item.value === value && (
                                    <Ionicons name="checkmark" size={20} color="#0891b2" />
                                )}
                                {!item.available && (
                                    <Text style={styles.unavailableHint}>nicht verfügbar</Text>
                                )}
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="search-outline" size={48} color="#e2e8f0" />
                                <Text style={styles.emptyText}>Keine Optionen gefunden</Text>
                            </View>
                        }
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    selectButtonSelected: {
        borderColor: '#0891b2',
        backgroundColor: '#f0fdfa',
    },
    selectText: {
        fontSize: 16,
        color: '#0f172a',
        flex: 1,
    },
    selectPlaceholder: {
        color: '#94a3b8',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    clearButton: {
        padding: 2,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
    },
    closeButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        margin: 16,
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#0f172a',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    optionItemSelected: {
        borderColor: '#0891b2',
        backgroundColor: '#f0fdfa',
    },
    optionItemDisabled: {
        backgroundColor: '#f8fafc',
        borderColor: '#f1f5f9',
    },
    optionText: {
        fontSize: 16,
        color: '#0f172a',
        flex: 1,
    },
    optionTextSelected: {
        color: '#0891b2',
        fontWeight: '600',
    },
    optionTextDisabled: {
        color: '#cbd5e1',
    },
    unavailableHint: {
        fontSize: 12,
        color: '#cbd5e1',
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#94a3b8',
        marginTop: 12,
    },
});
