import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Token inválido');
    }

    req['user'] = data.user;
    next();
  }
}
