// Diccionario de traducciones
const translations = {
    EN: {
        login: 'Login',
        english: 'English',
        spanish: 'Spanish',
        username: 'Username',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot Password?',
        loginButton: 'Login'
    },
    ES: {
        login: 'Iniciar Sesión',
        english: 'Inglés',
        spanish: 'Español',
        username: 'Usuario',
        password: 'Contraseña',
        rememberMe: 'Recordarme',
        forgotPassword: '¿Olvidaste tu contraseña?',
        loginButton: 'Iniciar Sesión'
    }
};

// Función para traducir la página
function translatePage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName.toLowerCase() === 'input') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Funcionalidad para cambiar el idioma
    const languageOptions = document.querySelectorAll(".dropdown-item");
    const languageText = document.getElementById("languageText");

    // Traducir la página al cargar (por defecto en inglés)
    translatePage('EN');

    languageOptions.forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            const selectedLang = this.getAttribute("data-lang");
            languageText.textContent = selectedLang;
            translatePage(selectedLang);
            console.log("Idioma cambiado a:", selectedLang);
        });
    });
});
