import * as React from 'react';

import { storiesOf } from '@storybook/react';

import { ResetSessionNotification } from './ResetSessionNotification';

// @ts-ignore
import { setup as setupI18n } from '../../../js/modules/i18n';
// @ts-ignore
import enMessages from '../../../_locales/en/messages.json';
const i18n = setupI18n('en', enMessages);

const story = storiesOf(
  'Components/Conversation/ResetSessionNotification',
  module
);

story.add('Notification', () => {
  return <ResetSessionNotification i18n={i18n} />;
});
