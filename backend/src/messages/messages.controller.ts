import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthenticatedRequest } from '../interfaces/interfaces';
import { Request } from 'express';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Obtener mensajes con un contacto específico
  @Get(':contactId')
  async getMessages(
    @Req() req: AuthenticatedRequest,
    @Param('contactId') contactId: string,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.messagesService.getMessages(req.user.id, contactId, page);
  }

  // Enviar un mensaje
  @Post()
  async sendMessage(
    @Req() req: Request,
    @Body() body: { receiverId?: string; content?: string },
  ) {
    if (!body.receiverId || !body.content) {
      throw new BadRequestException('receiverId y content son obligatorios');
    }

    return this.messagesService.sendMessage(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req['user'].id,
      body.receiverId,
      body.content,
    );
  }
}
