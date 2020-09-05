import moment from 'moment';
import { LocalizerType } from '../types/Util';

type MuteOption = {
  name: string;
  disabled?: boolean;
  value: number;
};

export function getMuteOptions(i18n: LocalizerType): Array<MuteOption> {
  return [
    {
      name: i18n('muteHour'),
      value: moment.duration(1, 'hour').as('milliseconds'),
    },
    {
      name: i18n('muteDay'),
      value: moment.duration(1, 'day').as('milliseconds'),
    },
    {
      name: i18n('muteWeek'),
      value: moment.duration(1, 'week').as('milliseconds'),
    },
    {
      name: i18n('muteYear'),
      value: moment.duration(1, 'year').as('milliseconds'),
    },
  ];
}
