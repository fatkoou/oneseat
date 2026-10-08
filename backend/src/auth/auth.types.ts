import { Request } from 'express';
import { UserRole } from '../users/user.entity';

export interface JwtPayload {
  sub: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
