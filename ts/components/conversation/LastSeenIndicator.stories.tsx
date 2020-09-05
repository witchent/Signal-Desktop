import * as React from 'react';

import { number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { LastSeenIndicator, Props } from './LastSeenIndicator';

// @ts-ignore
import { setup as setupI18n } from '../../../js/modules/i18n';
// @ts-ignore
import enMessages from '../../../_locales/en/messages.json';
const i18n = setupI18n('en', enMessages);

const story = storiesOf('Components/Conversation/LastSeenIndicator', module);

const createProps = (overrideProps: Partial<Props> = {}): Props => ({
  count: number('count', overrideProps.count || 1),
  i18n,
});

story.add('One', () => {
  const props = createProps();
  return <LastSeenIndicator {...props} />;
});

story.add('More than One', () => {
  const props = createProps({
    count: 5,
  });

  return <LastSeenIndicator {...props} />;
});
