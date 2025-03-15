import { Injectable } from '@nestjs/common';
import { Supabase } from '../auth/supabase';
import { UsersService } from '../users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly supabase: Supabase,
    private readonly usersService: UsersService,
  ) {}

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

    const { user: sender, error: errorSender } =
      await this.usersService.getUserById(senderId);

    if (errorSender) {
      return { error: error.message };
    }

    return {
      message: {
        id: data.id,
        sender_id: sender.id,
        sender_name: sender.name,
        receiver_id: receiverId,
        content: data.content,
        created_at: data.created_at,
      },
    };
  }
}
