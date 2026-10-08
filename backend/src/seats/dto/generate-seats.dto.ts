import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export const MAX_SECTIONS = 20;
export const MAX_ROWS_PER_SECTION = 100;
export const MAX_SEATS_PER_ROW = 200;
export const MAX_SEATS_PER_REQUEST = 5000;

export class RowLayoutDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  label!: string;

  @IsInt()
  @Min(1)
  @Max(MAX_SEATS_PER_ROW)
  seatCount!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  startNumber?: number;
}

export class SectionLayoutDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_ROWS_PER_SECTION)
  @ValidateNested({ each: true })
  @Type(() => RowLayoutDto)
  rows!: RowLayoutDto[];
}

export class GenerateSeatsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_SECTIONS)
  @ValidateNested({ each: true })
  @Type(() => SectionLayoutDto)
  sections!: SectionLayoutDto[];
}
