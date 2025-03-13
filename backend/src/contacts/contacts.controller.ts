import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllContactsByUserId(@Req() req: any) {
    return this.contactsService.findAllContactsByUserId(
      req.user.user_metadata.sub,
    );
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchContacts(@Query('query') query: string) {
    return this.contactsService.searchContacts(query);
  }
}
