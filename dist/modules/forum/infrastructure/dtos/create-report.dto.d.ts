export declare enum ReportReason {
    SPAM = "SPAM",
    HARASSMENT = "HARASSMENT",
    HATE_SPEECH = "HATE_SPEECH",
    INAPPROPRIATE_CONTENT = "INAPPROPRIATE_CONTENT",
    OTHER = "OTHER"
}
export declare class CreateReportDto {
    reason: ReportReason;
    details?: string;
}
