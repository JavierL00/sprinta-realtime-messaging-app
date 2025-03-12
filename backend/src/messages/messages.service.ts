import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class MessagesService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  // Obtener mensajes entre dos usuarios con paginación
  async getMessages(
    userId: string,
    contactId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${userId})`,
      )
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error)
      throw new NotFoundException('No se pudieron obtener los mensajes');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data;
  }

  // Enviar un mensaje
  async sendMessage(senderId: string, receiverId: string, content: string) {
    console.log('sendMessage');
    console.log(
      'senderid: ',
      senderId,
      'receiverId: ',
      receiverId,
      'content: ',
      content,
    );
    const { data, error } = await this.supabase
      .from('messages')
      .insert([{ sender_id: senderId, receiver_id: receiverId, content }]);

    if (error)
      throw new Error(`No se pudo enviar el mensaje. Error: ${error.message}`);
    return data;
  }
}
