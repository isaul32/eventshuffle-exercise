import { ApiProperty } from '@nestjs/swagger';

export class ListAllEventsEventResponseDto {
  /**
   * The identifier of an event
   * @example '1'
   */
  id: number;

  /**
   * The name of an event
   * @example 'Jake's secret party'
   */
  name: string;
}

export class ListAllEventsResponseDto {
  @ApiProperty({
    type: [ListAllEventsEventResponseDto],
    example: [
      { id: 1, name: `Jake's secret party` },
      { id: 2, name: 'Bowling night' },
      { id: 3, name: 'Tabletop gaming' },
    ],
  })
  events: ListAllEventsEventResponseDto[];
}

export class CreateEventResponseDto {
  /**
   * The identifier of an event
   * @example '1'
   */
  id: number;
}

export class ShowEventVoteResponseDto {
  /**
   * A suitable date for people
   * @example '2014-01-01'
   */
  date: string;

  /**
   * People for whom the day is suitable
   * @example ['John', 'Julia', 'Paul', 'Daisy']
   */
  people: string[];
}

export class ShowEventResponseDto {
  /**
   * The identifier of an event
   */
  @ApiProperty({ example: 1 })
  id: number;

  /**
   * The name of an event
   */
  @ApiProperty({ example: `Jake's secret party` })
  name: string;

  @ApiProperty({
    type: [String],
    example: ['2014-01-01', '2014-01-05', '2014-01-12'],
  })
  dates: string[];

  @ApiProperty({
    type: [ShowEventVoteResponseDto],
    example: [
      {
        date: '2014-01-01',
        people: ['John', 'Julia', 'Paul', 'Daisy'],
      },
    ],
  })
  votes: ShowEventVoteResponseDto[];
}

export class AddVotesVoteResponseDto {
  /**
   * A date of vote
   * @example '2014-01-01'
   */
  date: string;

  /**
   * People for whom the date is suitable
   * @example ['John', 'Julia', 'Paul', 'Daisy']
   */
  people: string[];
}

export class AddVotesResponseDto {
  /**
   * The identifier of an event
   */
  @ApiProperty({ example: 1 })
  id: number;

  /**
   * The name of an event
   */
  @ApiProperty({ example: `Jake's secret party` })
  name: string;

  @ApiProperty({
    type: [String],
    example: ['2014-01-01', '2014-01-05', '2014-01-12'],
  })
  dates: string[];

  @ApiProperty({
    type: [AddVotesVoteResponseDto],
    example: [
      {
        date: '2014-01-01',
        people: ['John', 'Julia', 'Paul', 'Daisy', 'Dick'],
      },
      {
        date: '2014-01-05',
        people: ['Dick'],
      },
    ],
  })
  votes: AddVotesVoteResponseDto[];
}

export class ShowResultsSuitableDatesResponseDto {
  /**
   * A suitable date for people
   * @example '2014-01-01'
   */
  date: string;

  /**
   * People for whom the day is suitable
   * @example ['John', 'Julia', 'Paul', 'Daisy']
   */
  people: string[];
}

export class ShowResultsResponseDto {
  /**
   * The identifier of an event
   */
  @ApiProperty({ example: 1 })
  id: number;

  /**
   * The name of an event
   */
  @ApiProperty({ example: `Jake's secret party` })
  name: string;

  @ApiProperty({
    type: [ShowResultsSuitableDatesResponseDto],
    example: [
      {
        date: '2014-01-01',
        people: ['John', 'Julia', 'Paul', 'Daisy', 'Dick'],
      },
    ],
  })
  suitableDates: ShowResultsSuitableDatesResponseDto[];
}
