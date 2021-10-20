import { ArrayNotEmpty, IsArray, IsISO8601, IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  /**
   * The name of an event
   * @example 'Jake's secret party'
   */
  @IsNotEmpty()
  name: string;

  /**
   * Suitable dates for an event
   * @example ['2014-01-01', '2014-01-05', '2014-01-12']
   */
  @IsArray()
  @ArrayNotEmpty()
  @IsISO8601({ strict: false }, { each: true })
  dates: string[];
}
