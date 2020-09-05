import * as React from 'react';

import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { AddNewLines, Props } from './AddNewLines';

const story = storiesOf('Components/Conversation/AddNewLines', module);
const createProps = (overrideProps: Partial<Props> = {}): Props => ({
  renderNonNewLine: overrideProps.renderNonNewLine,
  text: text('text', overrideProps.text || ''),
});

story.add('All newlines', () => {
  const props = createProps({
    text: '\n\n\n',
  });

  return <AddNewLines {...props} />;
});

story.add('Starting/Ending with Newlines', () => {
  const props = createProps({
    text: '\nSome text\n',
  });

  return <AddNewLines {...props} />;
});

story.add('Newlines in the Middle', () => {
  const props = createProps({
    text: 'Some\ntext',
  });

  return <AddNewLines {...props} />;
});

story.add('No Newlines', () => {
  const props = createProps({
    text: 'Some text',
  });

  return <AddNewLines {...props} />;
});

story.add('Custom Render Function', () => {
  const props = createProps({
    text: 'Some text',
    renderNonNewLine: ({ text: theText, key }) => (
      <div key={key} style={{ color: 'aquamarine' }}>
        {theText}
      </div>
    ),
  });

  return <AddNewLines {...props} />;
});
