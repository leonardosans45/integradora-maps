import express from 'express';
import sql from 'mssql';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Pool de conexiones SQL Server
const poolConfig = {
    // Configuración de conexión
    user: 'edgardatabase',
    password: 'Edgar1804',
    server: 'edgardatabase.database.windows.net',
    database: 'db-proyecta',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 30000, // 30 segundos de timeout
        requestTimeout: 30000  // 30 segundos de timeout para queries
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Middleware
app.use(express.json());

// Función para establecer tipos MIME
const setMimeType = (res, path) => {
    if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (path.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
    }
};

// Configuración de archivos estáticos
app.use(express.static(join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
    const filePath = join(__dirname, 'public', 'PreMain', 'index.html');
    setMimeType(res, filePath);
    res.sendFile(filePath);
});

// Rutas para archivos estáticos de PreMain
app.get('/PreMain/script.js', (req, res) => {
    const filePath = join(__dirname, 'public', 'PreMain', 'script.js');
    setMimeType(res, filePath);
    res.sendFile(filePath);
});

app.get('/PreMain/style.css', (req, res) => {
    const filePath = join(__dirname, 'public', 'PreMain', 'style.css');
    setMimeType(res, filePath);
    res.sendFile(filePath);
});

// Ruta para servir imágenes estáticas de PreMain
app.get('/PreMain/Img/:imageName', (req, res) => {
    const filePath = join(__dirname, 'public', 'PreMain', 'Img', req.params.imageName);
    setMimeType(res, filePath);
    res.sendFile(filePath);
});

// Rutas para archivos estáticos de Login
app.get('/Login/script.js', (req, res) => {
    const filePath = join(__dirname, 'public', 'Login', 'script.js');
    setMimeType(res, filePath);
    res.sendFile(filePath);
});

app.get('/Login/style.css', (req, res) => {
    const filePath = join(__dirname, 'public', 'Login', 'style.css');
    setMimeType(res, filePath);
    res.sendFile(filePath);
});

// Ruta para obtener todos los usuarios
app.get('/users', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM proyectaUser');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al consultar usuarios:', err);
        res.status(500).json({ error: err.message });
    }
});

// Crear pool de conexiones
let pool;
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const getPool = async () => {
    if (!pool) {
        console.log('Creando nuevo pool de conexiones...');
        pool = await new sql.ConnectionPool(poolConfig);
        await pool.connect();
    }
    return pool;
};

// Ruta para autenticación de usuario
// Middleware para validar el cuerpo de la petición
const validateLoginBody = (req, res, next) => {
    const { matricula, password } = req.body;
    if (!matricula || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Matrícula y contraseña son requeridos' 
        });
    }
    next();
};

app.post('/login', validateLoginBody, async (req, res) => {
    console.log('Recibida petición de login');
    console.log('Headers:', req.headers);
    console.log('Body completo:', req.body);
    try {
        const { matricula, password } = req.body;
        console.log('Datos recibidos:', { matricula });
        
        // Validar que la matrícula tenga 10 dígitos
        if (!/^\d{10}$/.test(matricula)) {
            console.log('Matrícula inválida:', matricula);
            return res.status(400).json({ success: false, message: 'La matrícula debe tener 10 dígitos' });
        }

        const pool = await getPool();
        console.log('Conectado a la base de datos');
        
        // Primero verificamos si la matrícula existe
        const userCheck = await pool.request()
            .input('matricula', sql.VarChar, matricula)
            .query('SELECT COUNT(*) as count FROM proyectaUser WHERE proyecta_username = @matricula');

        console.log('Verificación de matrícula:', userCheck.recordset[0]);

        if (userCheck.recordset[0].count === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'La matrícula no está registrada' 
            });
        }

        // Si la matrícula existe, verificamos la contraseña
        const result = await pool.request()
            .input('matricula', sql.VarChar, matricula)
            .input('password', sql.VarChar, password)
            .query('SELECT * FROM proyectaUser WHERE proyecta_username = @matricula AND proyecta_password = @password');
        
        console.log('Resultados encontrados:', result.recordset.length);
        
        if (result.recordset.length > 0) {
            res.json({ success: true, user: result.recordset[0] });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (err) {
        console.error('Error detallado en login:', err);
        console.error('Stack trace:', err.stack);
        res.status(500).json({ error: err.message });
    }
});

const server = app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Puerto ${port} está en uso. Intentando con puerto ${port + 1}`);
        server.close();
        app.listen(port + 1, () => {
            console.log(`Servidor corriendo en http://localhost:${port + 1}`);
        });
    } else {
        console.error('Error al iniciar el servidor:', err);
    }
});
