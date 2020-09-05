import * as React from 'react';
import { storiesOf } from '@storybook/react';

// @ts-ignore
import { setup as setupI18n } from '../../../js/modules/i18n';

// @ts-ignore
import enMessages from '../../../_locales/en/messages.json';

import { Props, TypingAnimation } from './TypingAnimation';

const i18n = setupI18n('en', enMessages);

const story = storiesOf('Components/Conversation/TypingAnimation', module);

const createProps = (overrideProps: Partial<Props> = {}): Props => ({
  i18n,
  color: overrideProps.color || '',
});

story.add('Default', () => {
  const props = createProps();

  return <TypingAnimation {...props} />;
});

story.add('Light', () => {
  const props = createProps({
    color: 'light',
  });

  return (
    <div style={{ padding: '2em', backgroundColor: 'grey' }}>
      <TypingAnimation {...props} />
    </div>
  );
});
