import { conmysql } from "../db.js";
import fs from 'fs';

export const getProductos = async (req, res) => {
    try {
        const [result] = await conmysql.query('select * from productos')
        res.json({
            cant: result.length,
            data: result
        })
       /* res.json(result) */
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" })
    }
}

export const getProductosxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('select * from productos where prod_id=?',[req.params.id])
        if(result.length<=0)return res.json({
            cant: 0,
            message: "Producto no encontrado"
        })
        res.json({
            cant: result.length,
            data: result[0]
        })
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" })
    }
}

export const postProductos = async (req, res) => {
  try {
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;

    let prod_imagen = null;
    if (req.files && req.files.prod_imagen) {
      const imagen = req.files.prod_imagen;
      const ruta = `uploads/${Date.now()}-${imagen.name}`;

      await imagen.mv(ruta);
      prod_imagen = ruta;
    }

    const [result] = await conmysql.query(
      'INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES (?, ?, ?, ?, ?, ?)',
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
    );

    res.json({ message: 'Producto registrado correctamente', prod_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const putProductosxId = async (req, res) => {
  try {
    const { id } = req.params;
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;

    let prod_imagen = null;
    if (req.files && req.files.prod_imagen) {
      const imagen = req.files.prod_imagen;
      const ruta = `uploads/${Date.now()}-${imagen.name}`;

      await imagen.mv(ruta);
      prod_imagen = ruta;
    }

    const [existing] = await conmysql.query('SELECT prod_imagen FROM productos WHERE prod_id=?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: "Producto no encontrado" });
    if (!prod_imagen) prod_imagen = existing[0].prod_imagen;

    const [result] = await conmysql.query(
      `UPDATE productos 
       SET prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=?, prod_imagen=? 
       WHERE prod_id=?`,
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
    );

    if (result.affectedRows <= 0) return res.status(404).json({ message: "Producto no encontrado" });

    const [fila] = await conmysql.query('SELECT * FROM productos WHERE prod_id=?', [id]);
    res.json(fila[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Primero, opcional: obtener la imagen para eliminarla del servidor
    const [existing] = await conmysql.query('SELECT prod_imagen FROM productos WHERE prod_id=?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: "Producto no encontrado" });

    const prod_imagen = existing[0].prod_imagen;

    // Eliminar producto de la base de datos
    const [result] = await conmysql.query('DELETE FROM productos WHERE prod_id=?', [id]);

    if (result.affectedRows <= 0) return res.status(404).json({ message: "Producto no encontrado" });

    // Opcional: eliminar archivo de imagen del servidor
    if (prod_imagen) {
      
      fs.unlink(prod_imagen, (err) => {
        if (err) console.warn('No se pudo eliminar la imagen:', err);
      });
    }

    res.json({ message: "Producto eliminado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};



