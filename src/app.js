import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors'; // <<-- importar cors

// importar las rutas
import clientesRoutes from './routes/clientesRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import loginRoutes from './routes/loginRoutes.js';

const app = express();

// Habilitar CORS
app.use(cors()); // permite cualquier origen
// Si quieres restringir a tu frontend:
// app.use(cors({ origin: 'http://localhost:8100' }));

app.use(fileUpload());
app.use(express.json());

// indicar las rutas a utilizar
app.use('/api', clientesRoutes);
app.use('/api', productosRoutes);
app.use('/api', loginRoutes);
app.use('/uploads', express.static('uploads'));

// manejar endpoints no encontrados
app.use((req, resp, next) => {
  resp.status(400).json({
    message: 'Endpoint not found'
  });
});

export default app;
