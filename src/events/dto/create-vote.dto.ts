import { IsArray, IsISO8601, IsNotEmpty } from 'class-validator';

export class CreateVoteDto {
  /**
   * The name of an event
   * @example 'Jake's secret party'
   */
  @IsNotEmpty()
  name: string;

  /**
   * Votes for an event
   * @example ['2014-01-01', '2014-01-05']
   */
  @IsArray()
  @IsISO8601({ strict: false }, { each: true })
  votes: string[];
}
