import * as React from 'react';
import { RelinkDialog } from './RelinkDialog';

// @ts-ignore
import { setup as setupI18n } from '../../js/modules/i18n';
// @ts-ignore
import enMessages from '../../_locales/en/messages.json';

import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

const i18n = setupI18n('en', enMessages);

const defaultProps = {
  i18n,
  isRegistrationDone: true,
  relinkDevice: action('relink-device'),
};

const permutations = [
  {
    title: 'Unlinked',
    props: {
      isRegistrationDone: false,
    },
  },
];

storiesOf('Components/RelinkDialog', module)
  .add('Knobs Playground', () => {
    const isRegistrationDone = boolean('isRegistrationDone', false);

    return (
      <RelinkDialog {...defaultProps} isRegistrationDone={isRegistrationDone} />
    );
  })
  .add('Iterations', () => {
    return permutations.map(({ props, title }) => (
      <>
        <h3>{title}</h3>
        <RelinkDialog {...defaultProps} {...props} />
      </>
    ));
  });
