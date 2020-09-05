import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

// @ts-ignore
import { setup as setupI18n } from '../../../js/modules/i18n';

// @ts-ignore
import enMessages from '../../../_locales/en/messages.json';

import { ContactType, Props, UnsupportedMessage } from './UnsupportedMessage';

const i18n = setupI18n('en', enMessages);

const story = storiesOf('Components/Conversation/UnsupportedMessage', module);

const createContact = (props: Partial<ContactType> = {}): ContactType => ({
  id: '',
  title: text('contact title', props.title || ''),
  isMe: boolean('contact isMe', props.isMe || false),
});

const createProps = (overrideProps: Partial<Props> = {}): Props => ({
  i18n,
  canProcessNow: boolean('canProcessNow', overrideProps.canProcessNow || false),
  contact: overrideProps.contact || ({} as ContactType),
  downloadNewVersion: action('downloadNewVersion'),
});

story.add('From Someone', () => {
  const contact = createContact({
    title: 'Alice',
    name: 'Alice',
  });

  const props = createProps({ contact });

  return <UnsupportedMessage {...props} />;
});

story.add('After Upgrade', () => {
  const contact = createContact({
    title: 'Alice',
    name: 'Alice',
  });

  const props = createProps({ contact, canProcessNow: true });

  return <UnsupportedMessage {...props} />;
});

story.add('From Yourself', () => {
  const contact = createContact({
    title: 'Alice',
    name: 'Alice',
    isMe: true,
  });

  const props = createProps({ contact });

  return <UnsupportedMessage {...props} />;
});

story.add('From Yourself After Upgrade', () => {
  const contact = createContact({
    title: 'Alice',
    name: 'Alice',
    isMe: true,
  });

  const props = createProps({ contact, canProcessNow: true });

  return <UnsupportedMessage {...props} />;
});
