import { Injectable } from '@nestjs/common';
import { Supabase } from '../auth/supabase';

@Injectable()
export class ContactsService {
  constructor(private readonly supabase: Supabase) {}

  async findAllContactsByUserId(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('contacts')
      .select(`users:contact_id (id, email)`)
      .eq('user_id', userId);

    if (error)
      throw new Error(
        `No se pudieron obtener los contactos. Error: ${error.message}`,
      );
    return data;
  }
}
