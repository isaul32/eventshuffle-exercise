import { IsArray, IsISO8601, IsNotEmpty } from 'class-validator';

export class CreateVoteDto {
  /**
   * The name of a person
   * @example 'Dick'
   */
  @IsNotEmpty()
  name: string;

  /**
   * Suitable dates for a person
   * @example ['2014-01-01', '2014-01-05']
   */
  @IsArray()
  @IsISO8601({ strict: false }, { each: true })
  votes: string[];
}
