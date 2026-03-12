import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { MetricsFilterDto } from '../infrastructure/dtos/metrics-filter.dto';
export declare class LogsByAddictionUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(filter: MetricsFilterDto): Promise<{
        byClassification: any[];
        byAddictionName: any[];
    }>;
}
