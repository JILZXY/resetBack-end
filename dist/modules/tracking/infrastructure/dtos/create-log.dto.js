"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLogDto = void 0;
const class_validator_1 = require("class-validator");
class CreateLogDto {
    log_date;
    consumed;
    craving_level;
    emotional_state;
    triggers;
    notes;
}
exports.CreateLogDto = CreateLogDto;
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'log_date debe ser una fecha válida (YYYY-MM-DD)' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLogDto.prototype, "log_date", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'consumed debe ser true o false' }),
    __metadata("design:type", Boolean)
], CreateLogDto.prototype, "consumed", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateLogDto.prototype, "craving_level", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateLogDto.prototype, "emotional_state", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLogDto.prototype, "triggers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLogDto.prototype, "notes", void 0);
//# sourceMappingURL=create-log.dto.js.map