import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import SearchableDropdown from "../components/SearchableDropdown";
import { useProductStore, Product } from "../stores/productStore";
import { useSettingsStore, parseFormula } from "../stores/settingsStore";

type SelectionKeys = "behandlung" | "produkt" | "typ" | "laenge";

export default function KalkulationScreen() {
  const { products, getFilteredOptions } = useProductStore();
  const {
    mwst,
    stundenlohn,
    schnittpreis,
    einkaufspreisFormel,
    aufwandsentschaedigungFormel,
  } = useSettingsStore();

  const [selection, setSelection] = useState<Record<SelectionKeys, string>>({
    behandlung: "",
    produkt: "",
    typ: "",
    laenge: "",
  });

  const [anzahl, setAnzahl] = useState("1");
  const [zeitaufwand, setZeitaufwand] = useState("");

  // Get filtered options for each dropdown
  const behandlungOptions = useMemo(
    () => getFilteredOptions("behandlung", selection),
    [products, selection]
  );
  const produktOptions = useMemo(
    () => getFilteredOptions("produkt", selection),
    [products, selection]
  );
  const typOptions = useMemo(
    () => getFilteredOptions("typ", selection),
    [products, selection]
  );
  const laengeOptions = useMemo(
    () => getFilteredOptions("laenge", selection),
    [products, selection]
  );

  // Find selected product
  const selectedProduct = useMemo(() => {
    if (!selection.behandlung || !selection.produkt) return null;

    return products.find((p) => {
      const matches =
        p.behandlung === selection.behandlung &&
        p.produkt === selection.produkt;
      if (!matches) return false;
      if (selection.typ && p.typ !== selection.typ) return false;
      if (selection.laenge && p.laenge !== selection.laenge) return false;
      return true;
    });
  }, [products, selection]);

  // Calculate prices
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
    const aufwandsentschaedigung = parseFormula(
      aufwandsentschaedigungFormel,
      variables
    );
    const mwstBetrag = einkaufspreisBrutto * (mwst / 100);
    const gesamtpreis = einkaufspreisBrutto + aufwandsentschaedigung;

    return {
      einkaufspreisBrutto,
      mwstBetrag,
      aufwandsentschaedigung,
      gesamtpreis,
    };
  }, [
    selectedProduct,
    anzahl,
    zeitaufwand,
    mwst,
    stundenlohn,
    schnittpreis,
    einkaufspreisFormel,
    aufwandsentschaedigungFormel,
  ]);

  const handleSelect = (field: SelectionKeys, value: string) => {
    setSelection((prev) => ({ ...prev, [field]: value }));
  };

  const handleClear = (field: SelectionKeys) => {
    setSelection((prev) => ({ ...prev, [field]: "" }));
  };

  const handleReset = () => {
    setSelection({ behandlung: "", produkt: "", typ: "", laenge: "" });
    setAnzahl("1");
    setZeitaufwand("");
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Produktauswahl</Text>

            <SearchableDropdown
              label="Behandlung"
              value={selection.behandlung}
              placeholder="Behandlung auswählen"
              availableOptions={behandlungOptions.available}
              unavailableOptions={behandlungOptions.unavailable}
              onSelect={(v) => handleSelect("behandlung", v)}
              onClear={() => handleClear("behandlung")}
            />

            <SearchableDropdown
              label="Produkt"
              value={selection.produkt}
              placeholder="Produkt auswählen"
              availableOptions={produktOptions.available}
              unavailableOptions={produktOptions.unavailable}
              onSelect={(v) => handleSelect("produkt", v)}
              onClear={() => handleClear("produkt")}
            />

            <SearchableDropdown
              label="Typ"
              value={selection.typ}
              placeholder="Typ auswählen"
              availableOptions={typOptions.available}
              unavailableOptions={typOptions.unavailable}
              onSelect={(v) => handleSelect("typ", v)}
              onClear={() => handleClear("typ")}
            />

            <SearchableDropdown
              label="Länge"
              value={selection.laenge}
              placeholder="Länge auswählen"
              availableOptions={laengeOptions.available}
              unavailableOptions={laengeOptions.unavailable}
              onSelect={(v) => handleSelect("laenge", v)}
              onClear={() => handleClear("laenge")}
            />
          </View>

          {/* Product Info */}
          {selectedProduct && (
            <View style={styles.productInfoCard}>
              <View style={styles.productInfoRow}>
                <Text style={styles.productInfoLabel}>
                  Einkaufspreis (Brutto) pro Stück
                </Text>
                <Text style={styles.productInfoValue}>
                  {formatCurrency(selectedProduct.preis)}
                </Text>
              </View>
              {selectedProduct.artikelId && (
                <View style={styles.productInfoRow}>
                  <Text style={styles.productInfoLabel}>Artikel-ID</Text>
                  <Text style={styles.productInfoValueSmall}>
                    {selectedProduct.artikelId}
                  </Text>
                </View>
              )}
              {selectedProduct.info && (
                <View style={styles.productInfoRow}>
                  <Text style={styles.productInfoLabel}>Info</Text>
                  <Text style={styles.productInfoValueSmall}>
                    {selectedProduct.info}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Quantity & Time Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mengen & Zeitaufwand</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Benötigte Anzahl</Text>
              <TextInput
                style={styles.input}
                value={anzahl}
                onChangeText={setAnzahl}
                keyboardType="number-pad"
                placeholder="1"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Zeitaufwand (Stunden)</Text>
              <TextInput
                style={styles.input}
                value={zeitaufwand}
                onChangeText={setZeitaufwand}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          {/* Calculation Results */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kalkulation</Text>

            <View style={styles.calculationCard}>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Einkaufspreis (Brutto)</Text>
                <Text style={styles.calcValue}>
                  {formatCurrency(calculations.einkaufspreisBrutto)}
                </Text>
              </View>

              <View style={styles.calcRow}>
                <Text style={styles.calcLabelSmall}>davon MwSt ({mwst}%)</Text>
                <Text style={styles.calcValueSmall}>
                  {formatCurrency(calculations.mwstBetrag)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Stundenlohn</Text>
                <Text style={styles.calcValue}>
                  {formatCurrency(stundenlohn)}
                </Text>
              </View>

              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Schnittpreis</Text>
                <Text style={styles.calcValue}>
                  {formatCurrency(schnittpreis)}
                </Text>
              </View>

              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Aufwandsentschädigung</Text>
                <Text style={styles.calcValue}>
                  {formatCurrency(calculations.aufwandsentschaedigung)}
                </Text>
              </View>
            </View>
          </View>

          {/* Spacer for summary */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Fixed Summary at Bottom */}
        <View style={styles.bottomContainer}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Einkaufspreis (Brutto)</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(calculations.einkaufspreisBrutto)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Aufwandsentschädigung</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(calculations.aufwandsentschaedigung)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Gesamtpreis</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(calculations.gesamtpreis)}
              </Text>
            </View>
          </View>
          {(selection.behandlung ||
            selection.produkt ||
            selection.typ ||
            selection.laenge) && (
            <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
              <Ionicons name="refresh-outline" size={16} color="#0891b2" />
              <Text style={styles.resetText}>Zurücksetzen</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
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
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  resetButton: {
    flexDirection: "row",
    backgroundColor: "#f0fdfa",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  resetText: {
    fontSize: 14,
    color: "#0891b2",
    fontWeight: "500",
  },
  productInfoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  productInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  productInfoLabel: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },
  productInfoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  productInfoValueSmall: {
    fontSize: 14,
    color: "#475569",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0f172a",
  },
  calculationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  calcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  calcLabel: {
    fontSize: 15,
    color: "#475569",
  },
  calcLabelSmall: {
    fontSize: 13,
    color: "#94a3b8",
    paddingLeft: 16,
  },
  calcValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  calcValueSmall: {
    fontSize: 13,
    color: "#94a3b8",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  summaryValue: {
    fontSize: 14,
    color: "#475569",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0891b2",
  },
});
