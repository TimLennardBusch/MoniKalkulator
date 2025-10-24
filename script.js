// Warten, bis das HTML-Dokument geladen ist
document.addEventListener("DOMContentLoaded", () => {
    
    // ======== GLOBALE VARIABLEN & DATENBANK ========
    
    // Die Produktdatenbank (wird im Speicher gehalten)
    let productDB = [];
    
    // ID des Eintrags, der gerade bearbeitet wird (null = neu)
    let currentEditId = null; 
    
    // Referenzen zu den HTML-Elementen (Kalkulation)
    const calc = {
        produkt: document.getElementById("calc-produkt"),
        typ: document.getElementById("calc-typ"),
        laenge: document.getElementById("calc-laenge"),
        preisOut: document.getElementById("calc-preis-output"),
        infoOut: document.getElementById("calc-info-output"),
        anzahl: document.getElementById("calc-anzahl"),
        mwst: document.getElementById("calc-mwst"),
        zeitaufwand: document.getElementById("calc-zeitaufwand"),
        stundenlohn: document.getElementById("calc-stundenlohn"),
        schnittpreis: document.getElementById("calc-schnittpreis"),
        resEinkauf: document.getElementById("res-einkaufspreis"),
        resAufwand: document.getElementById("res-aufwand"),
        resSumme: document.getElementById("res-summe")
    };

    // Referenzen (Admin)
    const admin = {
        form: document.getElementById("admin-form"),
        produkt: document.getElementById("admin-produkt"),
        typ: document.getElementById("admin-typ"),
        laenge: document.getElementById("admin-laenge"),
        artikelId: document.getElementById("admin-artikel-id"),
        preis: document.getElementById("admin-preis"),
        info: document.getElementById("admin-info"),
        saveBtn: document.getElementById("admin-save-btn"),
        clearBtn: document.getElementById("admin-clear-btn"),
        tableBody: document.getElementById("admin-table-body")
    };

    // Referenzen (Navigation & Sektionen)
    const nav = {
        calcBtn: document.getElementById("nav-calc"),
        adminBtn: document.getElementById("nav-admin"),
        calcSection: document.getElementById("calc-section"),
        adminSection: document.getElementById("admin-section"),
        loginSection: document.getElementById("login-section")
    };
    
    // Referenzen (Login)
    const login = {
        form: document.getElementById("login-form"),
        password: document.getElementById("login-password")
    };
    
    // ======== INITIALISIERUNG ========

    function init() {
        // Event Listeners für die Navigation
        nav.calcBtn.addEventListener("click", () => showSection("calc"));
        nav.adminBtn.addEventListener("click", () => showSection("admin"));
        
        // Event Listeners für Login
        login.form.addEventListener("submit", handleLogin);

        // Event Listeners für Admin
        admin.form.addEventListener("submit", handleAdminFormSubmit);
        admin.clearBtn.addEventListener("click", resetAdminForm);
        admin.tableBody.addEventListener("click", handleAdminTableClick);

        // Event Listeners für Kalkulation
        const calcInputs = [calc.produkt, calc.typ, calc.laenge, calc.anzahl, calc.mwst, calc.zeitaufwand, calc.stundenlohn, calc.schnittpreis];
        calcInputs.forEach(input => input.addEventListener("change", handleCalcChange));

        // Datenbank laden
        loadDB();
        
        // Login-Status prüfen
        checkLoginStatus();
        
        // Standard-Sektion anzeigen
        showSection("calc");
        
        // Kalkulations-Dropdowns füllen
        populateCalcDropdowns();
    }

    // ======== SEKTIONS-MANAGEMENT & LOGIN ========

    function showSection(sectionName) {
        // Alle Sektionen ausblenden
        nav.calcSection.classList.add("hidden");
        nav.adminSection.classList.add("hidden");
        nav.loginSection.classList.add("hidden");

        // Ziel-Sektion einblenden
        if (sectionName === "calc") {
            nav.calcSection.classList.remove("hidden");
        } else if (sectionName === "admin") {
            if (isLoggedIn()) {
                nav.adminSection.classList.remove("hidden");
                populateAdminTable(); // Admin-Tabelle neu laden
            } else {
                nav.loginSection.classList.remove("hidden"); // Login zeigen, falls nicht eingeloggt
            }
        }
    }

    function checkLoginStatus() {
        if (isLoggedIn()) {
            nav.adminBtn.style.display = "block";
        }
    }

    function isLoggedIn() {
        return localStorage.getItem("app_isAdmin") === "true";
    }

    function handleLogin(e) {
        e.preventDefault();
        if (login.password.value === "Moni") {
            localStorage.setItem("app_isAdmin", "true");
            login.password.value = "";
            checkLoginStatus();
            showSection("admin");
        } else {
            alert("Falsches Passwort!");
        }
    }

    // ======== DATENBANK-FUNKTIONEN (localStorage) ========

    function loadDB() {
        const dbString = localStorage.getItem("productDB");
        if (dbString) {
            productDB = JSON.parse(dbString);
        } else {
            // Standard-Daten (aus Ihrem Bild)
            productDB = [
                {"produkt":"Easy Invisible","typ":"10S","laenge":"40 cm","artikelId":"18602158","preis":52.50,"info":"4 cm breit / Inhalt: 6 Stück"},
                {"produkt":"Easy Invisible","typ":"10A","laenge":"40 cm","artikelId":"18602154","preis":52.50,"info":"4 cm breit / Inhalt: 6 Stück"},
                {"produkt":"Easy Invisible","typ":"L10","laenge":"40 cm","artikelId":"18602171","preis":52.50,"info":"4 cm breit / Inhalt: 6 Stück"},
                {"produkt":"Easy Invisible","typ":"10G","laenge":"40 cm","artikelId":"18602157","preis":52.50,"info":"4 cm breit / Inhalt: 6 Stück"},
                {"produkt":"Easy Invisible","typ":"9G.10 OM","laenge":"40 cm","artikelId":"18602167","preis":52.50,"info":"4 cm breit / Inhalt: 6 Stück"},
                {"produkt":"Easy Invisible","typ":"10S","laenge":"55 cm","artikelId":"18602214","preis":92.00,"info":"4 cm breit / Inhalt: 6 Stück"},
                {"produkt":"Easy Invisible","typ":"10A","laenge":"55 cm","artikelId":"18602230","preis":92.00,"info":"4 cm breit / Inhalt: 6 Stück"},
                {"produkt":"Easy Invisible","typ":"9G.10 OM","laenge":"55 cm","artikelId":"18602229","preis":92.00,"info":"4 cm breit / Inhalt: 6 Stück"}
            ];
            saveDB();
        }
    }

    function saveDB() {
        localStorage.setItem("productDB", JSON.stringify(productDB));
    }

    // ======== ADMIN-FUNKTIONEN ========

    function populateAdminTable() {
        admin.tableBody.innerHTML = ""; // Tabelle leeren
        
        productDB.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.produkt}</td>
                <td>${item.typ}</td>
                <td>${item.laenge}</td>
                <td>${item.artikelId}</td>
                <td>${formatCurrency(item.preis, false)}</td>
                <td>${item.info}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${item.artikelId}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${item.artikelId}">X</button>
                </td>
            `;
            admin.tableBody.appendChild(tr);
        });
    }

    function handleAdminFormSubmit(e) {
        e.preventDefault();

        const newItem = {
            produkt: admin.produkt.value,
            typ: admin.typ.value,
            laenge: admin.laenge.value,
            artikelId: admin.artikelId.value,
            preis: parseFloat(admin.preis.value),
            info: admin.info.value
        };

        if (currentEditId) {
            // BEARBEITEN
            const index = productDB.findIndex(item => item.artikelId === currentEditId);
            if (index > -1) {
                productDB[index] = newItem;
            }
        } else {
            // NEU HINZUFÜGEN
            // Prüfen, ob Artikel-ID bereits existiert
            if (productDB.some(item => item.artikelId === newItem.artikelId)) {
                alert("Fehler: Artikel-ID existiert bereits!");
                return;
            }
            productDB.push(newItem);
        }

        saveDB();
        populateAdminTable();
        resetAdminForm();
        populateCalcDropdowns(); // Dropdowns in Kalkulation aktualisieren
    }

    function handleAdminTableClick(e) {
        const target = e.target;
        const id = target.getAttribute("data-id");

        if (target.classList.contains("edit-btn")) {
            // BEARBEITEN
            const item = productDB.find(item => item.artikelId === id);
            if (item) {
                admin.produkt.value = item.produkt;
                admin.typ.value = item.typ;
                admin.laenge.value = item.laenge;
                admin.artikelId.value = item.artikelId;
                admin.preis.value = item.preis;
                admin.info.value = item.info;
                
                admin.artikelId.readOnly = true; // Artikel-ID als Schlüssel nicht änderbar machen
                currentEditId = item.artikelId;
                admin.saveBtn.textContent = "Änderung Speichern";
                window.scrollTo(0, 0); // Nach oben scrollen
            }
        } else if (target.classList.contains("delete-btn")) {
            // LÖSCHEN
            if (confirm(`Soll der Artikel mit der ID ${id} wirklich gelöscht werden?`)) {
                productDB = productDB.filter(item => item.artikelId !== id);
                saveDB();
                populateAdminTable();
                populateCalcDropdowns(); // Dropdowns in Kalkulation aktualisieren
            }
        }
    }

    function resetAdminForm() {
        admin.form.reset();
        admin.artikelId.readOnly = false;
        currentEditId = null;
        admin.saveBtn.textContent = "Speichern";
    }
    
    // ======== KALKULATIONS-FUNKTIONEN ========

    function handleCalcChange(e) {
        const changedElement = e.target;
        
        // Abhängige Dropdowns aktualisieren
        if (changedElement === calc.produkt) {
            updateDropdown(calc.typ, getUniqueValues("typ", { produkt: calc.produkt.value }));
        }
        if (changedElement === calc.produkt || changedElement === calc.typ) {
             updateDropdown(calc.laenge, getUniqueValues("laenge", { produkt: calc.produkt.value, typ: calc.typ.value }));
        }

        // Produktdetails abrufen, wenn alle 3 Dropdowns einen Wert haben
        if (calc.produkt.value && calc.typ.value && calc.laenge.value) {
            fetchProductDetails();
        }

        // Immer neu berechnen, wenn sich eine Eingabe ändert
        calculateAll();
    }
    
    function populateCalcDropdowns() {
        updateDropdown(calc.produkt, getUniqueValues("produkt", {}));
        updateDropdown(calc.typ, getUniqueValues("typ", { produkt: calc.produkt.value }));
        updateDropdown(calc.laenge, getUniqueValues("laenge", { produkt: calc.produkt.value, typ: calc.typ.value }));
        fetchProductDetails();
        calculateAll();
    }
    
    function getUniqueValues(field, filters) {
        let filtered = productDB;
        if (filters.produkt) {
            filtered = filtered.filter(item => item.produkt === filters.produkt);
        }
        if (filters.typ) {
            filtered = filtered.filter(item => item.typ === filters.typ);
        }
        
        const unique = [...new Set(filtered.map(item => item[field]))];
        return unique.sort();
    }

    function updateDropdown(selectElement, optionsArray) {
        const currentValue = selectElement.value;
        selectElement.innerHTML = ""; // Alte Optionen löschen
        
        // "Bitte wählen" Option
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "--- Bitte wählen ---";
        selectElement.appendChild(placeholder);
        
        // Neue Optionen füllen
        optionsArray.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
        
        // Alten Wert wieder auswählen, wenn er noch gültig ist
        if (optionsArray.includes(currentValue)) {
            selectElement.value = currentValue;
        }
    }
    
    function fetchProductDetails() {
        const item = productDB.find(p => 
            p.produkt === calc.produkt.value &&
            p.typ === calc.typ.value &&
            p.laenge === calc.laenge.value
        );
        
        if (item) {
            calc.preisOut.value = formatCurrency(item.preis, false);
            calc.infoOut.value = item.info;
        } else {
            calc.preisOut.value = "";
            calc.infoOut.value = "";
        }
    }

    function calculateAll() {
        // 1. Werte einlesen (und in Zahlen umwandeln)
        // Preis (Netto) aus der DB holen
        const preisStr = calc.preisOut.value.replace("€", "").replace(",", ".").trim();
        const preisNetto = parseFloat(preisStr) || 0;
        
        const anzahl = parseFloat(calc.anzahl.value) || 0;
        const mwstSatz = (parseFloat(calc.mwst.value) || 0) / 100;
        const zeitaufwand = parseFloat(calc.zeitaufwand.value) || 0;
        const stundenlohn = parseFloat(calc.stundenlohn.value) || 0;
        const schnittpreis = parseFloat(calc.schnittpreis.value) || 0;

        // 2. Berechnungen (gemäß Bild)
        // Einkaufspreis (Brutto) = (Preis * Anzahl) * (1 + MwSt)
        const einkaufspreisBrutto = (preisNetto * anzahl) * (1 + mwstSatz);

        // Aufwandsentschädigung = (Zeitaufwand * Stundenlohn) + Schnittpreis
        const aufwandsentschaedigung = (zeitaufwand * stundenlohn) + schnittpreis;

        // Summe = Einkaufspreis (Brutto) + Aufwandsentschädigung
        const summe = einkaufspreisBrutto + aufwandsentschaedigung;

        // 3. Ergebnisse anzeigen
        calc.resEinkauf.textContent = formatCurrency(einkaufspreisBrutto);
        calc.resAufwand.textContent = formatCurrency(aufwandsentschaedigung);
        calc.resSumme.textContent = formatCurrency(summe);
    }

    // ======== HILFSFUNKTIONEN ========
    
    /**
     * Formatiert eine Zahl als deutschen Euro-Betrag.
     * @param {number} value - Der Zahlenwert
     * @param {boolean} [withSymbol=true] - Ob "€" angehängt werden soll
     * @returns {string} - Der formatierte String
     */
    function formatCurrency(value, withSymbol = true) {
        if (isNaN(value)) value = 0;
        let str = value.toFixed(2).replace(".", ",");
        if (withSymbol) {
            str += " €";
        }
        return str;
    }

    // Anwendung starten
    init();
});
