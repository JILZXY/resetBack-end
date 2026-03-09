import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { RequestSponsorshipUseCase } from './application/assign-sponsor.usecase';
import { AcceptSponsorshipUseCase } from './application/accept-sponsorship.usecase';
import { RejectSponsorshipUseCase } from './application/reject-sponsorship.usecase';
import { TerminateSponsorshipUseCase } from './application/terminate-sponsorship.usecase';
import { GraduateSponsorUseCase } from './application/graduate-sponsor.usecase';
import { GetGodchildProfileUseCase } from './application/get-godchild-profile.usecase';
import { RequestSponsorshipDto } from './infrastructure/dtos/request-sponsorship.dto';
import { TerminateSponsorshipDto } from './infrastructure/dtos/terminate-sponsorship.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sponsorships')
@UseGuards(JwtAuthGuard)
export class SponsorshipController {
  constructor(
    private readonly requestUseCase: RequestSponsorshipUseCase,
    private readonly acceptUseCase: AcceptSponsorshipUseCase,
    private readonly rejectUseCase: RejectSponsorshipUseCase,
    private readonly terminateUseCase: TerminateSponsorshipUseCase,
    private readonly graduateUseCase: GraduateSponsorUseCase,
    private readonly godchildProfileUseCase: GetGodchildProfileUseCase,
  ) {}

  @Post('request')
  async request(@Request() req: any, @Body() dto: RequestSponsorshipDto) {
    return await this.requestUseCase.execute(req.user.userId, dto);
  }

  @Patch('accept')
  @HttpCode(200)
  async accept(@Request() req: any) {
    return await this.acceptUseCase.execute(req.user.userId);
  }

  @Patch('reject')
  @HttpCode(200)
  async reject(@Request() req: any) {
    return await this.rejectUseCase.execute(req.user.userId);
  }

  @Patch(':id/terminate')
  @HttpCode(200)
  async terminate(
    @Request() req: any,
    @Param('id') sponsorshipId: string,
    @Body() dto: TerminateSponsorshipDto,
  ) {
    return await this.terminateUseCase.execute(
      req.user.userId,
      sponsorshipId,
      dto,
    );
  }

  @Post('graduate')
  @HttpCode(200)
  async graduate(@Request() req: any) {
    return await this.graduateUseCase.execute(req.user.userId);
  }

  @Get('godchild/profile')
  async godchildProfile(@Request() req: any) {
    return await this.godchildProfileUseCase.execute(req.user.userId);
  }
}
