import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, number, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { Colors } from '../../types/Colors';
import { EmojiPicker } from '../emoji/EmojiPicker';
import { Message, Props } from './Message';
import {
  AUDIO_MP3,
  IMAGE_JPEG,
  IMAGE_PNG,
  IMAGE_WEBP,
  MIMEType,
  VIDEO_MP4,
} from '../../types/MIME';

// @ts-ignore
import { setup as setupI18n } from '../../../js/modules/i18n';
// @ts-ignore
import enMessages from '../../../_locales/en/messages.json';
import { pngUrl } from '../../storybook/Fixtures';
const i18n = setupI18n('en', enMessages);

const story = storiesOf('Components/Conversation/Message', module);

const renderEmojiPicker: Props['renderEmojiPicker'] = ({
  onClose,
  onPickEmoji,
  ref,
}) => (
  <EmojiPicker
    i18n={setupI18n('en', enMessages)}
    skinTone={0}
    onSetSkinTone={action('EmojiPicker::onSetSkinTone')}
    ref={ref}
    onClose={onClose}
    onPickEmoji={onPickEmoji}
  />
);

const createProps = (overrideProps: Partial<Props> = {}): Props => ({
  attachments: overrideProps.attachments,
  authorColor: overrideProps.authorColor || 'blue',
  authorAvatarPath: overrideProps.authorAvatarPath,
  authorTitle: text('authorTitle', overrideProps.authorTitle || ''),
  canReply: true,
  clearSelectedMessage: action('clearSelectedMessage'),
  collapseMetadata: overrideProps.collapseMetadata,
  conversationId: text('conversationId', overrideProps.conversationId || ''),
  conversationType: overrideProps.conversationType || 'direct',
  deletedForEveryone: overrideProps.deletedForEveryone,
  deleteMessage: action('deleteMessage'),
  disableMenu: overrideProps.disableMenu,
  disableScroll: overrideProps.disableScroll,
  direction: overrideProps.direction || 'incoming',
  displayTapToViewMessage: action('displayTapToViewMessage'),
  downloadAttachment: action('downloadAttachment'),
  expirationLength:
    number('expirationLength', overrideProps.expirationLength || 0) ||
    undefined,
  expirationTimestamp:
    number('expirationTimestamp', overrideProps.expirationTimestamp || 0) ||
    undefined,
  i18n,
  id: text('id', overrideProps.id || ''),
  interactionMode: overrideProps.interactionMode || 'keyboard',
  isTapToView: overrideProps.isTapToView,
  isTapToViewError: overrideProps.isTapToViewError,
  isTapToViewExpired: overrideProps.isTapToViewExpired,
  openConversation: action('openConversation'),
  openLink: action('openLink'),
  previews: overrideProps.previews || [],
  reactions: overrideProps.reactions,
  reactToMessage: action('reactToMessage'),
  renderEmojiPicker: renderEmojiPicker,
  replyToMessage: action('replyToMessage'),
  retrySend: action('retrySend'),
  scrollToQuotedMessage: action('scrollToQuotedMessage'),
  selectMessage: action('selectMessage'),
  showContactDetail: action('showContactDetail'),
  showExpiredIncomingTapToViewToast: action(
    'showExpiredIncomingTapToViewToast'
  ),
  showExpiredOutgoingTapToViewToast: action(
    'showExpiredOutgoingTapToViewToast'
  ),
  showMessageDetail: action('showMessageDetail'),
  showVisualAttachment: action('showVisualAttachment'),
  status: overrideProps.status || 'sent',
  text: text('text', overrideProps.text || ''),
  textPending: boolean('textPending', overrideProps.textPending || false),
  timestamp: number('timestamp', overrideProps.timestamp || Date.now()),
});

const renderBothDirections = (props: Props) => (
  <>
    <Message {...props} />
    <br />
    <Message {...props} direction="outgoing" />
  </>
);

story.add('Plain Message', () => {
  const props = createProps({
    text:
      'Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look.',
  });

  return renderBothDirections(props);
});

story.add('Delivered', () => {
  const props = createProps({
    direction: 'outgoing',
    status: 'delivered',
    text:
      'Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look.',
  });

  return <Message {...props} />;
});

story.add('Read', () => {
  const props = createProps({
    direction: 'outgoing',
    status: 'read',
    text:
      'Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look.',
  });

  return <Message {...props} />;
});

story.add('Sending', () => {
  const props = createProps({
    direction: 'outgoing',
    status: 'sending',
    text:
      'Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look.',
  });

  return <Message {...props} />;
});

story.add('Expiring', () => {
  const props = createProps({
    expirationLength: 30 * 1000,
    expirationTimestamp: Date.now() + 30 * 1000,
    text:
      'Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look.',
  });

  return renderBothDirections(props);
});

story.add('Pending', () => {
  const props = createProps({
    text:
      'Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look.',
    textPending: true,
  });

  return renderBothDirections(props);
});

story.add('Collapsed Metadata', () => {
  const props = createProps({
    authorTitle: 'Fred Willard',
    collapseMetadata: true,
    conversationType: 'group',
    text: 'Hello there from a pal!',
  });

  return renderBothDirections(props);
});

story.add('Recent', () => {
  const props = createProps({
    text: 'Hello there from a pal!',
    timestamp: Date.now() - 30 * 60 * 1000,
  });

  return renderBothDirections(props);
});

story.add('Older', () => {
  const props = createProps({
    text: 'Hello there from a pal!',
    timestamp: Date.now() - 180 * 24 * 60 * 60 * 1000,
  });

  return renderBothDirections(props);
});

// tslint:disable-next-line:max-func-body-length
story.add('Reactions', () => {
  const props = createProps({
    text: 'Hello there from a pal!',
    timestamp: Date.now() - 180 * 24 * 60 * 60 * 1000,
    reactions: [
      {
        emoji: '👍',
        from: {
          isMe: true,
          id: '+14155552672',
          phoneNumber: '+14155552672',
          name: 'Me',
          title: 'Me',
        },
        timestamp: Date.now() - 10,
      },
      {
        emoji: '👍',
        from: {
          id: '+14155552672',
          phoneNumber: '+14155552672',
          name: 'Amelia Briggs',
          title: 'Amelia',
        },
        timestamp: Date.now() - 10,
      },
      {
        emoji: '👍',
        from: {
          id: '+14155552673',
          phoneNumber: '+14155552673',
          name: 'Amelia Briggs',
          title: 'Amelia',
        },
        timestamp: Date.now() - 10,
      },
      {
        emoji: '😂',
        from: {
          id: '+14155552674',
          phoneNumber: '+14155552674',
          name: 'Amelia Briggs',
          title: 'Amelia',
        },
        timestamp: Date.now() - 10,
      },
      {
        emoji: '😂',
        from: {
          id: '+14155552676',
          phoneNumber: '+14155552676',
          name: 'Amelia Briggs',
          title: 'Amelia',
        },
        timestamp: Date.now() - 10,
      },
      {
        emoji: '😡',
        from: {
          id: '+14155552677',
          phoneNumber: '+14155552677',
          name: 'Amelia Briggs',
          title: 'Amelia',
        },
        timestamp: Date.now() - 10,
      },
      {
        emoji: '👎',
        from: {
          id: '+14155552678',
          phoneNumber: '+14155552678',
          name: 'Amelia Briggs',
          title: 'Amelia',
        },
        timestamp: Date.now() - 10,
      },
      {
        emoji: '❤️',
        from: {
          id: '+14155552679',
          phoneNumber: '+14155552679',
          name: 'Amelia Briggs',
          title: 'Amelia',
        },
        timestamp: Date.now() - 10,
      },
    ],
  });

  return renderBothDirections(props);
});

story.add('Avatar in Group', () => {
  const props = createProps({
    authorAvatarPath: pngUrl,
    conversationType: 'group',
    status: 'sent',
    text: 'Hello it is me, the saxophone.',
  });

  return <Message {...props} />;
});

story.add('Sticker', () => {
  const props = createProps({
    attachments: [
      {
        url: '/fixtures/512x515-thumbs-up-lincoln.webp',
        fileName: '512x515-thumbs-up-lincoln.webp',
        contentType: IMAGE_WEBP,
        width: 128,
        height: 128,
      },
    ],
    isSticker: true,
    status: 'sent',
  });

  return renderBothDirections(props);
});

story.add('Deleted', () => {
  const props = createProps({
    conversationType: 'group',
    deletedForEveryone: true,
    status: 'sent',
  });

  return renderBothDirections(props);
});

story.add('Error', () => {
  const props = createProps({
    status: 'error',
    text: 'I hope you get this.',
  });

  return renderBothDirections(props);
});

story.add('Partial Send', () => {
  const props = createProps({
    status: 'partial-sent',
    text: 'I hope you get this.',
  });

  return renderBothDirections(props);
});

story.add('Link Preview', () => {
  const props = createProps({
    previews: [
      {
        domain: 'signal.org',
        image: {
          contentType: IMAGE_PNG,
          fileName: 'the-sax.png',
          height: 240,
          url: pngUrl,
          width: 320,
        },
        isStickerPack: false,
        title: 'Signal',
        description:
          'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
        url: 'https://www.signal.org',
        date: new Date(2020, 2, 10).valueOf(),
      },
    ],
    status: 'sent',
    text: 'Be sure to look at https://www.signal.org',
  });

  return renderBothDirections(props);
});

story.add('Link Preview with Small Image', () => {
  const props = createProps({
    previews: [
      {
        domain: 'signal.org',
        image: {
          contentType: IMAGE_PNG,
          fileName: 'the-sax.png',
          height: 50,
          url: pngUrl,
          width: 50,
        },
        isStickerPack: false,
        title: 'Signal',
        description:
          'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
        url: 'https://www.signal.org',
        date: new Date(2020, 2, 10).valueOf(),
      },
    ],
    status: 'sent',
    text: 'Be sure to look at https://www.signal.org',
  });

  return renderBothDirections(props);
});

story.add('Link Preview without Image', () => {
  const props = createProps({
    previews: [
      {
        domain: 'signal.org',
        isStickerPack: false,
        title: 'Signal',
        description:
          'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
        url: 'https://www.signal.org',
        date: new Date(2020, 2, 10).valueOf(),
      },
    ],
    status: 'sent',
    text: 'Be sure to look at https://www.signal.org',
  });

  return renderBothDirections(props);
});

story.add('Link Preview with no description', () => {
  const props = createProps({
    previews: [
      {
        domain: 'signal.org',
        isStickerPack: false,
        title: 'Signal',
        url: 'https://www.signal.org',
        date: Date.now(),
      },
    ],
    status: 'sent',
    text: 'Be sure to look at https://www.signal.org',
  });

  return renderBothDirections(props);
});

story.add('Link Preview with long description', () => {
  const props = createProps({
    previews: [
      {
        domain: 'signal.org',
        isStickerPack: false,
        title: 'Signal',
        description: Array(10)
          .fill(
            'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.'
          )
          .join(' '),
        url: 'https://www.signal.org',
        date: Date.now(),
      },
    ],
    status: 'sent',
    text: 'Be sure to look at https://www.signal.org',
  });

  return renderBothDirections(props);
});

story.add('Link Preview with small image, long description', () => {
  const props = createProps({
    previews: [
      {
        domain: 'signal.org',
        image: {
          contentType: IMAGE_PNG,
          fileName: 'the-sax.png',
          height: 50,
          url: pngUrl,
          width: 50,
        },
        isStickerPack: false,
        title: 'Signal',
        description: Array(10)
          .fill(
            'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.'
          )
          .join(' '),
        url: 'https://www.signal.org',
        date: Date.now(),
      },
    ],
    status: 'sent',
    text: 'Be sure to look at https://www.signal.org',
  });

  return renderBothDirections(props);
});

story.add('Link Preview with no date', () => {
  const props = createProps({
    previews: [
      {
        domain: 'signal.org',
        image: {
          contentType: IMAGE_PNG,
          fileName: 'the-sax.png',
          height: 240,
          url: pngUrl,
          width: 320,
        },
        isStickerPack: false,
        title: 'Signal',
        description:
          'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
        url: 'https://www.signal.org',
      },
    ],
    status: 'sent',
    text: 'Be sure to look at https://www.signal.org',
  });

  return renderBothDirections(props);
});

story.add('Link Preview with too old a date', () => {
  const props = createProps({
    previews: [
      {
        domain: 'signal.org',
        image: {
          contentType: IMAGE_PNG,
          fileName: 'the-sax.png',
          height: 240,
          url: pngUrl,
          width: 320,
        },
        isStickerPack: false,
        title: 'Signal',
        description:
          'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
        url: 'https://www.signal.org',
        date: 123,
      },
    ],
    status: 'sent',
    text: 'Be sure to look at https://www.signal.org',
  });

  return renderBothDirections(props);
});

story.add('Link Preview with too new a date', () => {
  const props = createProps({
    previews: [
      {
        domain: 'signal.org',
        image: {
          contentType: IMAGE_PNG,
          fileName: 'the-sax.png',
          height: 240,
          url: pngUrl,
          width: 320,
        },
        isStickerPack: false,
        title: 'Signal',
        description:
          'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
        url: 'https://www.signal.org',
        date: Date.now() + 3000000000,
      },
    ],
    status: 'sent',
    text: 'Be sure to look at https://www.signal.org',
  });

  return renderBothDirections(props);
});

story.add('Image', () => {
  const props = createProps({
    attachments: [
      {
        url: '/fixtures/tina-rolf-269345-unsplash.jpg',
        fileName: 'tina-rolf-269345-unsplash.jpg',
        contentType: IMAGE_JPEG,
        width: 128,
        height: 128,
      },
    ],
    status: 'sent',
  });

  return renderBothDirections(props);
});

story.add('Image with Caption', () => {
  const props = createProps({
    attachments: [
      {
        url: '/fixtures/tina-rolf-269345-unsplash.jpg',
        fileName: 'tina-rolf-269345-unsplash.jpg',
        contentType: IMAGE_JPEG,
        width: 128,
        height: 128,
      },
    ],
    status: 'sent',
    text: 'This is my home.',
  });

  return renderBothDirections(props);
});

story.add('Audio', () => {
  const props = createProps({
    attachments: [
      {
        contentType: AUDIO_MP3,
        fileName: 'incompetech-com-Agnus-Dei-X.mp3',
        url: '/fixtures/incompetech-com-Agnus-Dei-X.mp3',
      },
    ],
    status: 'sent',
  });

  return renderBothDirections(props);
});

story.add('Audio with Caption', () => {
  const props = createProps({
    attachments: [
      {
        contentType: AUDIO_MP3,
        fileName: 'incompetech-com-Agnus-Dei-X.mp3',
        url: '/fixtures/incompetech-com-Agnus-Dei-X.mp3',
      },
    ],
    status: 'sent',
    text: 'This is what I sound like.',
  });

  return renderBothDirections(props);
});

story.add('Other File Type', () => {
  const props = createProps({
    attachments: [
      {
        contentType: 'text/plain' as MIMEType,
        fileName: 'my-resume.txt',
        url: 'my-resume.txt',
      },
    ],
    status: 'sent',
  });

  return renderBothDirections(props);
});

story.add('Other File Type with Caption', () => {
  const props = createProps({
    attachments: [
      {
        contentType: 'text/plain' as MIMEType,
        fileName: 'my-resume.txt',
        url: 'my-resume.txt',
      },
    ],
    status: 'sent',
    text: 'This is what I have done.',
  });

  return renderBothDirections(props);
});

story.add('TapToView Image', () => {
  const props = createProps({
    attachments: [
      {
        url: '/fixtures/tina-rolf-269345-unsplash.jpg',
        fileName: 'tina-rolf-269345-unsplash.jpg',
        contentType: IMAGE_JPEG,
        width: 128,
        height: 128,
      },
    ],
    isTapToView: true,
    status: 'sent',
  });

  return renderBothDirections(props);
});

story.add('TapToView Video', () => {
  const props = createProps({
    attachments: [
      {
        contentType: VIDEO_MP4,
        fileName: 'pixabay-Soap-Bubble-7141.mp4',
        height: 128,
        url: '/fixtures/pixabay-Soap-Bubble-7141.mp4',
        width: 128,
      },
    ],
    isTapToView: true,
    status: 'sent',
  });

  return renderBothDirections(props);
});

story.add('TapToView Expired', () => {
  const props = createProps({
    attachments: [
      {
        url: '/fixtures/tina-rolf-269345-unsplash.jpg',
        fileName: 'tina-rolf-269345-unsplash.jpg',
        contentType: IMAGE_JPEG,
        width: 128,
        height: 128,
      },
    ],
    isTapToView: true,
    isTapToViewExpired: true,
    status: 'sent',
  });

  return renderBothDirections(props);
});

story.add('TapToView Error', () => {
  const props = createProps({
    attachments: [
      {
        url: '/fixtures/tina-rolf-269345-unsplash.jpg',
        fileName: 'tina-rolf-269345-unsplash.jpg',
        contentType: IMAGE_JPEG,
        width: 128,
        height: 128,
      },
    ],
    isTapToView: true,
    isTapToViewError: true,
    status: 'sent',
  });

  return <Message {...props} />;
});

story.add('Dangerous File Type', () => {
  const props = createProps({
    attachments: [
      {
        contentType: 'application/vnd.microsoft.portable-executable' as MIMEType,
        fileName: 'terrible.exe',
        url: 'terrible.exe',
      },
    ],
    status: 'sent',
  });

  return renderBothDirections(props);
});

story.add('Colors', () => {
  const defaultProps = createProps({
    text:
      'Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look.',
  });

  return (
    <>
      {Colors.map(color => (
        <Message {...defaultProps} authorColor={color} />
      ))}
    </>
  );
});
