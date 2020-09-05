import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { setup as setupI18n } from '../../../js/modules/i18n';
import enMessages from '../../../_locales/en/messages.json';

import { EmojiButton } from './EmojiButton';

const i18n = setupI18n('en', enMessages);

storiesOf('Components/Emoji/EmojiButton', module).add('Base', () => {
  return (
    <div
      style={{
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <EmojiButton
        i18n={i18n}
        onPickEmoji={action('onPickEmoji')}
        skinTone={0}
        onSetSkinTone={action('onSetSkinTone')}
        recentEmojis={[
          'grinning',
          'grin',
          'joy',
          'rolling_on_the_floor_laughing',
          'smiley',
          'smile',
          'sweat_smile',
          'laughing',
          'wink',
          'blush',
          'yum',
          'sunglasses',
          'heart_eyes',
          'kissing_heart',
          'kissing',
          'kissing_smiling_eyes',
          'kissing_closed_eyes',
          'relaxed',
          'slightly_smiling_face',
          'hugging_face',
          'grinning_face_with_star_eyes',
          'thinking_face',
          'face_with_one_eyebrow_raised',
          'neutral_face',
          'expressionless',
          'no_mouth',
          'face_with_rolling_eyes',
          'smirk',
          'persevere',
          'disappointed_relieved',
          'open_mouth',
          'zipper_mouth_face',
        ]}
      />
    </div>
  );
});
