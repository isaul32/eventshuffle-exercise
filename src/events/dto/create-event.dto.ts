import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsISO8601,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class CreateEventDto {
  /**
   * The name of a event
   * @example 'Jake's secret party'
   */
  @IsNotEmpty()
  name: string;

  /**
   * Suitable dates for a event
   * @example ['2014-01-01', '2014-01-05', '2014-01-12']
   */
  @IsArray()
  @ArrayNotEmpty()
  @IsISO8601({ strict: false }, { each: true })
  dates: string[];
}
