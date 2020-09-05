import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';
import { EmptyState } from './EmptyState';

const story = storiesOf(
  'Components/Conversation/MediaGallery/EmptyState',
  module
);

story.addDecorator((withKnobs as any)({ escapeHTML: false }));

story.add('Default', () => {
  return <EmptyState label={text('label', 'placeholder text')} />;
});
