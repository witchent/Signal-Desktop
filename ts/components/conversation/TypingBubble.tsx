import React from 'react';
import classNames from 'classnames';

import { TypingAnimation } from './TypingAnimation';
import { Avatar } from '../Avatar';

import { LocalizerType } from '../../types/Util';
import { ColorType } from '../../types/Colors';

export interface Props {
  avatarPath?: string;
  color: ColorType;
  name?: string;
  phoneNumber?: string;
  profileName?: string;
  title: string;
  conversationType: 'group' | 'direct';
  i18n: LocalizerType;
}

export class TypingBubble extends React.PureComponent<Props> {
  public renderAvatar() {
    const {
      avatarPath,
      color,
      name,
      phoneNumber,
      profileName,
      title,
      conversationType,
      i18n,
    } = this.props;

    if (conversationType !== 'group') {
      return;
    }

    return (
      <div className="module-message__author-avatar">
        <Avatar
          avatarPath={avatarPath}
          color={color}
          conversationType="direct"
          i18n={i18n}
          name={name}
          phoneNumber={phoneNumber}
          profileName={profileName}
          title={title}
          size={28}
        />
      </div>
    );
  }

  public render() {
    const { i18n, color, conversationType } = this.props;
    const isGroup = conversationType === 'group';

    return (
      <div
        className={classNames(
          'module-message',
          'module-message--incoming',
          isGroup ? 'module-message--group' : null
        )}
      >
        <div
          className={classNames(
            'module-message__container',
            'module-message__container--incoming',
            `module-message__container--incoming-${color}`
          )}
        >
          <div className="module-message__typing-container">
            <TypingAnimation color="light" i18n={i18n} />
          </div>
          {this.renderAvatar()}
        </div>
      </div>
    );
  }
}
