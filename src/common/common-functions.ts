import { DateTime } from 'luxon';
export class CommonFunctions {
  public static isBuySellTime(): boolean {
    const dayOfWeek: number = DateTime.now().weekday;
    const hourOfDay: number = DateTime.now().hour;
    return (
      [1, 2, 3, 4, 5].includes(dayOfWeek) && hourOfDay >= 9 && hourOfDay <= 17
    );
  }
}
