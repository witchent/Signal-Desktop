import * as React from 'react';
import { sample } from 'lodash';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

// @ts-ignore
import { setup as setupI18n } from '../../../js/modules/i18n';

// @ts-ignore
import enMessages from '../../../_locales/en/messages.json';

import { Props, StickerPicker } from './StickerPicker';
import { StickerPackType, StickerType } from '../../state/ducks/stickers';

const i18n = setupI18n('en', enMessages);

const story = storiesOf('Components/Stickers/StickerPicker', module);

export const sticker1: StickerType = {
  id: 1,
  url: '/fixtures/kitten-1-64-64.jpg',
  packId: 'foo',
  emoji: '',
};

export const sticker2: StickerType = {
  id: 2,
  url: '/fixtures/kitten-2-64-64.jpg',
  packId: 'bar',
  emoji: '',
};

export const sticker3: StickerType = {
  id: 3,
  url: '/fixtures/kitten-3-64-64.jpg',
  packId: 'baz',
  emoji: '',
};

export const abeSticker: StickerType = {
  id: 4,
  url: '/fixtures/512x515-thumbs-up-lincoln.webp',
  packId: 'abe',
  emoji: '',
};

export const wideSticker: StickerType = {
  id: 5,
  url: '/fixtures/1000x50-green.jpeg',
  packId: 'wide',
  emoji: '',
};

export const tallSticker: StickerType = {
  id: 6,
  url: '/fixtures/50x1000-teal.jpeg',
  packId: 'tall',
  emoji: '',
};

const choosableStickers = [sticker1, sticker2, sticker3, abeSticker];

export const createPack = (
  props: Partial<StickerPackType>,
  sticker?: StickerType
): StickerPackType => ({
  id: '',
  title: props.id ? `${props.id} title` : 'title',
  key: '',
  author: '',
  isBlessed: false,
  lastUsed: 0,
  status: 'known',
  cover: sticker,
  stickerCount: 101,
  stickers: sticker
    ? Array(101)
        .fill(0)
        .map((_, id) => ({ ...sticker, id }))
    : [],
  ...props,
});

const packs = [
  createPack({ id: 'tall' }, tallSticker),
  createPack({ id: 'wide' }, wideSticker),
  ...Array(20)
    .fill(0)
    .map((_, n) =>
      createPack({ id: `pack-${n}` }, sample(choosableStickers) as StickerType)
    ),
];

const recentStickers = [
  abeSticker,
  sticker1,
  sticker2,
  sticker3,
  tallSticker,
  wideSticker,
  { ...sticker2, id: 9999 },
];

const createProps = (overrideProps: Partial<Props> = {}): Props => ({
  i18n,
  onClickAddPack: action('onClickAddPack'),
  onClose: action('onClose'),
  onPickSticker: action('onPickSticker'),
  packs: overrideProps.packs || [],
  recentStickers: overrideProps.recentStickers || [],
  showPickerHint: boolean(
    'showPickerHint',
    overrideProps.showPickerHint || false
  ),
});

story.add('Full', () => {
  const props = createProps({ packs, recentStickers });

  return <StickerPicker {...props} />;
});

story.add('Picker Hint', () => {
  const props = createProps({ packs, recentStickers, showPickerHint: true });

  return <StickerPicker {...props} />;
});

story.add('No Recent Stickers', () => {
  const props = createProps({ packs });

  return <StickerPicker {...props} />;
});

story.add('Empty', () => {
  const props = createProps();

  return <StickerPicker {...props} />;
});

story.add('Pending Download', () => {
  const pack = createPack(
    { status: 'pending', stickers: [abeSticker] },
    abeSticker
  );
  const props = createProps({ packs: [pack] });

  return <StickerPicker {...props} />;
});

story.add('Error', () => {
  const pack = createPack(
    { status: 'error', stickers: [abeSticker] },
    abeSticker
  );
  const props = createProps({ packs: [pack] });

  return <StickerPicker {...props} />;
});

story.add('No Cover', () => {
  const pack = createPack({ status: 'error', stickers: [abeSticker] });
  const props = createProps({ packs: [pack] });

  return <StickerPicker {...props} />;
});
