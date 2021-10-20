export class GetEventDto {
  /**
   * The id of an event
   * @example '1'
   */
  id: number;

  /**
   * The name of an event
   * @example 'Jake's secret party'
   */
  name: string;
  /**
   * @example ['2014-01-01', '2014-01-05', '2014-01-12']
   */
  dates: Date[];
}
