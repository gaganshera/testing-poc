import { DateTime } from 'luxon';
import { CommonFunctions as cf } from '../common/common-functions';
describe('Common functions', () => {
  it('Test isBuySellTime true', () => {
    jest
      .spyOn(DateTime, 'now')
      .mockImplementation(() => DateTime.fromISO('2021-12-22T16:30:00'));
    expect(cf.isBuySellTime()).toBe(true);
  });

  it('Test isBuySellTime false date', () => {
    jest
      .spyOn(DateTime, 'now')
      .mockImplementation(() => DateTime.fromISO('2021-12-25T16:30:00'));
    expect(cf.isBuySellTime()).toBe(false);
  });

  it('Test isBuySellTime false time', () => {
    jest
      .spyOn(DateTime, 'now')
      .mockImplementation(() => DateTime.fromISO('2021-12-22T06:30:00'));
    expect(cf.isBuySellTime()).toBe(false);
  });
});
