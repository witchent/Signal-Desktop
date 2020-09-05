import { pick } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { mapDispatchToProps } from '../actions';
import { Timeline } from '../../components/conversation/Timeline';
import { RenderEmojiPickerProps } from '../../components/conversation/ReactionPicker';
import { StateType } from '../reducer';

import { getIntl } from '../selectors/user';
import {
  getConversationMessagesSelector,
  getConversationSelector,
  getSelectedMessage,
} from '../selectors/conversations';

import { SmartTimelineItem } from './TimelineItem';
import { SmartTypingBubble } from './TypingBubble';
import { SmartLastSeenIndicator } from './LastSeenIndicator';
import { SmartHeroRow } from './HeroRow';
import { SmartTimelineLoadingRow } from './TimelineLoadingRow';
import { SmartEmojiPicker } from './EmojiPicker';

// Workaround: A react component's required properties are filtering up through connect()
//   https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31363
const FilteredSmartTimelineItem = SmartTimelineItem as any;
const FilteredSmartTypingBubble = SmartTypingBubble as any;
const FilteredSmartLastSeenIndicator = SmartLastSeenIndicator as any;
const FilteredSmartHeroRow = SmartHeroRow as any;
const FilteredSmartTimelineLoadingRow = SmartTimelineLoadingRow as any;

type ExternalProps = {
  id: string;

  // Note: most action creators are not wired into redux; for now they
  //   are provided by ConversationView in setupTimeline().
};

function renderItem(
  messageId: string,
  conversationId: string,
  actionProps: Object
): JSX.Element {
  return (
    <FilteredSmartTimelineItem
      {...actionProps}
      conversationId={conversationId}
      id={messageId}
      renderEmojiPicker={renderEmojiPicker}
    />
  );
}
function renderEmojiPicker({
  ref,
  onPickEmoji,
  onClose,
  style,
}: RenderEmojiPickerProps): JSX.Element {
  return (
    <SmartEmojiPicker
      ref={ref}
      onPickEmoji={onPickEmoji}
      onClose={onClose}
      style={style}
      disableSkinTones={true}
    />
  );
}
function renderLastSeenIndicator(id: string): JSX.Element {
  return <FilteredSmartLastSeenIndicator id={id} />;
}
function renderHeroRow(
  id: string,
  onHeightChange: () => unknown,
  updateSharedGroups: () => unknown
): JSX.Element {
  return (
    <FilteredSmartHeroRow
      id={id}
      onHeightChange={onHeightChange}
      updateSharedGroups={updateSharedGroups}
    />
  );
}
function renderLoadingRow(id: string): JSX.Element {
  return <FilteredSmartTimelineLoadingRow id={id} />;
}
function renderTypingBubble(id: string): JSX.Element {
  return <FilteredSmartTypingBubble id={id} />;
}

const mapStateToProps = (state: StateType, props: ExternalProps) => {
  const { id, ...actions } = props;

  const conversation = getConversationSelector(state)(id);
  const conversationMessages = getConversationMessagesSelector(state)(id);
  const selectedMessage = getSelectedMessage(state);

  return {
    id,
    ...pick(conversation, ['unreadCount', 'typingContact']),
    ...conversationMessages,
    selectedMessageId: selectedMessage ? selectedMessage.id : undefined,
    i18n: getIntl(state),
    renderItem,
    renderLastSeenIndicator,
    renderHeroRow,
    renderLoadingRow,
    renderTypingBubble,
    ...actions,
  };
};

const smart = connect(mapStateToProps, mapDispatchToProps);

export const SmartTimeline = smart(Timeline);
