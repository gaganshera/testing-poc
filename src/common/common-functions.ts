import * as dayjs from 'dayjs';

export class CommonFunctions {
  public static isBuySellTime(): boolean {
    const dayOfWeek: number = dayjs().day();
    const hourOfDay: number = dayjs().hour();
    return [1, 2, 3, 4, 5].includes(dayOfWeek); //&&
    // [9, 10, 11, 12, 13, 14, 15, 16].includes(hourOfDay)
    //TODO
  }
}
