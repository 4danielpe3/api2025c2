import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// importar rutas
import clientesRoutes from './routes/clientesRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import loginRoutes from './routes/loginRoutes.js';

// Configurar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --------------------
// Configuración CORS
// --------------------
app.use(cors()); // permite cualquier origen
// Si quieres restringir a tu frontend:
// app.use(cors({ origin: 'https://tu-frontend.com' }));

// --------------------
// Middlewares
// --------------------
app.use(fileUpload({ createParentPath: true }));
app.use(express.json());

// --------------------
// Carpeta uploads
// --------------------
const uploadsDir = path.join(__dirname, 'uploads'); // carpeta absoluta
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Carpeta uploads creada automáticamente');
}
// Servir carpeta uploads como pública
app.use('/uploads', express.static(uploadsDir));

// --------------------
// Rutas API
// --------------------
app.use('/api', clientesRoutes);
app.use('/api', productosRoutes);
app.use('/api', loginRoutes);

// --------------------
// Manejo de endpoints no encontrados
// --------------------
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Endpoint not found'
  });
});

// --------------------
// Error handler genérico
// --------------------
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ message: 'Error en el servidor' });
});

export default app;
