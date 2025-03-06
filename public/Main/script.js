// Diccionario de traducciones
const translations = {
    EN: {
        search: 'Search locations...',
        buildings: 'Buildings',
        buildingA: "Building A",
        buildingADesc: "Administrative offices and main entrance",
        buildingB: "Building B",
        buildingBDesc: "Engineering and Technology departments",
        buildingC: "Building C",
        buildingCDesc: "Science laboratories and research facilities",
        classrooms: 'Classrooms',
        firstFloor: "First Floor",
        firstFloorDesc: "Rooms 101-110: General purpose classrooms",
        secondFloor: "Second Floor",
        secondFloorDesc: "Rooms 201-210: Mathematics and Physics",
        thirdFloor: "Third Floor",
        thirdFloorDesc: "Rooms 301-310: Language and Literature",
        specialClassrooms: 'Special Classrooms',
        computerLabs: "Computer Labs",
        computerLabsDesc: "Labs 1-3: Programming and Software Development",
        scienceLabs: "Science Labs",
        scienceLabsDesc: "Labs 4-6: Chemistry and Biology facilities",
        multimediaRooms: "Multimedia Rooms",
        multimediaRoomsDesc: "Rooms 7-8: Audio-visual and presentation facilities",
        english: 'English',
        spanish: 'Spanish',
        userInfo: 'User Information',
        matricula: 'Student ID',
        role: 'Role',
        student: 'Student',
        logout: 'Logout',
        campusMap: 'Campus Map'
    },
    ES: {
        search: 'Buscar ubicaciones...',
        buildings: 'Edificios',
        buildingA: "Edificio A",
        buildingADesc: "Oficinas administrativas y entrada principal",
        buildingB: "Edificio B",
        buildingBDesc: "Departamentos de Ingeniería y Tecnología",
        buildingC: "Edificio C",
        buildingCDesc: "Laboratorios de ciencias e instalaciones de investigación",
        classrooms: 'Aulas',
        firstFloor: "Primer Piso",
        firstFloorDesc: "Salones 101-110: Aulas de uso general",
        secondFloor: "Segundo Piso",
        secondFloorDesc: "Salones 201-210: Matemáticas y Física",
        thirdFloor: "Tercer Piso",
        thirdFloorDesc: "Salones 301-310: Lenguaje y Literatura",
        specialClassrooms: 'Aulas Especiales',
        computerLabs: "Laboratorios de Computación",
        computerLabsDesc: "Labs 1-3: Programación y Desarrollo de Software",
        scienceLabs: "Laboratorios de Ciencias",
        scienceLabsDesc: "Labs 4-6: Instalaciones de Química y Biología",
        multimediaRooms: "Salas Multimedia",
        multimediaRoomsDesc: "Salas 7-8: Instalaciones audiovisuales y de presentación",
        english: 'Inglés',
        spanish: 'Español',
        userInfo: 'Información del Usuario',
        matricula: 'Matrícula',
        role: 'Rol',
        student: 'Estudiante',
        logout: 'Cerrar Sesión',
        campusMap: 'Mapa del Campus'
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
    const searchInput = document.querySelector('.search_input');
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

    // Guardar preferencia de idioma
    localStorage.setItem('preferredLanguage', lang);

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

// Function to update user info
function updateUserInfo() {
    const userData = JSON.parse(sessionStorage.getItem('userData') || localStorage.getItem('userData'));
    if (userData) {
        document.getElementById('matriculaDisplay').textContent = userData.matricula;
    }
}

// Función para crear y mostrar el modal de usuario
function showUserModal() {
    const userData = JSON.parse(sessionStorage.getItem('userData') || localStorage.getItem('userData'));
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
                    <p><strong data-translate="matricula">Student ID</strong>: ${userData.matricula}</p>
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
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .close-modal {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
                transition: color 0.3s ease;
            }
            .close-modal:hover {
                color: white;
            }
            .user-info {
                margin: 20px 0;
            }
            .user-info p {
                margin: 10px 0;
                font-size: 16px;
            }
            .btn-danger {
                width: 100%;
                margin-top: 20px;
                padding: 10px;
                font-size: 16px;
                transition: all 0.3s ease;
            }
            .btn-danger:hover {
                transform: translateY(-2px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

// Coordenadas de UTCH BIS
const UTCH_COORDS = [28.66178737442051, -106.04019603454866];

// Función para inicializar el mapa
function initMap() {
    // Initialize map centered on UTCH BIS
    map = L.map('map').setView(UTCH_COORDS, 17);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add UTCH BIS marker
    const utchBisMarker = L.marker(UTCH_COORDS)
        .addTo(map)
        .bindPopup('<strong>UTCH BIS</strong><br>Universidad Tecnológica de Chihuahua BIS');

    // Center map on marker when clicked
    utchBisMarker.on('click', function() {
        map.setView(UTCH_COORDS, 18);
    });
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
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const userData = JSON.parse(sessionStorage.getItem('userData') || localStorage.getItem('userData') || 'null');
    
    if (!userData || !userData.isAuthenticated) {
        window.location.replace('../Login/index.html');
        return;
    }

    // Prevent back navigation
    history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', function(event) {
        history.pushState(null, null, window.location.href);
        event.preventDefault();
    });

    // Prevent direct URL access
    if (document.referrer === '') {
        window.location.replace('../Login/index.html');
        return;
    }

    // Initialize map
    initMap();

    // Initialize language
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'EN';
    translatePage(savedLanguage);

    // Initialize user info
    updateUserInfo();

    // Info panels functionality
    initializeInfoPanels();

    // Search functionality
    initializeSearch();

    // Add click handler for user button
    const userButton = document.getElementById('userButton');
    if (userButton) {
        userButton.addEventListener('click', showUserModal);
    }

    // Check session periodically
    setInterval(checkSession, 5000);
});

// Function to check session validity
function checkSession() {
    const userData = JSON.parse(sessionStorage.getItem('userData') || localStorage.getItem('userData') || 'null');
    
    if (!userData || !userData.isAuthenticated) {
        window.location.replace('../Login/index.html');
        return;
    }

    // Check if session is expired (30 minutes)
    const now = new Date().getTime();
    const sessionAge = now - userData.timestamp;
    if (sessionAge > 30 * 60 * 1000) { // 30 minutes in milliseconds
        logout();
        return;
    }

    // Update timestamp to keep session alive
    userData.timestamp = now;
    sessionStorage.setItem('userData', JSON.stringify(userData));
    if (localStorage.getItem('userData')) {
        localStorage.setItem('userData', JSON.stringify(userData));
    }
}

// Function to handle logout
function logout() {
    sessionStorage.removeItem('userData');
    localStorage.removeItem('userData');
    window.location.replace('../Login/index.html');
}

// Función para inicializar info panels
function initializeInfoPanels() {
    const floatingButtons = document.querySelectorAll('.btn-circle');
    const infoPanels = document.querySelectorAll('.info-panel');
    const closePanelButtons = document.querySelectorAll('.close-panel');

    function closeAllPanels() {
        infoPanels.forEach(panel => {
            panel.classList.remove('active');
        });
        floatingButtons.forEach(btn => {
            btn.classList.remove('active');
        });
    }

    floatingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPanelId = button.getAttribute('data-panel');
            const targetPanel = document.getElementById(targetPanelId);
            
            if (button.classList.contains('active')) {
                closeAllPanels();
                return;
            }

            closeAllPanels();

            if (targetPanel) {
                targetPanel.classList.add('active');
                button.classList.add('active');
            }
        });
    });

    closePanelButtons.forEach(button => {
        button.addEventListener('click', closeAllPanels);
    });

    document.addEventListener('click', (e) => {
        const clickedInsidePanel = e.target.closest('.info-panel');
        const clickedButton = e.target.closest('.btn-circle');
        
        if (!clickedInsidePanel && !clickedButton) {
            closeAllPanels();
        }
    });
}

// Function to initialize search functionality
function initializeSearch() {
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const searchInputContainer = document.querySelector('.search-input-container');

    searchBtn.addEventListener('click', () => {
        searchInputContainer.classList.toggle('active');
        searchBtn.classList.toggle('active');
        if (searchInputContainer.classList.contains('active')) {
            searchInput.focus();
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target) && searchInputContainer.classList.contains('active')) {
            searchInputContainer.classList.remove('active');
            searchBtn.classList.remove('active');
        }
    });

    searchContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                console.log('Searching for:', searchTerm);
                // TODO: Implement search logic
            }
        }
    });
}

// Language switcher event listeners
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const language = e.target.getAttribute('data-lang');
        translatePage(language);
    });
});
