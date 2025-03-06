// Diccionario de traducciones
const translations = {
    EN: {
        login: 'Login',
        english: 'English',
        spanish: 'Spanish',
        username: 'Student ID',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot Password?',
        loginButton: 'Login',
        errorInvalidCredentials: 'Invalid student ID or password. Student ID must be 10 digits.',
        errorServerError: 'Server error, please try again later'
    },
    ES: {
        login: 'Iniciar Sesión',
        english: 'Inglés',
        spanish: 'Español',
        username: 'Matrícula',
        password: 'Contraseña',
        rememberMe: 'Recordarme',
        forgotPassword: '¿Olvidaste tu contraseña?',
        loginButton: 'Iniciar Sesión',
        errorInvalidCredentials: 'Matrícula o contraseña inválidos. La matrícula debe tener 10 dígitos.',
        errorServerError: 'Error del servidor, por favor intente más tarde'
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

// Función para manejar el inicio de sesión
async function handleLogin(event) {
    event.preventDefault();
    
    const matricula = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const errorMessage = document.getElementById('errorMessage');
    const currentLang = document.getElementById('languageText').textContent;

    if (!matricula || !password) {
        errorMessage.textContent = translations[currentLang].errorInvalidCredentials;
        errorMessage.style.display = 'block';
        return;
    }

    try {
        console.log('Enviando petición al servidor...');
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matricula,
                password
            })
        });

        const data = await response.json();

        if (data.success) {
            const userData = {
                matricula: matricula,
                isAuthenticated: true,
                timestamp: new Date().getTime(),
                sessionId: Math.random().toString(36).substring(2) + Date.now().toString(36)
            };

            // Almacenar tanto en sessionStorage como en localStorage si rememberMe está marcado
            sessionStorage.setItem('userData', JSON.stringify(userData));
            if (rememberMe) {
                localStorage.setItem('userData', JSON.stringify(userData));
            }

            // Evitar la navegación hacia atrás
            history.pushState(null, null, window.location.href);
            window.location.replace('../Main/index.html');
        } else {
            errorMessage.textContent = translations[currentLang].errorInvalidCredentials;
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error detallado:', error);
        errorMessage.textContent = translations[currentLang].errorServerError;
        errorMessage.style.display = 'block';
    }
}

// Función para validar que solo se ingresen números en la matrícula
function validateMatricula(event) {
    // Permitir solo números y teclas de control
    if (!/[0-9]/.test(event.key) && event.key.length === 1) {
        event.preventDefault();
    }
}

// Función para probar la conexión a la base de datos
async function testDatabaseConnection() {
    try {
        console.log('Probando conexión a la base de datos...');
        const response = await fetch('/users');
        const data = await response.json();
        console.log('Conexión exitosa, usuarios encontrados:', data);
        return true;
    } catch (error) {
        console.error('Error al probar la conexión:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // Probar la conexión a la base de datos al cargar
    await testDatabaseConnection();
    // Agregar validación al campo de matrícula
    const matriculaInput = document.getElementById('username');
    matriculaInput.addEventListener('keypress', validateMatricula);

    // Si el usuario ya está autenticado, redirigir al Main
    const userData = JSON.parse(sessionStorage.getItem('userData') || localStorage.getItem('userData') || 'null');
    if (userData && userData.isAuthenticated) {
        window.location.replace('../Main/index.html');
    }

    // Prevenir navegación hacia atrás
    history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', function(event) {
        history.pushState(null, null, window.location.href);
    });

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
            
            // Actualizar mensaje de error si está visible
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage.style.display === 'block') {
                errorMessage.textContent = translations[selectedLang].errorInvalidCredentials;
            }
        });
    });
});
