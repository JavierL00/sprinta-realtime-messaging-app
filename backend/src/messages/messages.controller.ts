import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  testing(
    @Req() req: any,
    @Query('contact_id') contactId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.messagesService.testing(
      req.user.user_metadata.sub,
      contactId,
      page,
      limit,
    );
  }
}
