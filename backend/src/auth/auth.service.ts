import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Supabase } from './supabase';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: Supabase) {}

  async signUp(email: string, password: string, name: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signUp({ email, password });

    if (error) throw new Error(`Error en el signup: ${error.message}`);

    const { error: userError } = await this.supabase
      .getClient()
      .from('users')
      .update({ name })
      .eq('id', data.user.id);

    if (userError) {
      throw new Error(
        `Error guardando el nombre del usuario: ${userError.message}`,
      );
    }

    const { data: signInData, error: signInError } = await this.supabase
      .getClient()
      .auth.signInWithPassword({ email, password });

    if (signInError) {
      throw new Error(
        `Error iniciando sesión después del registro: ${signInError.message}`,
      );
    }

    return {
      accessToken: signInData.session.access_token,
      refreshToken: signInData.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name,
      },
    };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({ email, password });

    if (error) throw new Error(error.message);

    const { data: userData, error: userError } = await this.supabase
      .getClient()
      .from('users')
      .select('name')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      throw new Error(
        `Error obteniendo nombre del usuario: ${userError.message}`,
      );
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: userData?.name || null,
      },
    };
  }

  async refresh(token: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.refreshSession({ refresh_token: token });

    if (error || !data.session) {
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  }

  async profile(token: string) {
    const { data, error } = await this.supabase.getClient().auth.getUser(token);

    if (error) {
      throw new UnauthorizedException('Token inválido');
    }

    const { data: userData, error: userError } = await this.supabase
      .getClient()
      .from('users')
      .select('name')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      throw new Error(
        `Error obteniendo nombre del usuario: ${userError.message}`,
      );
    }

    return {
      id: data.user.id,
      email: data.user.email,
      name: userData?.name || null,
    };
  }
}
