import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../lib/jwt';

// Extensión del tipo Request para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      usuario?: JwtPayload;
    }
  }
}

/**
 * Middleware: valida el JWT del header Authorization: Bearer <token>
 * Si es válido, inyecta req.usuario con el payload del token.
 * El usuario_id de req.usuario alimenta automáticamente created_by / modified_by.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  const token = authHeader.substring(7);
  try {
    const payload = verifyAccessToken(token);
    req.usuario = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

/**
 * Middleware factory: exige uno de los roles indicados.
 * Ej: requireRole('Admin', 'DataOwner')
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario) return res.status(401).json({ error: 'No autenticado' });
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }
    next();
  };
}
