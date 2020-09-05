import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { ContactDetail, Props } from './ContactDetail';
import { AddressType, ContactFormType } from '../../types/Contact';

// @ts-ignore
import { setup as setupI18n } from '../../../js/modules/i18n';
// @ts-ignore
import enMessages from '../../../_locales/en/messages.json';
const i18n = setupI18n('en', enMessages);

const story = storiesOf('Components/Conversation/ContactDetail', module);

const createProps = (overrideProps: Partial<Props> = {}): Props => ({
  contact: overrideProps.contact || {},
  hasSignalAccount: boolean(
    'hasSignalAccount',
    overrideProps.hasSignalAccount || false
  ),
  i18n,
  onSendMessage: action('onSendMessage'),
});

const fullContact = {
  address: [
    {
      type: AddressType.HOME,
      street: '555 Main St.',
      city: 'Boston',
      region: 'MA',
      postcode: '33333',
      pobox: '2323-444',
      country: 'US',
      neighborhood: 'Garden Place',
    },
    {
      type: AddressType.WORK,
      street: '333 Another St.',
      city: 'Boston',
      region: 'MA',
      postcode: '33344',
      pobox: '2424-555',
      country: 'US',
      neighborhood: 'Factory Place',
    },
    {
      type: AddressType.CUSTOM,
      street: '111 Dream St.',
      city: 'Miami',
      region: 'FL',
      postcode: '44232',
      pobox: '111-333',
      country: 'US',
      neighborhood: 'BeachVille',
      label: 'vacation',
    },
    {
      type: AddressType.CUSTOM,
      street: '333 Fake St.',
      city: 'Boston',
      region: 'MA',
      postcode: '33345',
      pobox: '123-444',
      country: 'US',
      neighborhood: 'Downtown',
    },
  ],
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
    {
      value: 'jerry.jordan@fakeco.com',
      type: ContactFormType.WORK,
    },
    {
      value: 'jj@privatething.net',
      type: ContactFormType.CUSTOM,
      label: 'private',
    },
    {
      value: 'jordan@another.net',
      type: ContactFormType.CUSTOM,
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
    {
      value: '555-444-3232',
      type: ContactFormType.WORK,
    },
    {
      value: '555-666-3232',
      type: ContactFormType.MOBILE,
    },
    {
      value: '333-666-3232',
      type: ContactFormType.CUSTOM,
      label: 'special',
    },
    {
      value: '333-777-3232',
      type: ContactFormType.CUSTOM,
    },
  ],
};

story.add('Fully Filled Out', () => {
  const props = createProps({
    contact: fullContact,
    hasSignalAccount: true,
  });
  return <ContactDetail {...props} />;
});

story.add('Only Email', () => {
  const props = createProps({
    contact: {
      email: [
        {
          value: 'jerjor@fakemail.com',
          type: ContactFormType.HOME,
        },
      ],
    },
    hasSignalAccount: true,
  });

  return <ContactDetail {...props} />;
});

story.add('Given Name', () => {
  const props = createProps({
    contact: {
      name: {
        givenName: 'Jerry',
      },
    },
    hasSignalAccount: true,
  });

  return <ContactDetail {...props} />;
});

story.add('Organization', () => {
  const props = createProps({
    contact: {
      organization: 'Company 5',
    },
    hasSignalAccount: true,
  });

  return <ContactDetail {...props} />;
});

story.add('Given + Family Name', () => {
  const props = createProps({
    contact: {
      name: {
        givenName: 'Jerry',
        familyName: 'FamilyName',
      },
    },
    hasSignalAccount: true,
  });

  return <ContactDetail {...props} />;
});

story.add('Family Name', () => {
  const props = createProps({
    contact: {
      name: {
        familyName: 'FamilyName',
      },
    },
    hasSignalAccount: true,
  });

  return <ContactDetail {...props} />;
});

story.add('Loading Avatar', () => {
  const props = createProps({
    contact: {
      avatar: {
        avatar: {
          pending: true,
        },
        isProfile: true,
      },
    },
    hasSignalAccount: true,
  });
  return <ContactDetail {...props} />;
});

story.add('Empty with Account', () => {
  const props = createProps({
    hasSignalAccount: true,
  });
  return <ContactDetail {...props} />;
});

story.add('Empty without Account', () => {
  const props = createProps({
    hasSignalAccount: false,
  });
  return <ContactDetail {...props} />;
});
