// Diccionario de traducciones
const translations = {
    EN: {
        search: 'Search locations...',
        buildings: 'Buildings',
        classrooms: 'Classrooms',
        specialClassrooms: 'Special Classrooms',
        english: 'English',
        spanish: 'Spanish',
        userInfo: 'User Information',
        matricula: 'Student ID',
        role: 'Role',
        student: 'Student',
        logout: 'Logout'
    },
    ES: {
        search: 'Buscar ubicaciones...',
        buildings: 'Edificios',
        classrooms: 'Salones',
        specialClassrooms: 'Salones Especiales',
        english: 'Inglés',
        spanish: 'Español',
        userInfo: 'Información del Usuario',
        matricula: 'Matrícula',
        role: 'Rol',
        student: 'Estudiante',
        logout: 'Cerrar Sesión'
    }
};

// Variables globales para elementos de la interfaz
let searchInput;

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

    // Actualizar placeholder del buscador
    if (searchInput) {
        searchInput.placeholder = translations[lang].search;
    }

    // Actualizar texto de los botones de categorías
    const buttons = document.querySelectorAll('.circular-button');
    buttons[0].setAttribute('data-tooltip', translations[lang].buildings);
    buttons[1].setAttribute('data-tooltip', translations[lang].classrooms);
    buttons[2].setAttribute('data-tooltip', translations[lang].specialClassrooms);

    // Actualizar texto del idioma
    document.getElementById('languageText').textContent = lang;

    // Actualizar el modal de usuario si está abierto
    updateUserModal(lang);
}

// Función para obtener el usuario almacenado
function getStoredUser() {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.href = '../Login/index.html';
}

// Función para crear y mostrar el modal de usuario
function showUserModal() {
    const user = getStoredUser();
    const currentLang = document.getElementById('languageText').textContent;

    // Crear el modal si no existe
    let modal = document.getElementById('userModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'userModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2 data-translate="userInfo">User Information</h2>
                <div class="user-info">
                    <p><strong data-translate="matricula">Student ID</strong>: ${user.proyecta_username}</p>
                    <p><strong data-translate="role">Role</strong>: <span data-translate="student">Student</span></p>
                </div>
                <button class="btn btn-danger" onclick="logout()" data-translate="logout">Logout</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Agregar estilos para el modal
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
            }
            .modal-content {
                background-color: #2a2d35;
                color: white;
                margin: 15% auto;
                padding: 20px;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 15px;
                width: 80%;
                max-width: 500px;
            }
            .close-modal {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }
            .close-modal:hover {
                color: white;
            }
            .user-info {
                margin: 20px 0;
            }
            .user-info p {
                margin: 10px 0;
            }
        `;
        document.head.appendChild(style);

        // Cerrar modal
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target === modal) modal.style.display = 'none';
        };
    }

    // Traducir el modal
    translatePage(currentLang);

    // Mostrar el modal
    modal.style.display = 'block';
}

// Función para actualizar el contenido del modal de usuario
function updateUserModal(lang) {
    const modal = document.getElementById('userModal');
    if (modal && modal.style.display === 'block') {
        const elements = modal.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }
}

// Función para manejar la búsqueda
async function handleSearch(query) {
    if (!query.trim()) return;

    try {
        // Limpiar marcadores existentes
        clearMarkers();

        // Por ahora solo mostramos un mensaje en la consola
        console.log('Buscando:', query);

        // Aquí implementaremos la búsqueda real más adelante
        // const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
        // const data = await response.json();
        // data.forEach(location => {
        //     addMarker(location.lat, location.lng, location.title, location.description);
        // });
    } catch (error) {
        console.error('Error en la búsqueda:', error);
    }
}

// Configuración del mapa y sus marcadores
let map;
let markers = [];

// Coordenadas de la UTCH SUR
const UTCH_COORDS = [28.661746843937696, -106.04020289814501]; // UTCH SUR, Chihuahua

// Función para inicializar el mapa
function initMap() {
    // Crear el mapa centrado en la UTCH
    map = L.map('map').setView(UTCH_COORDS, 17);

    // Agregar el mapa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Agregar un marcador en la UTCH SUR
    const utchMarker = L.marker(UTCH_COORDS).addTo(map);
    utchMarker.bindPopup('<b>Universidad Tecnológica de Chihuahua BIS</b><br>Campus BIS').openPopup();

    // Agregar un marcador en la nueva ubicación
    addMarker(28.661746843937696, -106.04020289814501, 'New Location', 'Description of the new location');
}

// Función para agregar un marcador al mapa
function addMarker(lat, lng, title, description) {
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`<b>${title}</b><br>${description}`);
    markers.push(marker);
    return marker;
}

// Función para limpiar todos los marcadores
function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}



// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('El script.js se ha cargado correctamente');

    // Verificar si hay un usuario almacenado
    const user = getStoredUser();
    if (!user) {
        window.location.href = '../Login/index.html';
        return;
    }

    // Mostrar la matrícula del usuario
    const matriculaDisplay = document.getElementById('matriculaDisplay');
    matriculaDisplay.textContent = user.proyecta_username;

    // Configurar el botón de usuario para mostrar el modal
    const userButton = document.getElementById('userButton');
    userButton.addEventListener('click', showUserModal);

    // Inicializar el mapa
    initMap();

    // Configurar los botones de categorías
    document.querySelectorAll('.circular-button button').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.querySelector('i').className.split('-').pop();
            console.log('Categoría seleccionada:', category);
            // Aquí implementaremos la lógica para mostrar ubicaciones por categoría
        });
    });

    // Inicializar elementos de búsqueda
    searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Configurar eventos de búsqueda
    searchButton.addEventListener('click', () => {
        handleSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch(searchInput.value);
        }
    });

    // Aplicar traducción inicial
    translatePage('EN');

    // Configurar el cambio de idioma
    const languageOptions = document.querySelectorAll('.dropdown-item');
    const languageText = document.getElementById('languageText');

    languageOptions.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const selectedLang = this.getAttribute('data-lang');
            languageText.textContent = selectedLang;
            translatePage(selectedLang);
            console.log('Idioma cambiado a:', selectedLang);
        });
    });
});
