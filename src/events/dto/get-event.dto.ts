export class GetEventDto {
  /**
   * The id of a event
   * @example '1'
   */
  id: number;

  /**
   * The name of a event
   * @example 'Jake's secret party'
   */
  name: string;
  /**
   * @example ['2014-01-01', '2014-01-05', '2014-01-12']
   */
  dates: Date[];
}
