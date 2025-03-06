// Diccionario de traducciones
const translations = {
    EN: {
        login: 'Login',
        english: 'English',
        spanish: 'Spanish',
        welcome: 'Welcome to UTCH MAP',
        description: 'This page is dedicated to new members of the Universidad Tecnológica de Chihuahua BIS Model where you can find a complete map of the building...',
        seeMore: 'See more',
        aboutUs: 'About Us',
        aboutDescription: 'We are an organization dedicated to providing information and resources for new members of the Universidad Tecnológica de Chihuahua BIS Model.',
        mission: 'Our mission is to facilitate the orientation and adaptation of new students within the university campus through an interactive and friendly mapping system.',
        mainFeatures: 'Main Features:',
        feature1: 'Detailed mapping of facilities',
        feature2: 'Updated location information',
        feature3: 'Intuitive and easy-to-use interface',
        feature4: 'Multilingual support'
    },
    ES: {
        login: 'Iniciar Sesión',
        english: 'Inglés',
        spanish: 'Español',
        welcome: 'Bienvenido al Mapa UTCH',
        description: 'Esta página está dedicada a los nuevos integrantes de la Universidad Tecnológica de Chihuahua Modelo BIS donde encontrarás un mapa completo del edificio...',
        seeMore: 'Ver más',
        aboutUs: 'Acerca de Nosotros',
        aboutDescription: 'Somos una organización dedicada a proporcionar información y recursos para los nuevos integrantes de la Universidad Tecnológica de Chihuahua Modelo BIS.',
        mission: 'Nuestra misión es facilitar la orientación y adaptación de los nuevos estudiantes dentro del campus universitario a través de un sistema de mapeo interactivo y amigable.',
        mainFeatures: 'Características Principales:',
        feature1: 'Mapeo detallado de las instalaciones',
        feature2: 'Información actualizada de ubicaciones',
        feature3: 'Interfaz intuitiva y fácil de usar',
        feature4: 'Soporte multilingüe'
    }
};

// Función para traducir la página
function translatePage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("El script.js se ha cargado correctamente");

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

    // Funcionalidad del modal
    const modal = document.getElementById("infoModal");
    const showMoreBtn = document.getElementById("showMoreBtn");
    const closeModal = document.querySelector(".close-modal");

    // Abrir modal
    showMoreBtn.addEventListener("click", function() {
        modal.style.display = "block";
    });

    // Cerrar modal al hacer clic en la X
    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Cerrar modal al hacer clic fuera de él
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

