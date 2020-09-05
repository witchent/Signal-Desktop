import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

// @ts-ignore
import { setup as setupI18n } from '../../js/modules/i18n';
// @ts-ignore
import enMessages from '../../_locales/en/messages.json';

import { MainHeader, PropsType } from './MainHeader';

const i18n = setupI18n('en', enMessages);

const story = storiesOf('Components/MainHeader', module);

const requiredText = (name: string, value: string | undefined) =>
  text(name, value || '');
const optionalText = (name: string, value: string | undefined) =>
  text(name, value || '') || undefined;

story.addDecorator((withKnobs as any)({ escapeHTML: false }));

const createProps = (overrideProps: Partial<PropsType> = {}): PropsType => ({
  searchTerm: requiredText('searchTerm', overrideProps.searchTerm),
  searchConversationName: optionalText(
    'searchConversationName',
    overrideProps.searchConversationName
  ),
  searchConversationId: optionalText(
    'searchConversationId',
    overrideProps.searchConversationId
  ),
  startSearchCounter: 0,

  ourConversationId: '',
  ourUuid: '',
  ourNumber: '',
  regionCode: '',

  phoneNumber: optionalText('phoneNumber', overrideProps.phoneNumber),
  title: requiredText('title', overrideProps.title),
  name: optionalText('name', overrideProps.name),
  avatarPath: optionalText('avatarPath', overrideProps.avatarPath),

  i18n,
  updateSearchTerm: action('updateSearchTerm'),
  searchMessages: action('searchMessages'),
  searchDiscussions: action('searchDiscussions'),

  clearConversationSearch: action('clearConversationSearch'),
  clearSearch: action('clearSearch'),

  showArchivedConversations: action('showArchivedConversations'),
});

story.add('Basic', () => {
  const props = createProps({});

  return <MainHeader {...props} />;
});

story.add('Name', () => {
  const props = createProps({
    name: 'John Smith',
    title: 'John Smith',
  });

  return <MainHeader {...props} />;
});

story.add('Phone Number', () => {
  const props = createProps({
    name: 'John Smith',
    phoneNumber: '+15553004000',
  });

  return <MainHeader {...props} />;
});

story.add('Search Term', () => {
  const props = createProps({
    name: 'John Smith',
    searchTerm: 'Hewwo?',
    title: 'John Smith',
  });

  return <MainHeader {...props} />;
});

story.add('Searching Conversation', () => {
  const props = createProps({
    name: 'John Smith',
    searchConversationId: 'group-id-1',
    searchConversationName: 'Everyone',
  });

  return <MainHeader {...props} />;
});

story.add('Searching Conversation with Term', () => {
  const props = createProps({
    name: 'John Smith',
    searchTerm: 'address',
    searchConversationId: 'group-id-1',
    searchConversationName: 'Everyone',
  });

  return <MainHeader {...props} />;
});
