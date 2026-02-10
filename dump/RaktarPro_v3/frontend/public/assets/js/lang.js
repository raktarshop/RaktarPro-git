// lang.js - tiny in-browser translation helper using localStorage.
//
// Conventions in HTML:
//   data-i18n="key"        -> element.textContent
//   data-i18n-ph="key"     -> element.placeholder
//   data-i18n-title="key"  -> element.title
//
// Language buttons:
//   <button class="rp-lang-btn" data-lang="hu">🇭🇺</button>
//   <button class="rp-lang-btn" data-lang="en">🇬🇧</button>
//   <button class="rp-lang-btn" data-lang="de">🇩🇪</button>
//
// Stores language in localStorage key: rp_lang

(function () {
  const STORAGE_KEY = "rp_lang";
  const SUPPORTED = ["hu", "en", "de"];

  const DICT = {
    hu: {
      lang_label: "Nyelv",
      headline: "Kezdjük!",
      tab_login: "Bejelentkezés",
      tab_register: "Regisztráció",
      email_label: "E-mail cím",
      email_ph: "pl. hello@ceg.hu",
      password_label: "Jelszó",
      password_ph: "Jelszó",
      show_btn: "Mutat",
      hide_btn: "Rejt",
      login_btn: "Bejelentkezés",
      continue_guest: "Folytatás vendégként →",
      help_login_link: "Segítségre van szükséged a belépésnél?",

      support_title: "Belépési segítség",
      support_subtitle: "Írj az adminnak, és hamarosan válaszolunk.",
      support_email_label: "E-mail cím",
      support_email_ph: "pl. hello@ceg.hu",
      support_msg_label: "Mi a hiba?",
      support_msg_ph: "Írd le röviden, mi történt (pl. hibaüzenet, mikor jelentkezett, stb.)",
      support_send_btn: "Üzenet küldése",
      support_back_login: "← Vissza a bejelentkezéshez",
      support_success: "Köszönjük! Az üzeneted elküldtük az admin(ok)nak.",

      admin_support_title: "Support – bejelentkezési segítség",
      admin_support_th_id: "ID",
      admin_support_th_email: "E-mail",
      admin_support_th_message: "Üzenet",
      admin_support_th_created: "Dátum",
      admin_support_th_status: "Állapot",
      admin_support_th_action: "Művelet",
      admin_support_status_open: "Nyitott",
      admin_support_status_resolved: "Megoldva",
      admin_support_resolve: "Megoldva",
      fullname_label: "Teljes név",
      fullname_ph: "pl. Kiss Márton",
      company_label: "Cégnév",
      company_ph: "pl. Raktár Pro Kft.",
      password2_label: "Jelszó mégegyszer",
      password2_ph: "Jelszó újra",
      register_btn: "Regisztráció",

      nav_subtitle: "Professzionális raktári megoldások",
      nav_account: "Fiók",
      nav_admin: "Admin",
      nav_account_settings: "Fiókbeállítások",
      nav_cart: "Kosár",
      nav_logout: "Kijelentkezés",

      products_title: "Termékek",
      search_ph: "Keresés… (név, kategória)",

      sort_default: "Rendezés",
      sort_price_asc: "Ár szerint ↑",
      sort_price_desc: "Ár szerint ↓",
      sort_name_asc: "Név szerint A→Z",
      empty_no_results: "Nincs találat.",

      no_image: "Nincs kép",
      in_stock: "Készleten",
      out_of_stock: "Nincs készleten",
      details: "Részletek",
      add_to_cart: "Kosárba",
      category_default: "Kategória",
      pcs: "db",

      cart_title: "Kosár",
      cart_total: "Összesen:",
      continue_shopping: "← Vásárlás folytatása",
      checkout: "Tovább a fizetéshez →",

      admin_title: "Admin – Készlet / Ár frissítés",
      admin_search_ph: "Keresés (név)...",
      admin_reload: "Újratöltés",
      admin_th_id: "ID",
      admin_th_name: "Név",
      admin_th_price: "Ár",
      admin_th_stock: "Készlet",
      admin_th_action: "Művelet",

      account_title: "Fiókbeállítások",
      account_soon: "Hamarosan: profil, jelszó csere, cégadatok.",
      back_to_products: "Vissza a termékekhez",

      theme_title_dark: "Sötét mód",
      theme_title_light: "Világos mód",
    },
    en: {
      lang_label: "Language",
      headline: "Let's begin!",
      tab_login: "Sign in",
      tab_register: "Sign up",
      email_label: "Email",
      email_ph: "e.g. hello@company.com",
      password_label: "Password",
      password_ph: "Password",
      show_btn: "Show",
      hide_btn: "Hide",
      login_btn: "Sign in",
      continue_guest: "Continue as guest →",
      help_login_link: "Need help signing in?",

      support_title: "Sign-in help",
      support_subtitle: "Message an admin and we’ll get back to you.",
      support_email_label: "Email",
      support_email_ph: "e.g. hello@company.com",
      support_msg_label: "What went wrong?",
      support_msg_ph: "Describe the issue briefly (error message, when it happened, etc.)",
      support_send_btn: "Send message",
      support_back_login: "← Back to sign in",
      support_success: "Thanks! Your message has been sent to the admin(s).",

      admin_support_title: "Support – sign-in help",
      admin_support_th_id: "ID",
      admin_support_th_email: "Email",
      admin_support_th_message: "Message",
      admin_support_th_created: "Date",
      admin_support_th_status: "Status",
      admin_support_th_action: "Action",
      admin_support_status_open: "Open",
      admin_support_status_resolved: "Resolved",
      admin_support_resolve: "Resolve",
      fullname_label: "Full name",
      fullname_ph: "e.g. Alex Smith",
      company_label: "Company",
      company_ph: "e.g. Warehouse Pro Ltd.",
      password2_label: "Repeat password",
      password2_ph: "Repeat password",
      register_btn: "Sign up",

      nav_subtitle: "Professional warehouse solutions",
      nav_account: "Account",
      nav_admin: "Admin",
      nav_account_settings: "Account settings",
      nav_cart: "Cart",
      nav_logout: "Log out",

      products_title: "Products",
      search_ph: "Search… (name, category)",

      sort_default: "Sort",
      sort_price_asc: "Price ↑",
      sort_price_desc: "Price ↓",
      sort_name_asc: "Name A→Z",
      empty_no_results: "No results.",

      no_image: "No image",
      in_stock: "In stock",
      out_of_stock: "Out of stock",
      details: "Details",
      add_to_cart: "Add to cart",
      category_default: "Category",
      pcs: "pcs",

      cart_title: "Cart",
      cart_total: "Total:",
      continue_shopping: "← Continue shopping",
      checkout: "Proceed to checkout →",

      admin_title: "Admin – Stock / Price update",
      admin_search_ph: "Search (name)...",
      admin_reload: "Reload",
      admin_th_id: "ID",
      admin_th_name: "Name",
      admin_th_price: "Price",
      admin_th_stock: "Stock",
      admin_th_action: "Action",

      account_title: "Account settings",
      account_soon: "Coming soon: profile, password change, company details.",
      back_to_products: "Back to products",

      theme_title_dark: "Dark mode",
      theme_title_light: "Light mode",
    },
    de: {
      lang_label: "Sprache",
      headline: "Los geht's!",
      tab_login: "Anmelden",
      tab_register: "Registrieren",
      email_label: "E-Mail",
      email_ph: "z. B. hello@firma.de",
      password_label: "Passwort",
      password_ph: "Passwort",
      show_btn: "Anzeigen",
      hide_btn: "Verbergen",
      login_btn: "Anmelden",
      continue_guest: "Als Gast fortfahren →",
      help_login_link: "Brauchst du Hilfe beim Anmelden?",

      support_title: "Hilfe beim Anmelden",
      support_subtitle: "Schreibe einem Admin – wir melden uns bald.",
      support_email_label: "E-Mail",
      support_email_ph: "z. B. hello@firma.de",
      support_msg_label: "Was ist das Problem?",
      support_msg_ph: "Beschreibe kurz das Problem (Fehlermeldung, wann es passiert, usw.)",
      support_send_btn: "Nachricht senden",
      support_back_login: "← Zurück zur Anmeldung",
      support_success: "Danke! Deine Nachricht wurde an die Admins gesendet.",

      admin_support_title: "Support – Anmeldehilfe",
      admin_support_th_id: "ID",
      admin_support_th_email: "E-Mail",
      admin_support_th_message: "Nachricht",
      admin_support_th_created: "Datum",
      admin_support_th_status: "Status",
      admin_support_th_action: "Aktion",
      admin_support_status_open: "Offen",
      admin_support_status_resolved: "Erledigt",
      admin_support_resolve: "Erledigt",
      fullname_label: "Vollständiger Name",
      fullname_ph: "z. B. Max Mustermann",
      company_label: "Firma",
      company_ph: "z. B. Lager Pro GmbH",
      password2_label: "Passwort wiederholen",
      password2_ph: "Passwort erneut",
      register_btn: "Registrieren",

      nav_subtitle: "Professionelle Lagerlösungen",
      nav_account: "Konto",
      nav_admin: "Admin",
      nav_account_settings: "Kontoeinstellungen",
      nav_cart: "Warenkorb",
      nav_logout: "Abmelden",

      products_title: "Produkte",
      search_ph: "Suche… (Name, Kategorie)",

      sort_default: "Sortieren",
      sort_price_asc: "Preis ↑",
      sort_price_desc: "Preis ↓",
      sort_name_asc: "Name A→Z",
      empty_no_results: "Keine Treffer.",

      no_image: "Kein Bild",
      in_stock: "Auf Lager",
      out_of_stock: "Nicht auf Lager",
      details: "Details",
      add_to_cart: "In den Warenkorb",
      category_default: "Kategorie",
      pcs: "Stk.",

      cart_title: "Warenkorb",
      cart_total: "Gesamt:",
      continue_shopping: "← Weiter einkaufen",
      checkout: "Zur Kasse →",

      admin_title: "Admin – Bestand / Preis aktualisieren",
      admin_search_ph: "Suche (Name)...",
      admin_reload: "Neu laden",
      admin_th_id: "ID",
      admin_th_name: "Name",
      admin_th_price: "Preis",
      admin_th_stock: "Bestand",
      admin_th_action: "Aktion",

      account_title: "Kontoeinstellungen",
      account_soon: "Kommt bald: Profil, Passwort ändern, Firmendaten.",
      back_to_products: "Zurück zu den Produkten",

      theme_title_dark: "Dunkelmodus",
      theme_title_light: "Hellmodus",
    },
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

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const key = el.getAttribute("data-i18n-ph");
      if (!key) return;
      el.setAttribute("placeholder", t(key));
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (!key) return;
      el.setAttribute("title", t(key));
    });

    document.querySelectorAll(".rp-lang-btn").forEach((btn) => {
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
  }

  function bindButtons() {
    document.querySelectorAll(".rp-lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLang(btn.getAttribute("data-lang") || "hu");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    apply();
  });

  window.addEventListener("storage", (e) => {
    if (e && e.key === STORAGE_KEY) apply();
  });

  // small API for other scripts (password toggle labels etc.)
  window.lang = { getLang, setLang, t, apply };
})();
