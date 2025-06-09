import jwt from 'jsonwebtoken';
import dotenv from 'dotenv-safe';

dotenv.config();

export function verifyJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ auth: false, message: 'Token não fornecido.' });
  }

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) {
      return res.status(500).json({ 
        auth: false, 
        message: 'Falha na autenticação do token.' 
      });
    }

    req.userId = decoded.id;
    next();
  });
} 