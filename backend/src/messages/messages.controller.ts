import {Body, Controller, Get, Post, Query, Req, UseGuards} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getMessagesByContact(
    @Req() req: any,
    @Query('contact_id') contactId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.messagesService.getMessagesByContact(
      req.user.user_metadata.sub,
      contactId,
      page,
      limit,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async sendMessage(
   @Req() req: any,
   @Body('receiver_id') receiverId: string,
   @Body('content') content: string,
   @Body('image_url') imageUrl?: string,
  ) {
    return this.messagesService.sendMessage(
     req.user.user_metadata.sub,
     receiverId,
     content,
     imageUrl,
    );
  }
}
