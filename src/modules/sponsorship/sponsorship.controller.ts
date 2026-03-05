import { Controller, Post, Body, Param, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AssignSponsorUseCase } from './application/assign-sponsor.usecase';
import { TerminateSponsorshipUseCase } from './application/terminate-sponsorship.usecase';
import { GraduateSponsorUseCase } from './application/graduate-sponsor.usecase';
import { AssignSponsorDto } from './infrastructure/dtos/assign-sponsor.dto';
import { TerminateSponsorshipDto } from './infrastructure/dtos/terminate-sponsorship.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sponsorships')
@UseGuards(JwtAuthGuard)
export class SponsorshipController {
  constructor(
    private readonly assignUseCase: AssignSponsorUseCase,
    private readonly terminateUseCase: TerminateSponsorshipUseCase,
    private readonly graduateUseCase: GraduateSponsorUseCase,
  ) { }

  @Post('assign')
  async assign(@Body() dto: AssignSponsorDto) {
    return await this.assignUseCase.execute(dto);
  }

  @Post(':id/terminate')
  @HttpCode(200)
  async terminate(
    @Request() req: any,
    @Param('id') sponsorshipId: string,
    @Body() dto: TerminateSponsorshipDto,
  ) {
    return await this.terminateUseCase.execute(req.user.userId, sponsorshipId, dto);
  }

  @Post('graduate')
  @HttpCode(200)
  async graduate(@Request() req: any) {
    return await this.graduateUseCase.execute(req.user.userId);
  }
}
