import { Injectable } from '@nestjs/common';
import { Supabase } from '../auth/supabase';

@Injectable()
export class MessagesService {
  constructor(private readonly supabase: Supabase) {}

  async getMessagesByContact(
    userId: string,
    contactId: string,
    page: number,
    limit: number,
  ) {
    const offset = (page - 1) * limit;

    const { data, error } = await this.supabase
      .getClient()
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${userId})`,
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return { error: error.message };
    }

    return { messages: data.reverse() };
  }

  async sendMessage(senderId: string, receiverId: string, content: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('messages')
      .insert([
        {
          sender_id: senderId,
          receiver_id: receiverId,
          content,
        },
      ])
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { message: data };
  }
}
