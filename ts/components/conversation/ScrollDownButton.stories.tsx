import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

// @ts-ignore
import { setup as setupI18n } from '../../../js/modules/i18n';

// @ts-ignore
import enMessages from '../../../_locales/en/messages.json';

import { Props, ScrollDownButton } from './ScrollDownButton';

const i18n = setupI18n('en', enMessages);

const createProps = (overrideProps: Partial<Props> = {}): Props => ({
  i18n,
  withNewMessages: boolean(
    'withNewMessages',
    overrideProps.withNewMessages || false
  ),
  scrollDown: action('scrollDown'),
  conversationId: 'fake-conversation-id',
});

const stories = storiesOf('Components/Conversation/ScrollDownButton', module);

stories.add('No New Messages', () => {
  const props = createProps();

  return <ScrollDownButton {...props} />;
});

stories.add('New Messages', () => {
  const props = createProps({ withNewMessages: true });

  return <ScrollDownButton {...props} />;
});
