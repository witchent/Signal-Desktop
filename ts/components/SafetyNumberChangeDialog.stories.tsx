import * as React from 'react';
import { SafetyNumberChangeDialog } from './SafetyNumberChangeDialog';
import { ConversationType } from '../state/ducks/conversations';

// @ts-ignore
import { setup as setupI18n } from '../../js/modules/i18n';
// @ts-ignore
import enMessages from '../../_locales/en/messages.json';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

const i18n = setupI18n('en', enMessages);

const contactWithAllData = {
  avatarPath: undefined,
  color: 'signal-blue',
  profileName: '-*Smartest Dude*-',
  title: 'Rick Sanchez',
  name: 'Rick Sanchez',
  phoneNumber: '(305) 123-4567',
} as ConversationType;

const contactWithJustProfile = {
  avatarPath: undefined,
  color: 'signal-blue',
  title: '-*Smartest Dude*-',
  profileName: '-*Smartest Dude*-',
  name: undefined,
  phoneNumber: '(305) 123-4567',
} as ConversationType;

const contactWithJustNumber = {
  avatarPath: undefined,
  color: 'signal-blue',
  profileName: undefined,
  name: undefined,
  title: '(305) 123-4567',
  phoneNumber: '(305) 123-4567',
} as ConversationType;

const contactWithNothing = {
  id: 'some-guid',
  avatarPath: undefined,
  color: 'signal-blue',
  profileName: undefined,
  name: undefined,
  phoneNumber: undefined,
  title: 'Unknown contact',
} as ConversationType;

storiesOf('Components/SafetyNumberChangeDialog', module)
  .add('Single Contact Dialog', () => {
    return (
      <SafetyNumberChangeDialog
        contacts={[contactWithAllData]}
        i18n={i18n}
        onCancel={action('cancel')}
        onConfirm={action('confirm')}
        renderSafetyNumber={() => {
          action('renderSafetyNumber');
          return <div>This is a mock Safety Number View</div>;
        }}
      />
    );
  })
  .add('Different Confirmation Text', () => {
    return (
      <SafetyNumberChangeDialog
        confirmText="You are awesome"
        contacts={[contactWithAllData]}
        i18n={i18n}
        onCancel={action('cancel')}
        onConfirm={action('confirm')}
        renderSafetyNumber={() => {
          action('renderSafetyNumber');
          return <div>This is a mock Safety Number View</div>;
        }}
      />
    );
  })
  .add('Multi Contact Dialog', () => {
    return (
      <SafetyNumberChangeDialog
        contacts={[
          contactWithAllData,
          contactWithJustProfile,
          contactWithJustNumber,
          contactWithNothing,
        ]}
        i18n={i18n}
        onCancel={action('cancel')}
        onConfirm={action('confirm')}
        renderSafetyNumber={() => {
          action('renderSafetyNumber');
          return <div>This is a mock Safety Number View</div>;
        }}
      />
    );
  })
  .add('Scroll Dialog', () => {
    return (
      <SafetyNumberChangeDialog
        contacts={[
          contactWithAllData,
          contactWithJustProfile,
          contactWithJustNumber,
          contactWithNothing,
          contactWithAllData,
          contactWithAllData,
          contactWithAllData,
          contactWithAllData,
          contactWithAllData,
          contactWithAllData,
        ]}
        i18n={i18n}
        onCancel={action('cancel')}
        onConfirm={action('confirm')}
        renderSafetyNumber={() => {
          action('renderSafetyNumber');
          return <div>This is a mock Safety Number View</div>;
        }}
      />
    );
  });
