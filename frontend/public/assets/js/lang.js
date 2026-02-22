// lang.js - tiny in-browser translation helper
// data-i18n="key" -> textContent | data-i18n-ph="key" -> placeholder | data-i18n-title="key" -> title
(function () {
  const STORAGE_KEY = "rp_lang";
  const SUPPORTED = ["hu", "en", "de"];

  const DICT = {
    hu: {
      lang_label:"Nyelv",headline:"Kezdjük!",tab_login:"Bejelentkezés",tab_register:"Regisztráció",
      email_label:"E-mail cím",email_ph:"pl. hello@ceg.hu",password_label:"Jelszó",password_ph:"Jelszó",
      show_btn:"Mutat",hide_btn:"Rejt",login_btn:"Bejelentkezés",continue_guest:"Folytatás vendégként →",
      help_login_link:"Segítségre van szükséged a belépésnél?",
      support_title:"Belépési segítség",support_subtitle:"Írj az adminnak, és hamarosan válaszolunk.",
      support_email_label:"E-mail cím",support_email_ph:"pl. hello@ceg.hu",
      support_msg_label:"Mi a hiba?",
      support_msg_ph:"Írd le röviden, mi történt (pl. hibaüzenet, mikor jelentkezett, stb.)",
      support_send_btn:"Üzenet küldése",support_back_login:"← Vissza a bejelentkezéshez",
      support_success:"Köszönjük! Az üzeneted elküldtük az admin(ok)nak.",
      admin_support_title:"Support – bejelentkezési segítség",admin_support_th_id:"ID",
      admin_support_th_email:"E-mail",admin_support_th_message:"Üzenet",admin_support_th_created:"Dátum",
      admin_support_th_status:"Állapot",admin_support_th_action:"Művelet",
      admin_support_status_open:"Nyitott",admin_support_status_resolved:"Megoldva",admin_support_resolve:"Megoldva",
      fullname_label:"Teljes név",fullname_ph:"pl. Kiss Márton",company_label:"Cégnév",
      company_ph:"pl. Raktár Pro Kft.",password2_label:"Jelszó mégegyszer",password2_ph:"Jelszó újra",
      register_btn:"Regisztráció",
      nav_subtitle:"Professzionális raktári megoldások",nav_account:"Fiók",nav_admin:"Admin",
      nav_account_settings:"Fiókbeállítások",nav_cart:"Kosár",nav_logout:"Kijelentkezés",nav_orders:"Rendeléseim",
      products_title:"Termékek",search_ph:"Keresés… (név, kategória)",
      sort_default:"Rendezés",sort_price_asc:"Ár szerint ↑",sort_price_desc:"Ár szerint ↓",sort_name_asc:"Név szerint A→Z",
      empty_no_results:"Nincs találat.",no_image:"Nincs kép",
      in_stock:"Készleten",out_of_stock:"Elfogyott",low_stock:"Utolsó darabok",
      details:"Részletek",add_to_cart:"Kosárba",details_btn:"Részletek",category_default:"Kategória",pcs:"db",
      cart_title:"Kosár",cart_total:"Összesen:",continue_shopping:"← Vásárlás folytatása",checkout:"Tovább a fizetéshez →",
      checkout_modal_title:"Fizetés (Utánvét)",checkout_name_label:"Név",checkout_name_ph:"Teljes név",
      checkout_email_label:"E-mail",checkout_email_ph:"pl. hello@ceg.hu",
      checkout_address_label:"Szállítási cím",checkout_address_ph:"Irányítószám, város, utca, házszám",
      checkout_payment_label:"Fizetési mód",checkout_payment_cod:"Utánvét (készpénz/átvételkor)",
      checkout_total_label:"Fizetendő:",checkout_cancel:"Mégse",checkout_place_order:"Rendelés leadása",
      admin_title:"Admin – Készlet / Ár frissítés",admin_search_ph:"Keresés (név)...",admin_reload:"Újratöltés",
      admin_th_id:"ID",admin_th_name:"Név",admin_th_price:"Ár",admin_th_stock:"Készlet",admin_th_action:"Művelet",
      account_title:"Fiókbeállítások",account_soon:"Hamarosan: profil, jelszó csere, cégadatok.",
      back_to_products:"Vissza a termékekhez",theme_title_dark:"Sötét mód",theme_title_light:"Világos mód",
      currency_suffix:"Ft",
      admin_orders_title:"Admin – Rendelések",admin_nav_dashboard:"Dashboard",admin_nav_orders:"Rendelések",
      admin_nav_categories:"Kategóriák",admin_nav_support:"Support",admin_nav_storeview:"Vissza a bolthoz",
      admin_orders_search_ph:"Keresés (id, státusz, email) ...",admin_orders_reload:"Újratöltés",
      admin_orders_th_id:"ID",admin_orders_th_name:"Név",admin_orders_th_email:"Email",
      admin_orders_th_date:"Dátum",admin_orders_th_total:"Összeg",admin_orders_th_payment:"Fizetés",
      admin_orders_th_status:"Státusz",admin_orders_th_action:"Művelet",admin_orders_save:"Mentés",
      order_status_pending:"Függő",order_status_processing:"Feldolgozás",order_status_completed:"Teljesítve",
      order_status_cancelled:"Törölve",payment_cod:"Utánvét",
      orders_title:"Rendeléseim",orders_back_store:"Bolt",orders_cart:"Kosár",orders_loading:"Betöltés...",
      orders_empty:"Még nincs rendelésed.",orders_error_prefix:"Hiba: ",orders_details:"Részletek",
      orders_items:"Tételek",orders_total_label:"Összesen",orders_status_label:"Státusz",
      orders_date_label:"Dátum",orders_payment_label:"Fizetés",
      admin_categories_title:"Admin – Kategóriák",admin_categories_add_title:"Új kategória",
      admin_categories_name_label:"Név",admin_categories_parent_label:"Szülő kategória",
      admin_categories_add_btn:"Hozzáadás",admin_categories_list_title:"Kategória lista",
      admin_categories_edit:"Szerkesztés",admin_categories_delete:"Törlés",
      admin_new_product:"Új termék",admin_new_product_btn:"+ Új termék",
      admin_prod_name:"Név",admin_prod_sku:"SKU",admin_prod_price:"Ár",admin_prod_stock:"Készlet",
      admin_prod_category:"Kategória",admin_prod_image_url:"Kép URL",admin_prod_create:"Létrehozás",
      admin_prod_cancel:"Mégse",orders_search_ph:"Keresés (státusz, dátum)...",orders_reload:"Újratöltés",
      admin_categories_name_ph:"pl. Mobil",admin_categories_none:"(nincs)",
      admin_categories_parent_optional:"Szülő kategória (opcionális)",admin_categories_reload:"Frissítés",
      admin_prod_name_ph:"Termék neve",admin_prod_sku_ph:"SKU / cikkszám",
      admin_prod_image_url_ph:"https://... (PNG/JPG)",admin_prod_price_ph:"pl. 4990",admin_prod_stock_ph:"pl. 10",
      orders_table_date:"Dátum",orders_table_status:"Státusz",orders_table_total:"Összeg",
      orders_table_payment:"Fizetés",orders_table_action:"Művelet",
      order_details_title:"Rendelés részletei",order_details_status:"Státusz",order_details_payment:"Fizetés",
      order_details_total:"Összeg",order_details_items:"Tételek",order_details_name:"Név",
      order_details_qty:"Mennyiség",order_details_price:"Ár",
      admin_logged_in_as:"Bejelentkezve:",
      new_orders_count:"új rendelés",new_support_count:"nyitott üzenet",
      account_subtitle:"Profil, cím, jelszó, beállítások",acc_profile:"Profil",acc_shipping:"Szállítási adatok",
      acc_zip:"Irányítószám",acc_zip_ph:"pl. 9024",acc_city:"Város",acc_city_ph:"pl. Győr",
      acc_street:"Utca",acc_street_ph:"pl. Fő utca",acc_house:"Házszám",acc_house_ph:"pl. 12",
      acc_extra:"Emelet / ajtó (opcionális)",acc_extra_ph:"pl. 2. emelet 5. ajtó",
      acc_save_address:"Cím mentése",acc_password:"Jelszó",acc_pw_old:"Jelenlegi jelszó",
      acc_pw_new:"Új jelszó",acc_pw_new_ph:"Minimum 6 karakter",acc_pw_change:"Jelszó csere",
      acc_security:"Biztonság",acc_logout_all_desc:"Kijelentkezés minden eszközről",
      cart_empty:"A kosarad üres.",cart_remove:"Eltávolítás",
      checkout_login_required:"A rendelés leadásához kérlek jelentkezz be.",
      checkout_fill_required:"Kérlek töltsd ki a nevet, e-mailt és a címet.",
      checkout_processing:"Feldolgozás...",checkout_payment_label:"Fizetés:",
      order_thanks:"Köszönjük! A rendelésed rögzítettük.",order_id_prefix:"Rendelés azonosító:",
      payment_card:"Bankkártya",payment_online:"Online fizetés",product:"Termék",
      order_summary:"Összegzés",order_shipping:"Szállítás",modal_close:"Bezárás",orders_subtitle:"A korábbi vásárlásaid listája",
      admin_th_category:"Kategória",admin_th_image_url:"Kép URL",
    },
    en: {
      lang_label:"Language",headline:"Let's begin!",tab_login:"Sign in",tab_register:"Sign up",
      email_label:"Email",email_ph:"e.g. hello@company.com",password_label:"Password",password_ph:"Password",
      show_btn:"Show",hide_btn:"Hide",login_btn:"Sign in",continue_guest:"Continue as guest →",
      help_login_link:"Need help signing in?",
      support_title:"Sign-in help",support_subtitle:"Message an admin and we'll get back to you.",
      support_email_label:"Email",support_email_ph:"e.g. hello@company.com",
      support_msg_label:"What went wrong?",
      support_msg_ph:"Describe the issue briefly (error message, when it happened, etc.)",
      support_send_btn:"Send message",support_back_login:"← Back to sign in",
      support_success:"Thanks! Your message has been sent to the admin(s).",
      admin_support_title:"Support – sign-in help",admin_support_th_id:"ID",
      admin_support_th_email:"Email",admin_support_th_message:"Message",admin_support_th_created:"Date",
      admin_support_th_status:"Status",admin_support_th_action:"Action",
      admin_support_status_open:"Open",admin_support_status_resolved:"Resolved",admin_support_resolve:"Resolve",
      fullname_label:"Full name",fullname_ph:"e.g. Alex Smith",company_label:"Company",
      company_ph:"e.g. Warehouse Pro Ltd.",password2_label:"Repeat password",password2_ph:"Repeat password",
      register_btn:"Sign up",
      nav_subtitle:"Professional warehouse solutions",nav_account:"Account",nav_admin:"Admin",
      nav_account_settings:"Account settings",nav_cart:"Cart",nav_logout:"Log out",nav_orders:"My orders",
      products_title:"Products",search_ph:"Search… (name, category)",
      sort_default:"Sort",sort_price_asc:"Price ↑",sort_price_desc:"Price ↓",sort_name_asc:"Name A→Z",
      empty_no_results:"No results.",no_image:"No image",
      in_stock:"In stock",out_of_stock:"Out of stock",low_stock:"Last items",
      details:"Details",add_to_cart:"Add to cart",details_btn:"Details",category_default:"Category",pcs:"pcs",
      cart_title:"Cart",cart_total:"Total:",continue_shopping:"← Continue shopping",checkout:"Proceed to checkout →",
      checkout_modal_title:"Checkout (Cash on delivery)",checkout_name_label:"Name",checkout_name_ph:"Full name",
      checkout_email_label:"Email",checkout_email_ph:"e.g. hello@company.com",
      checkout_address_label:"Delivery address",checkout_address_ph:"ZIP, city, street, house no.",
      checkout_payment_label:"Payment method",checkout_payment_cod:"Cash on delivery",
      checkout_total_label:"Total to pay:",checkout_cancel:"Cancel",checkout_place_order:"Place order",
      admin_title:"Admin – Stock / Price update",admin_search_ph:"Search (name)...",admin_reload:"Reload",
      admin_th_id:"ID",admin_th_name:"Name",admin_th_price:"Price",admin_th_stock:"Stock",admin_th_action:"Action",
      account_title:"Account settings",account_soon:"Coming soon: profile, password change, company details.",
      back_to_products:"Back to products",theme_title_dark:"Dark mode",theme_title_light:"Light mode",
      currency_suffix:"HUF",
      admin_orders_title:"Admin – Orders",admin_nav_dashboard:"Dashboard",admin_nav_orders:"Orders",
      admin_nav_categories:"Categories",admin_nav_support:"Support",admin_nav_storeview:"Back to store",
      admin_orders_search_ph:"Search (id, status, email) ...",admin_orders_reload:"Reload",
      admin_orders_th_id:"ID",admin_orders_th_name:"Name",admin_orders_th_email:"Email",
      admin_orders_th_date:"Date",admin_orders_th_total:"Total",admin_orders_th_payment:"Payment",
      admin_orders_th_status:"Status",admin_orders_th_action:"Action",admin_orders_save:"Save",
      order_status_pending:"Pending",order_status_processing:"Processing",order_status_completed:"Completed",
      order_status_cancelled:"Cancelled",payment_cod:"Cash on delivery",
      orders_title:"My orders",orders_back_store:"Store",orders_cart:"Cart",orders_loading:"Loading...",
      orders_empty:"You don't have any orders yet.",orders_error_prefix:"Error: ",orders_details:"Details",
      orders_items:"Items",orders_total_label:"Total",orders_status_label:"Status",
      orders_date_label:"Date",orders_payment_label:"Payment",
      admin_categories_title:"Admin – Categories",admin_categories_add_title:"New category",
      admin_categories_name_label:"Name",admin_categories_parent_label:"Parent category",
      admin_categories_add_btn:"Add",admin_categories_list_title:"Category list",
      admin_categories_edit:"Edit",admin_categories_delete:"Delete",
      admin_new_product:"New product",admin_new_product_btn:"+ New product",
      admin_prod_name:"Name",admin_prod_sku:"SKU",admin_prod_price:"Price",admin_prod_stock:"Stock",
      admin_prod_category:"Category",admin_prod_image_url:"Image URL",admin_prod_create:"Create",
      admin_prod_cancel:"Cancel",orders_search_ph:"Search (status, date)...",orders_reload:"Reload",
      admin_categories_name_ph:"e.g. Mobile",admin_categories_none:"(none)",
      admin_categories_parent_optional:"Parent category (optional)",admin_categories_reload:"Refresh",
      admin_prod_name_ph:"Product name",admin_prod_sku_ph:"SKU / item code",
      admin_prod_image_url_ph:"https://... (PNG/JPG)",admin_prod_price_ph:"e.g. 4990",admin_prod_stock_ph:"e.g. 10",
      orders_table_date:"Date",orders_table_status:"Status",orders_table_total:"Total",
      orders_table_payment:"Payment",orders_table_action:"Action",
      order_details_title:"Order details",order_details_status:"Status",order_details_payment:"Payment",
      order_details_total:"Total",order_details_items:"Items",order_details_name:"Name",
      order_details_qty:"Quantity",order_details_price:"Price",
      admin_logged_in_as:"Logged in as:",
      new_orders_count:"new orders",new_support_count:"open messages",
      account_subtitle:"Profile, address, password, settings",acc_profile:"Profile",acc_shipping:"Shipping details",
      acc_zip:"ZIP code",acc_zip_ph:"e.g. 9024",acc_city:"City",acc_city_ph:"e.g. Budapest",
      acc_street:"Street",acc_street_ph:"e.g. Main Street",acc_house:"House no.",acc_house_ph:"e.g. 12",
      acc_extra:"Floor / Door (optional)",acc_extra_ph:"e.g. Floor 2 Door 5",
      acc_save_address:"Save address",acc_password:"Password",acc_pw_old:"Current password",
      acc_pw_new:"New password",acc_pw_new_ph:"Minimum 6 characters",acc_pw_change:"Change password",
      acc_security:"Security",acc_logout_all_desc:"Sign out from all devices",
      cart_empty:"Your cart is empty.",cart_remove:"Remove",
      checkout_login_required:"Please sign in to place an order.",
      checkout_fill_required:"Please fill in name, email and address.",
      checkout_processing:"Processing...",checkout_payment_label:"Payment:",
      order_thanks:"Thank you! Your order has been placed.",order_id_prefix:"Order ID:",
      payment_card:"Credit card",payment_online:"Online payment",product:"Product",
      order_summary:"Summary",order_shipping:"Shipping",modal_close:"Close",orders_subtitle:"Your previous orders",
      admin_th_category:"Category",admin_th_image_url:"Image URL",
    },
    de: {
      lang_label:"Sprache",headline:"Los geht's!",tab_login:"Anmelden",tab_register:"Registrieren",
      email_label:"E-Mail",email_ph:"z. B. hello@firma.de",password_label:"Passwort",password_ph:"Passwort",
      show_btn:"Anzeigen",hide_btn:"Verbergen",login_btn:"Anmelden",continue_guest:"Als Gast fortfahren →",
      help_login_link:"Brauchst du Hilfe beim Anmelden?",
      support_title:"Hilfe beim Anmelden",support_subtitle:"Schreibe einem Admin – wir melden uns bald.",
      support_email_label:"E-Mail",support_email_ph:"z. B. hello@firma.de",
      support_msg_label:"Was ist das Problem?",
      support_msg_ph:"Beschreibe kurz das Problem (Fehlermeldung, wann es passiert, usw.)",
      support_send_btn:"Nachricht senden",support_back_login:"← Zurück zur Anmeldung",
      support_success:"Danke! Deine Nachricht wurde an die Admins gesendet.",
      admin_support_title:"Support – Anmeldehilfe",admin_support_th_id:"ID",
      admin_support_th_email:"E-Mail",admin_support_th_message:"Nachricht",admin_support_th_created:"Datum",
      admin_support_th_status:"Status",admin_support_th_action:"Aktion",
      admin_support_status_open:"Offen",admin_support_status_resolved:"Erledigt",admin_support_resolve:"Erledigt",
      fullname_label:"Vollständiger Name",fullname_ph:"z. B. Max Mustermann",company_label:"Firma",
      company_ph:"z. B. Lager Pro GmbH",password2_label:"Passwort wiederholen",password2_ph:"Passwort erneut",
      register_btn:"Registrieren",
      nav_subtitle:"Professionelle Lagerlösungen",nav_account:"Konto",nav_admin:"Admin",
      nav_account_settings:"Kontoeinstellungen",nav_cart:"Warenkorb",nav_logout:"Abmelden",nav_orders:"Meine Bestellungen",
      products_title:"Produkte",search_ph:"Suche… (Name, Kategorie)",
      sort_default:"Sortieren",sort_price_asc:"Preis ↑",sort_price_desc:"Preis ↓",sort_name_asc:"Name A→Z",
      empty_no_results:"Keine Treffer.",no_image:"Kein Bild",
      in_stock:"Auf Lager",out_of_stock:"Nicht verfügbar",low_stock:"Letzte Stücke",
      details:"Details",add_to_cart:"In den Warenkorb",details_btn:"Details",category_default:"Kategorie",pcs:"Stk.",
      cart_title:"Warenkorb",cart_total:"Gesamt:",continue_shopping:"← Weiter einkaufen",checkout:"Zur Kasse →",
      checkout_modal_title:"Kasse (Nachnahme)",checkout_name_label:"Name",checkout_name_ph:"Vollständiger Name",
      checkout_email_label:"E-Mail",checkout_email_ph:"z. B. hello@firma.de",
      checkout_address_label:"Lieferadresse",checkout_address_ph:"PLZ, Stadt, Straße, Hausnummer",
      checkout_payment_label:"Zahlungsmethode",checkout_payment_cod:"Nachnahme",
      checkout_total_label:"Zu zahlen:",checkout_cancel:"Abbrechen",checkout_place_order:"Bestellung aufgeben",
      admin_title:"Admin – Bestand / Preis aktualisieren",admin_search_ph:"Suche (Name)...",admin_reload:"Neu laden",
      admin_th_id:"ID",admin_th_name:"Name",admin_th_price:"Preis",admin_th_stock:"Bestand",admin_th_action:"Aktion",
      account_title:"Kontoeinstellungen",account_soon:"Kommt bald: Profil, Passwort ändern, Firmendaten.",
      back_to_products:"Zurück zu den Produkten",theme_title_dark:"Dunkelmodus",theme_title_light:"Hellmodus",
      currency_suffix:"HUF",
      admin_orders_title:"Admin – Bestellungen",admin_nav_dashboard:"Dashboard",admin_nav_orders:"Bestellungen",
      admin_nav_categories:"Kategorien",admin_nav_support:"Support",admin_nav_storeview:"Zurück zum Shop",
      admin_orders_search_ph:"Suche (ID, Status, E-Mail) ...",admin_orders_reload:"Neu laden",
      admin_orders_th_id:"ID",admin_orders_th_name:"Name",admin_orders_th_email:"E-Mail",
      admin_orders_th_date:"Datum",admin_orders_th_total:"Summe",admin_orders_th_payment:"Zahlung",
      admin_orders_th_status:"Status",admin_orders_th_action:"Aktion",admin_orders_save:"Speichern",
      order_status_pending:"Ausstehend",order_status_processing:"In Bearbeitung",order_status_completed:"Abgeschlossen",
      order_status_cancelled:"Storniert",payment_cod:"Nachnahme",
      orders_title:"Meine Bestellungen",orders_back_store:"Shop",orders_cart:"Warenkorb",orders_loading:"Lädt...",
      orders_empty:"Du hast noch keine Bestellungen.",orders_error_prefix:"Fehler: ",orders_details:"Details",
      orders_items:"Positionen",orders_total_label:"Summe",orders_status_label:"Status",
      orders_date_label:"Datum",orders_payment_label:"Zahlung",
      admin_categories_title:"Admin – Kategorien",admin_categories_add_title:"Neue Kategorie",
      admin_categories_name_label:"Name",admin_categories_parent_label:"Übergeordnete Kategorie",
      admin_categories_add_btn:"Hinzufügen",admin_categories_list_title:"Kategorieliste",
      admin_categories_edit:"Bearbeiten",admin_categories_delete:"Löschen",
      admin_new_product:"Neues Produkt",admin_new_product_btn:"+ Neues Produkt",
      admin_prod_name:"Name",admin_prod_sku:"SKU",admin_prod_price:"Preis",admin_prod_stock:"Bestand",
      admin_prod_category:"Kategorie",admin_prod_image_url:"Bild-URL",admin_prod_create:"Erstellen",
      admin_prod_cancel:"Abbrechen",orders_search_ph:"Suche (Status, Datum)...",orders_reload:"Neu laden",
      admin_categories_name_ph:"z.B. Mobil",admin_categories_none:"(keine)",
      admin_categories_parent_optional:"Übergeordnete Kategorie (optional)",admin_categories_reload:"Aktualisieren",
      admin_prod_name_ph:"Produktname",admin_prod_sku_ph:"SKU / Artikelnummer",
      admin_prod_image_url_ph:"https://... (PNG/JPG)",admin_prod_price_ph:"z.B. 4990",admin_prod_stock_ph:"z.B. 10",
      orders_table_date:"Datum",orders_table_status:"Status",orders_table_total:"Summe",
      orders_table_payment:"Zahlung",orders_table_action:"Aktion",
      order_details_title:"Bestelldetails",order_details_status:"Status",order_details_payment:"Zahlung",
      order_details_total:"Summe",order_details_items:"Positionen",order_details_name:"Name",
      order_details_qty:"Menge",order_details_price:"Preis",
      admin_logged_in_as:"Angemeldet als:",
      new_orders_count:"neue Bestellungen",new_support_count:"offene Nachrichten",
      account_subtitle:"Profil, Adresse, Passwort, Einstellungen",acc_profile:"Profil",acc_shipping:"Lieferdetails",
      acc_zip:"Postleitzahl",acc_zip_ph:"z.B. 9024",acc_city:"Stadt",acc_city_ph:"z.B. Berlin",
      acc_street:"Straße",acc_street_ph:"z.B. Hauptstraße",acc_house:"Hausnummer",acc_house_ph:"z.B. 12",
      acc_extra:"Etage / Tür (optional)",acc_extra_ph:"z.B. 2. Etage Tür 5",
      acc_save_address:"Adresse speichern",acc_password:"Passwort",acc_pw_old:"Aktuelles Passwort",
      acc_pw_new:"Neues Passwort",acc_pw_new_ph:"Mindestens 6 Zeichen",acc_pw_change:"Passwort ändern",
      acc_security:"Sicherheit",acc_logout_all_desc:"Von allen Geräten abmelden",
      cart_empty:"Dein Warenkorb ist leer.",cart_remove:"Entfernen",
      checkout_login_required:"Bitte melde dich an um eine Bestellung aufzugeben.",
      checkout_fill_required:"Bitte Name E-Mail und Adresse ausfüllen.",
      checkout_processing:"Wird verarbeitet...",checkout_payment_label:"Zahlung:",
      order_thanks:"Danke! Deine Bestellung wurde aufgenommen.",order_id_prefix:"Bestellnummer:",
      payment_card:"Kreditkarte",payment_online:"Online-Zahlung",product:"Produkt",
      order_summary:"Zusammenfassung",order_shipping:"Versand",modal_close:"Schließen",orders_subtitle:"Deine bisherigen Bestellungen",
    },
      admin_th_category:"Kategorie",admin_th_image_url:"Bild-URL",
  };

  function getLang() {
    const saved = (localStorage.getItem(STORAGE_KEY) || "hu").toLowerCase();
    return SUPPORTED.includes(saved) ? saved : "hu";
  }

  function t(key) {
    const lang = getLang();
    return DICT[lang]?.[key] ?? DICT.hu?.[key] ?? key;
  }

  function apply() {
    const lang = getLang();
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => {
      const key = el.getAttribute("data-i18n-ph");
      if (key) el.setAttribute("placeholder", t(key));
    });
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      if (key) el.setAttribute("title", t(key));
    });
    document.querySelectorAll(".rp-lang-btn").forEach(btn => {
      const bLang = (btn.getAttribute("data-lang") || "").toLowerCase();
      btn.classList.toggle("active", bLang === lang);
      btn.setAttribute("aria-pressed", bLang === lang ? "true" : "false");
    });
  }

  function setLang(lang) {
    const normalized = (lang || "").toLowerCase();
    const next = SUPPORTED.includes(normalized) ? normalized : "hu";
    localStorage.setItem(STORAGE_KEY, next);
    apply();
    // Broadcast to other tabs
    window.dispatchEvent(new Event("storage"));
  }

  function bindButtons() {
    document.querySelectorAll(".rp-lang-btn").forEach(btn => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang") || "hu"));
    });
  }

  document.addEventListener("DOMContentLoaded", () => { bindButtons(); apply(); });
  window.addEventListener("storage", (e) => { if (!e || !e.key || e.key === STORAGE_KEY) apply(); });

  // FONTOS: ez már a fájl betöltésekor létrejön, így a products.js/admin.js is látja azonnal
  window.lang = { getLang, setLang, t, apply };
})();