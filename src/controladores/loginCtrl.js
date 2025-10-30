import jwt from "jsonwebtoken";
import { createHash } from "crypto";
import { conmysql } from "../db.js"; // tu conexión MySQL

// Función para encriptar clave en MD5
function encriptarMD5(clave) {
  return createHash("md5").update(clave).digest("hex");
}

export const login = async (req, res) => {
  const { usuario, clave } = req.body;

  if (!usuario || !clave) {
    return res.status(400).json({ message: "Debe ingresar usuario y clave" });
  }

  try {
    const [rows] = await conmysql.query(
      "SELECT * FROM usuarios WHERE usr_usuario = ?",
      [usuario]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];
    const claveEncriptada = encriptarMD5(clave);

    if (user.usr_clave !== claveEncriptada) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // ✅ Generar token
    const token = jwt.sign(
      {
        id: user.usr_id,
        usuario: user.usr_usuario,
        correo: user.usr_correo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Autenticación exitosa",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

