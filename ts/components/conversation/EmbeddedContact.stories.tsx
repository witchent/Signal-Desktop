import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { EmbeddedContact, Props } from './EmbeddedContact';

// @ts-ignore
import { setup as setupI18n } from '../../../js/modules/i18n';
// @ts-ignore
import enMessages from '../../../_locales/en/messages.json';
import { ContactFormType } from '../../types/Contact';
const i18n = setupI18n('en', enMessages);

const story = storiesOf('Components/Conversation/EmbeddedContact', module);

const createProps = (overrideProps: Partial<Props> = {}): Props => ({
  contact: overrideProps.contact || {},
  i18n,
  isIncoming: boolean('isIncoming', overrideProps.isIncoming || false),
  onClick: action('onClick'),
  tabIndex: number('tabIndex', overrideProps.tabIndex || 0),
  withContentAbove: boolean(
    'withContentAbove',
    overrideProps.withContentAbove || false
  ),
  withContentBelow: boolean(
    'withContentBelow',
    overrideProps.withContentBelow || false
  ),
});

const fullContact = {
  avatar: {
    avatar: {
      path: '/fixtures/giphy-GVNvOUpeYmI7e.gif',
    },
    isProfile: true,
  },
  email: [
    {
      value: 'jerjor@fakemail.com',
      type: ContactFormType.HOME,
    },
  ],
  name: {
    givenName: 'Jerry',
    familyName: 'Jordan',
    prefix: 'Dr.',
    suffix: 'Jr.',
    middleName: 'James',
    displayName: 'Jerry Jordan',
  },
  number: [
    {
      value: '555-444-2323',
      type: ContactFormType.HOME,
    },
  ],
};

story.add('Full Contact', () => {
  const props = createProps({
    contact: fullContact,
  });
  return <EmbeddedContact {...props} />;
});

story.add('Only Email', () => {
  const props = createProps({
    contact: {
      email: fullContact.email,
    },
  });

  return <EmbeddedContact {...props} />;
});

story.add('Given Name', () => {
  const props = createProps({
    contact: {
      name: {
        givenName: 'Jerry',
      },
    },
  });

  return <EmbeddedContact {...props} />;
});

story.add('Organization', () => {
  const props = createProps({
    contact: {
      organization: 'Company 5',
    },
  });

  return <EmbeddedContact {...props} />;
});

story.add('Given + Family Name', () => {
  const props = createProps({
    contact: {
      name: {
        givenName: 'Jerry',
        familyName: 'FamilyName',
      },
    },
  });

  return <EmbeddedContact {...props} />;
});

story.add('Family Name', () => {
  const props = createProps({
    contact: {
      name: {
        familyName: 'FamilyName',
      },
    },
  });

  return <EmbeddedContact {...props} />;
});

story.add('Loading Avatar', () => {
  const props = createProps({
    contact: {
      name: {
        displayName: 'Jerry Jordan',
      },
      avatar: {
        avatar: {
          pending: true,
        },
        isProfile: true,
      },
    },
  });
  return <EmbeddedContact {...props} />;
});

story.add('Incoming', () => {
  const props = createProps({
    contact: {
      name: fullContact.name,
    },
    isIncoming: true,
  });

  // Wrapped in a <div> to provide a background for light color of text
  return (
    <div style={{ backgroundColor: 'darkgreen' }}>
      <EmbeddedContact {...props} />
    </div>
  );
});

story.add('Content Above and Below', () => {
  const props = createProps({
    withContentAbove: true,
    withContentBelow: true,
  });
  return (
    <>
      <div>Content Above</div>
      <EmbeddedContact {...props} />
      <div>Content Below</div>
    </>
  );
});
