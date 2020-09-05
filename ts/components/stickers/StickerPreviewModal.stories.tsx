import * as React from 'react';
import { StickerPreviewModal } from './StickerPreviewModal';
// @ts-ignore
import { setup as setupI18n } from '../../../js/modules/i18n';
// @ts-ignore
import enMessages from '../../../_locales/en/messages.json';
import {
  landscapeGreenUrl,
  portraitTealUrl,
  squareStickerUrl,
} from '../../storybook/Fixtures';

import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

const i18n = setupI18n('en', enMessages);

storiesOf('Components/Stickers/StickerPreviewModal', module).add('Full', () => {
  const title = text('title', 'Foo');
  const author = text('author', 'Foo McBarrington');
  const abeSticker = {
    id: -1,
    emoji: '🎩',
    url: squareStickerUrl,
    packId: 'abe',
  };
  const wideSticker = {
    id: -2,
    emoji: '🤯',
    url: landscapeGreenUrl,
    packId: 'wide',
  };
  const tallSticker = {
    id: -3,
    emoji: '🔥',
    url: portraitTealUrl,
    packId: 'tall',
  };

  const pack = {
    id: 'foo',
    key: 'foo',
    lastUsed: Date.now(),
    cover: abeSticker,
    title,
    isBlessed: true,
    author,
    status: 'downloaded' as 'downloaded',
    stickerCount: 101,
    stickers: [
      wideSticker,
      tallSticker,
      ...Array(101)
        .fill(0)
        .map((_n, id) => ({ ...abeSticker, id })),
    ],
  };

  return (
    <StickerPreviewModal
      onClose={action('onClose')}
      installStickerPack={action('installStickerPack')}
      uninstallStickerPack={action('uninstallStickerPack')}
      downloadStickerPack={action('downloadStickerPack')}
      i18n={i18n}
      pack={pack}
    />
  );
});
