import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, date, select, text } from '@storybook/addon-knobs';

// @ts-ignore
import { setup as setupI18n } from '../../../js/modules/i18n';

// @ts-ignore
import enMessages from '../../../_locales/en/messages.json';

import { Props, Timestamp } from './Timestamp';

const i18n = setupI18n('en', enMessages);

const story = storiesOf('Components/Conversation/Timestamp', module);

const now = Date.now;
const seconds = (n: number) => n * 1000;
const minutes = (n: number) => 60 * seconds(n);
const hours = (n: number) => 60 * minutes(n);
const days = (n: number) => 24 * hours(n);

const get1201 = () => {
  const d = new Date();
  d.setHours(0, 1, 0, 0);
  return d.getTime();
};

const getJanuary1201 = () => {
  const d = new Date();
  d.setHours(0, 1, 0, 0);
  d.setMonth(0);
  d.setDate(1);
  return d.getTime();
};

const times = (): Array<[string, number]> => [
  ['500ms ago', now() - seconds(0.5)],
  ['30s ago', now() - seconds(30)],
  ['1m ago', now() - minutes(1)],
  ['30m ago', now() - minutes(30)],
  ['45m ago', now() - minutes(45)],
  ['1h ago', now() - hours(1)],
  ['12:01am today', get1201()],
  ['11:59pm yesterday', get1201() - minutes(2)],
  ['24h ago', now() - hours(24)],
  ['2d ago', now() - days(2)],
  ['7d ago', now() - days(7)],
  ['30d ago', now() - days(30)],
  ['January 1st this year, 12:01am ', getJanuary1201()],
  ['December 31st last year, 11:59pm', getJanuary1201() - minutes(2)],
  ['366d ago', now() - days(366)],
];

const createProps = (overrideProps: Partial<Props> = {}): Props => ({
  i18n,
  timestamp: overrideProps.timestamp,
  extended: boolean('extended', overrideProps.extended || false),
  module: text('module', ''),
  withImageNoCaption: boolean('withImageNoCaption', false),
  withSticker: boolean('withSticker', false),
  withTapToViewExpired: boolean('withTapToViewExpired', false),
  direction:
    select(
      'direction',
      { none: '', incoming: 'incoming', outgoing: 'outgoing' },
      ''
    ) || undefined,
});

const createTable = (overrideProps: Partial<Props> = {}) => (
  <table cellPadding={5}>
    <tr>
      <th>Description</th>
      <th>Timestamp</th>
    </tr>
    {times().map(([description, timestamp]) => (
      <tr key={timestamp}>
        <td>{description}</td>
        <td>
          <Timestamp
            key={timestamp}
            {...createProps({ ...overrideProps, timestamp })}
          />
        </td>
      </tr>
    ))}
  </table>
);

story.add('Normal', () => {
  return createTable();
});

story.add('Extended', () => {
  return createTable({ extended: true });
});

story.add('Knobs', () => {
  const props = createProps({
    timestamp: date('timestamp', new Date()),
  });

  return <Timestamp {...props} />;
});
