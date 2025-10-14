let currentLanguage = 'en';
const translations = {};

async function loadTranslations(lang) {
    const response = await fetch(`locales/${lang}.json`);
    translations[lang] = await response.json();
}

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translations[currentLanguage][key];
    });
}

document.getElementById('languageSelect').addEventListener('change', async (event) => {
    currentLanguage = event.target.value;
    if (!translations[currentLanguage]) {
        await loadTranslations(currentLanguage);
    }
    updateContent();
    localStorage.setItem('language', currentLanguage);
});

document.addEventListener('DOMContentLoaded', async () => {
    currentLanguage = localStorage.getItem('language') || 'en';
    document.getElementById('languageSelect').value = currentLanguage;
    await loadTranslations(currentLanguage);
    updateContent();
});