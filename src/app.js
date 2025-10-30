import express from 'express'
import fileUpload from 'express-fileupload';
//importar las rutas OJO
import clientesRoutes from './routes/clientesRoutes.js'
import productosRoutes from './routes/productosRoutes.js'
import { loginRoutes } from './controladores/loginCtrl.js';

const app=express();
app.use(fileUpload());
app.use(express.json());

// indicar las rutas a utilizar OJO
app.use('/api',clientesRoutes)
app.use('/api',productosRoutes)
app.use('/api',loginRoutes)
app.use('/uploads', express.static('uploads'))

app.use((req,resp,next)=>{
    resp.status(400).json({
        message: 'Endpoint not found'
    })
})

export default app;