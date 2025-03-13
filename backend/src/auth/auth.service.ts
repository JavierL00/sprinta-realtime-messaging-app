import { Injectable } from '@nestjs/common';
import { Supabase } from './supabase';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: Supabase) {}

  async signUp(email: string, password: string, name: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signUp({ email, password });

    if (error) throw new Error(`Error en el signup: ${error.message}`);

    await this.supabase
      .getClient()
      .from('users')
      .update({ name })
      .eq('id', data.user.id);

    return { message: 'User registered successfully' };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({ email, password });

    if (error) throw new Error(error.message);

    console.log(data);

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: data.user,
    };
  }
}
