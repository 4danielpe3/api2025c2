import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Leer encabezado Authorization
  const token = authHeader && authHeader.split(" ")[1]; // Formato: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verifica token
    req.user = decoded; // Guarda los datos del usuario en la request
    next(); // Continúa al controlador
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
