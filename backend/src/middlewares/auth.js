import jwt from 'jsonwebtoken';
import dotenv from 'dotenv-safe';

dotenv.config();

export function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ auth: false, message: 'Token não fornecido.' });
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    return res.status(401).json({ auth: false, message: 'Token mal formatado.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ auth: false, message: 'Token mal formatado.' });
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