import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { Colors } from '../../types/Colors';
import { pngUrl } from '../../storybook/Fixtures';
import { Message, Props as MessagesProps } from './Message';
import { AUDIO_MP3, IMAGE_PNG, MIMEType, VIDEO_MP4 } from '../../types/MIME';
import { Props, Quote } from './Quote';

// @ts-ignore
import { setup as setupI18n } from '../../../js/modules/i18n';
// @ts-ignore
import enMessages from '../../../_locales/en/messages.json';
const i18n = setupI18n('en', enMessages);

const story = storiesOf('Components/Conversation/Quote', module);

const defaultMessageProps: MessagesProps = {
  authorTitle: 'Person X',
  canReply: true,
  clearSelectedMessage: () => null,
  conversationId: 'conversationId',
  conversationType: 'direct', // override
  deleteMessage: () => null,
  direction: 'incoming',
  displayTapToViewMessage: () => null,
  downloadAttachment: () => null,
  i18n,
  id: 'messageId',
  interactionMode: 'keyboard',
  openConversation: () => null,
  openLink: () => null,
  previews: [],
  reactToMessage: () => null,
  renderEmojiPicker: () => <div />,
  replyToMessage: () => null,
  retrySend: () => null,
  scrollToQuotedMessage: () => null,
  selectMessage: () => null,
  showContactDetail: () => null,
  showExpiredIncomingTapToViewToast: () => null,
  showExpiredOutgoingTapToViewToast: () => null,
  showMessageDetail: () => null,
  showVisualAttachment: () => null,
  status: 'sent',
  text: 'This is really interesting.',
  timestamp: Date.now(),
};

const renderInMessage = ({
  attachment,
  authorColor,
  authorName,
  authorPhoneNumber,
  authorProfileName,
  authorTitle,
  isFromMe,
  referencedMessageNotFound,
  text: quoteText,
}: Props) => {
  const messageProps = {
    ...defaultMessageProps,
    authorColor: authorColor,
    quote: {
      attachment,
      authorId: 'an-author',
      authorColor,
      authorName,
      authorPhoneNumber,
      authorProfileName,
      authorTitle,
      isFromMe,
      referencedMessageNotFound,
      sentAt: Date.now() - 30 * 1000,
      text: quoteText,
    },
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      <Message {...messageProps} />
      <br />
      <Message {...messageProps} direction="outgoing" />
    </div>
  );
};

const createProps = (overrideProps: Partial<Props> = {}): Props => ({
  attachment: overrideProps.attachment || undefined,
  authorColor: overrideProps.authorColor || 'green',
  authorName: text('authorName', overrideProps.authorName || ''),
  authorPhoneNumber: text(
    'authorPhoneNumber',
    overrideProps.authorPhoneNumber || ''
  ),
  authorProfileName: text(
    'authorProfileName',
    overrideProps.authorProfileName || ''
  ),
  authorTitle: text('authorTitle', overrideProps.authorTitle || ''),
  i18n,
  isFromMe: boolean('isFromMe', overrideProps.isFromMe || false),
  isIncoming: boolean('isIncoming', overrideProps.isIncoming || false),
  onClick: action('onClick'),
  onClose: action('onClose'),
  referencedMessageNotFound: boolean(
    'referencedMessageNotFound',
    overrideProps.referencedMessageNotFound || false
  ),
  text: text('text', overrideProps.text || 'A sample message from a pal'),
  withContentAbove: boolean(
    'withContentAbove',
    overrideProps.withContentAbove || false
  ),
});

story.add('Outgoing by Another Author', () => {
  const props = createProps({
    authorTitle: 'Terrence Malick',
  });

  return <Quote {...props} />;
});

story.add('Outgoing by Me', () => {
  const props = createProps({
    isFromMe: true,
  });

  return <Quote {...props} />;
});

story.add('Incoming by Another Author', () => {
  const props = createProps({
    authorTitle: 'Terrence Malick',
    isIncoming: true,
  });

  return <Quote {...props} />;
});

story.add('Incoming by Me', () => {
  const props = createProps({
    isFromMe: true,
    isIncoming: true,
  });

  return <Quote {...props} />;
});

story.add('Incoming/Outgoing Colors', () => {
  const props = createProps({});
  return (
    <>
      {Colors.map(color => renderInMessage({ ...props, authorColor: color }))}
    </>
  );
});

story.add('Content Above', () => {
  const props = createProps({
    withContentAbove: true,
  });

  return (
    <>
      <div>Content Above</div>
      <Quote {...props} />
    </>
  );
});

story.add('Image Only', () => {
  const props = createProps({
    attachment: {
      contentType: IMAGE_PNG,
      fileName: 'sax.png',
      isVoiceMessage: false,
      thumbnail: {
        contentType: IMAGE_PNG,
        objectUrl: pngUrl,
      },
    },
  });
  props.text = undefined as any;

  return <Quote {...props} />;
});
story.add('Image Attachment', () => {
  const props = createProps({
    attachment: {
      contentType: IMAGE_PNG,
      fileName: 'sax.png',
      isVoiceMessage: false,
      thumbnail: {
        contentType: IMAGE_PNG,
        objectUrl: pngUrl,
      },
    },
  });

  return <Quote {...props} />;
});

story.add('Image Attachment w/o Thumbnail', () => {
  const props = createProps({
    attachment: {
      contentType: IMAGE_PNG,
      fileName: 'sax.png',
      isVoiceMessage: false,
    },
  });

  return <Quote {...props} />;
});

story.add('Video Only', () => {
  const props = createProps({
    attachment: {
      contentType: VIDEO_MP4,
      fileName: 'great-video.mp4',
      isVoiceMessage: false,
      thumbnail: {
        contentType: IMAGE_PNG,
        objectUrl: pngUrl,
      },
    },
  });
  props.text = undefined as any;

  return <Quote {...props} />;
});

story.add('Video Attachment', () => {
  const props = createProps({
    attachment: {
      contentType: VIDEO_MP4,
      fileName: 'great-video.mp4',
      isVoiceMessage: false,
      thumbnail: {
        contentType: IMAGE_PNG,
        objectUrl: pngUrl,
      },
    },
  });

  return <Quote {...props} />;
});

story.add('Video Attachment w/o Thumbnail', () => {
  const props = createProps({
    attachment: {
      contentType: VIDEO_MP4,
      fileName: 'great-video.mp4',
      isVoiceMessage: false,
    },
  });

  return <Quote {...props} />;
});

story.add('Audio Only', () => {
  const props = createProps({
    attachment: {
      contentType: AUDIO_MP3,
      fileName: 'great-video.mp3',
      isVoiceMessage: false,
    },
  });
  props.text = undefined as any;

  return <Quote {...props} />;
});

story.add('Audio Attachment', () => {
  const props = createProps({
    attachment: {
      contentType: AUDIO_MP3,
      fileName: 'great-video.mp3',
      isVoiceMessage: false,
    },
  });

  return <Quote {...props} />;
});

story.add('Voice Message Only', () => {
  const props = createProps({
    attachment: {
      contentType: AUDIO_MP3,
      fileName: 'great-video.mp3',
      isVoiceMessage: true,
    },
  });
  props.text = undefined as any;

  return <Quote {...props} />;
});

story.add('Voice Message Attachment', () => {
  const props = createProps({
    attachment: {
      contentType: AUDIO_MP3,
      fileName: 'great-video.mp3',
      isVoiceMessage: true,
    },
  });

  return <Quote {...props} />;
});

story.add('Other File Only', () => {
  const props = createProps({
    attachment: {
      contentType: 'application/json' as MIMEType,
      fileName: 'great-data.json',
      isVoiceMessage: false,
    },
  });
  props.text = undefined as any;

  return <Quote {...props} />;
});

story.add('Other File Attachment', () => {
  const props = createProps({
    attachment: {
      contentType: 'application/json' as MIMEType,
      fileName: 'great-data.json',
      isVoiceMessage: false,
    },
  });

  return <Quote {...props} />;
});

story.add('No Close Button', () => {
  const props = createProps();
  props.onClose = undefined;

  return <Quote {...props} />;
});

story.add('Message Not Found', () => {
  const props = createProps({
    referencedMessageNotFound: true,
  });

  return renderInMessage(props);
});

story.add('Missing Text & Attachment', () => {
  const props = createProps();
  props.text = undefined as any;

  return <Quote {...props} />;
});
