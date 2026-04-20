import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { BecomeAddictDto } from '../infrastructure/dtos/become-addict.dto';
export declare class BecomeAddictUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(userId: string, dto: BecomeAddictDto): Promise<{
        message: string;
        role: string;
    }>;
}
