import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// importar las rutas
import clientesRoutes from './routes/clientesRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import loginRoutes from './routes/loginRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Habilitar CORS (permite cualquier origen)
app.use(cors());

// Middleware para subir archivos
app.use(fileUpload({ createParentPath: true }));
app.use(express.json());

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads'); // carpeta absoluta en la raíz del proyecto
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Carpeta uploads creada automáticamente');
}

// Servir la carpeta uploads como estática
app.use('/uploads', express.static(uploadsDir));

// indicar las rutas a utilizar
app.use('/api', clientesRoutes);
app.use('/api', productosRoutes);
app.use('/api', loginRoutes);

// manejar endpoints no encontrados
app.use((req, resp, next) => {
  resp.status(400).json({
    message: 'Endpoint not found'
  });
});

export default app;
