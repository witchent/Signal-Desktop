import * as React from 'react';

import { storiesOf } from '@storybook/react';

// @ts-ignore
import { setup as setupI18n } from '../../../js/modules/i18n';
// @ts-ignore
import enMessages from '../../../\_locales/en/messages.json';

import { ProfileChangeNotification } from './ProfileChangeNotification';

const i18n = setupI18n('en', enMessages);

storiesOf('Components/Conversation/ProfileChangeNotification', module)
  .add('From contact', () => {
    return (
      <ProfileChangeNotification
        i18n={i18n}
        changedContact={{
          id: 'some-guid',
          type: 'direct',
          title: 'John',
          name: 'John',
          lastUpdated: Date.now(),
        }}
        change={{
          type: 'name',
          oldName: 'John Old',
          newName: 'John New',
        }}
      />
    );
  })
  .add('From non-contact', () => {
    return (
      <ProfileChangeNotification
        i18n={i18n}
        changedContact={{
          id: 'some-guid',
          type: 'direct',
          title: 'John',
          lastUpdated: Date.now(),
        }}
        change={{
          type: 'name',
          oldName: 'John Old',
          newName: 'John New',
        }}
      />
    );
  });
