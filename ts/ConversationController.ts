const MAX_MESSAGE_BODY_LENGTH = 64 * 1024;

import { debounce, reduce, uniq, without } from 'lodash';
import dataInterface from './sql/Client';
import {
  ConversationModelCollectionType,
  ConversationModelType,
  ConversationTypeType,
} from './model-types.d';
import { SendOptionsType } from './textsecure/SendMessage';

const {
  getAllConversations,
  getAllGroupsInvolvingId,
  getMessagesBySentAt,
  migrateConversationMessages,
  removeConversation,
  saveConversation,
  updateConversation,
} = dataInterface;

// We have to run this in background.js, after all backbone models and collections on
//   Whisper.* have been created. Once those are in typescript we can use more reasonable
//   require statements for referencing these things, giving us more flexibility here.
export function start() {
  const conversations = new window.Whisper.ConversationCollection();

  // This class is entirely designed to keep the app title, badge and tray icon updated.
  //   In the future it could listen to redux changes and do its updates there.
  const inboxCollection = new (window.Backbone.Collection.extend({
    initialize() {
      this.listenTo(conversations, 'add change:active_at', this.addActive);
      this.listenTo(conversations, 'reset', () => this.reset([]));

      this.on(
        'add remove change:unreadCount',
        debounce(this.updateUnreadCount.bind(this), 1000)
      );
    },
    addActive(model: ConversationModelType) {
      if (model.get('active_at')) {
        this.add(model);
      } else {
        this.remove(model);
      }
    },
    updateUnreadCount() {
      const newUnreadCount = reduce(
        this.map((m: ConversationModelType) => m.get('unreadCount')),
        (item: number, memo: number) => (item || 0) + memo,
        0
      );
      window.storage.put('unreadCount', newUnreadCount);

      if (newUnreadCount > 0) {
        window.setBadgeCount(newUnreadCount);
        window.document.title = `${window.getTitle()} (${newUnreadCount})`;
      } else {
        window.setBadgeCount(0);
        window.document.title = window.getTitle();
      }
      window.updateTrayIcon(newUnreadCount);
    },
  }))();

  window.getInboxCollection = () => inboxCollection;
  window.getConversations = () => conversations;
  window.ConversationController = new ConversationController(conversations);
}

export class ConversationController {
  _initialFetchComplete: boolean | undefined;
  _initialPromise: Promise<void> = Promise.resolve();
  _conversations: ConversationModelCollectionType;

  constructor(conversations?: ConversationModelCollectionType) {
    if (!conversations) {
      throw new Error('ConversationController: need conversation collection!');
    }

    this._conversations = conversations;
  }

  get(id?: string | null): ConversationModelType | undefined {
    if (!this._initialFetchComplete) {
      throw new Error(
        'ConversationController.get() needs complete initial fetch'
      );
    }

    // This function takes null just fine. Backbone typings are too restrictive.
    return this._conversations.get(id as string);
  }
  dangerouslyCreateAndAdd(attributes: Partial<ConversationModelType>) {
    return this._conversations.add(attributes);
  }
  getOrCreate(
    identifier: string,
    type: ConversationTypeType,
    additionalInitialProps = {}
  ) {
    if (typeof identifier !== 'string') {
      throw new TypeError("'id' must be a string");
    }

    if (type !== 'private' && type !== 'group') {
      throw new TypeError(
        `'type' must be 'private' or 'group'; got: '${type}'`
      );
    }

    if (!this._initialFetchComplete) {
      throw new Error(
        'ConversationController.get() needs complete initial fetch'
      );
    }

    let conversation = this._conversations.get(identifier);
    if (conversation) {
      return conversation;
    }

    const id = window.getGuid();

    if (type === 'group') {
      conversation = this._conversations.add({
        id,
        uuid: null,
        e164: null,
        groupId: identifier,
        type,
        version: 2,
        ...additionalInitialProps,
      });
    } else if (window.isValidGuid(identifier)) {
      conversation = this._conversations.add({
        id,
        uuid: identifier,
        e164: null,
        groupId: null,
        type,
        version: 2,
        ...additionalInitialProps,
      });
    } else {
      conversation = this._conversations.add({
        id,
        uuid: null,
        e164: identifier,
        groupId: null,
        type,
        version: 2,
        ...additionalInitialProps,
      });
    }

    const create = async () => {
      if (!conversation.isValid()) {
        const validationError = conversation.validationError || {};
        window.log.error(
          'Contact is not valid. Not saving, but adding to collection:',
          conversation.idForLogging(),
          validationError.stack
        );

        return conversation;
      }

      try {
        await saveConversation(conversation.attributes);
      } catch (error) {
        window.log.error(
          'Conversation save failed! ',
          identifier,
          type,
          'Error:',
          error && error.stack ? error.stack : error
        );
        throw error;
      }

      return conversation;
    };

    conversation.initialPromise = create();

    return conversation;
  }
  async getOrCreateAndWait(
    id: string,
    type: ConversationTypeType,
    additionalInitialProps = {}
  ) {
    return this._initialPromise.then(async () => {
      const conversation = this.getOrCreate(id, type, additionalInitialProps);

      if (conversation) {
        return conversation.initialPromise.then(() => conversation);
      }

      return Promise.reject(
        new Error('getOrCreateAndWait: did not get conversation')
      );
    });
  }
  getConversationId(address: string) {
    if (!address) {
      return null;
    }

    const [id] = window.textsecure.utils.unencodeNumber(address);
    const conv = this.get(id);

    if (conv) {
      return conv.get('id');
    }

    return null;
  }
  getOurConversationId() {
    const e164 = window.textsecure.storage.user.getNumber();
    const uuid = window.textsecure.storage.user.getUuid();
    return this.ensureContactIds({ e164, uuid, highTrust: true });
  }
  /**
   * Given a UUID and/or an E164, resolves to a string representing the local
   * database id of the given contact. In high trust mode, it may create new contacts,
   * and it may merge contacts.
   *
   * highTrust = uuid/e164 pairing came from CDS, the server, or your own device
   */
  // tslint:disable-next-line cyclomatic-complexity max-func-body-length
  ensureContactIds({
    e164,
    uuid,
    highTrust,
  }: {
    e164?: string;
    uuid?: string;
    highTrust?: boolean;
  }) {
    // Check for at least one parameter being provided. This is necessary
    // because this path can be called on startup to resolve our own ID before
    // our phone number or UUID are known. The existing behavior in these
    // cases can handle a returned `undefined` id, so we do that.
    const normalizedUuid = uuid ? uuid.toLowerCase() : undefined;
    const identifier = normalizedUuid || e164;

    if ((!e164 && !uuid) || !identifier) {
      return undefined;
    }

    const convoE164 = this.get(e164);
    const convoUuid = this.get(normalizedUuid);

    // 1. Handle no match at all
    if (!convoE164 && !convoUuid) {
      window.log.info(
        'ensureContactIds: Creating new contact, no matches found'
      );
      const newConvo = this.getOrCreate(identifier, 'private');
      if (highTrust && e164) {
        newConvo.updateE164(e164);
      }
      if (normalizedUuid) {
        newConvo.updateUuid(normalizedUuid);
      }
      if (highTrust && e164 && normalizedUuid) {
        updateConversation(newConvo.attributes);
      }

      return newConvo.get('id');

      // 2. Handle match on only E164
    } else if (convoE164 && !convoUuid) {
      const haveUuid = Boolean(normalizedUuid);
      window.log.info(
        `ensureContactIds: e164-only match found (have UUID: ${haveUuid})`
      );
      // If we are only searching based on e164 anyway, then return the first result
      if (!normalizedUuid) {
        return convoE164.get('id');
      }

      // Fill in the UUID for an e164-only contact
      if (normalizedUuid && !convoE164.get('uuid')) {
        if (highTrust) {
          window.log.info('ensureContactIds: Adding UUID to e164-only match');
          convoE164.updateUuid(normalizedUuid);
          updateConversation(convoE164.attributes);
        }
        return convoE164.get('id');
      }

      window.log.info(
        'ensureContactIds: e164 already had UUID, creating a new contact'
      );
      // If existing e164 match already has UUID, create a new contact...
      const newConvo = this.getOrCreate(normalizedUuid, 'private');

      if (highTrust) {
        window.log.info(
          'ensureContactIds: Moving e164 from old contact to new'
        );

        // Remove the e164 from the old contact...
        convoE164.set({ e164: undefined });
        updateConversation(convoE164.attributes);

        // ...and add it to the new one.
        newConvo.updateE164(e164);
        updateConversation(newConvo.attributes);
      }

      return newConvo.get('id');

      // 3. Handle match on only UUID
    } else if (!convoE164 && convoUuid) {
      window.log.info(
        `ensureContactIds: UUID-only match found (have e164: ${Boolean(e164)})`
      );
      if (e164 && highTrust) {
        convoUuid.updateE164(e164);
        updateConversation(convoUuid.attributes);
      }
      return convoUuid.get('id');
    }

    // For some reason, TypeScript doesn't believe that we can trust that these two values
    //   are truthy by this point. So we'll throw if we get there.
    if (!convoE164 || !convoUuid) {
      throw new Error('ensureContactIds: convoE164 or convoUuid are falsey!');
    }

    // Now, we know that we have a match for both e164 and uuid checks

    if (convoE164 === convoUuid) {
      return convoUuid.get('id');
    }

    if (highTrust) {
      // Conflict: If e164 match already has a UUID, we remove its e164.
      if (convoE164.get('uuid') && convoE164.get('uuid') !== normalizedUuid) {
        window.log.info(
          'ensureContactIds: e164 match had different UUID than incoming pair, removing its e164.'
        );

        // Remove the e164 from the old contact...
        convoE164.set({ e164: undefined });
        updateConversation(convoE164.attributes);

        // ...and add it to the new one.
        convoUuid.updateE164(e164);
        updateConversation(convoUuid.attributes);

        return convoUuid.get('id');
      }

      window.log.warn(
        `ensureContactIds: Found a split contact - UUID ${normalizedUuid} and E164 ${e164}. Merging.`
      );

      // Conflict: If e164 match has no UUID, we merge. We prefer the UUID match.
      // Note: no await here, we want to keep this function synchronous
      convoUuid.updateE164(e164);
      this.combineContacts(convoUuid, convoE164)
        .then(() => {
          // If the old conversation was currently displayed, we load the new one
          window.Whisper.events.trigger('refreshConversation', {
            newId: convoUuid.get('id'),
            oldId: convoE164.get('id'),
          });
        })
        .catch(error => {
          const errorText = error && error.stack ? error.stack : error;
          window.log.warn(
            `ensureContactIds error combining contacts: ${errorText}`
          );
        });
    }

    return convoUuid.get('id');
  }
  async checkForConflicts() {
    window.log.info('checkForConflicts: starting...');
    const byUuid = Object.create(null);
    const byE164 = Object.create(null);

    // We iterate from the oldest conversations to the newest. This allows us, in a
    //   conflict case, to keep the one with activity the most recently.
    const models = [...this._conversations.models.reverse()];

    const max = models.length;
    for (let i = 0; i < max; i += 1) {
      const conversation = models[i];
      const uuid = conversation.get('uuid');
      const e164 = conversation.get('e164');

      if (uuid) {
        const existing = byUuid[uuid];
        if (!existing) {
          byUuid[uuid] = conversation;
        } else {
          window.log.warn(
            `checkForConflicts: Found conflict with uuid ${uuid}`
          );

          // Keep the newer one if it has an e164, otherwise keep existing
          if (conversation.get('e164')) {
            // Keep new one
            // eslint-disable-next-line no-await-in-loop
            await this.combineContacts(conversation, existing);
            byUuid[uuid] = conversation;
          } else {
            // Keep existing - note that this applies if neither had an e164
            // eslint-disable-next-line no-await-in-loop
            await this.combineContacts(existing, conversation);
          }
        }
      }

      if (e164) {
        const existing = byE164[e164];
        if (!existing) {
          byE164[e164] = conversation;
        } else {
          // If we have two contacts with the same e164 but different truthy UUIDs, then
          //   we'll delete the e164 on the older one
          if (
            conversation.get('uuid') &&
            existing.get('uuid') &&
            conversation.get('uuid') !== existing.get('uuid')
          ) {
            window.log.warn(
              `checkForConflicts: Found two matches on e164 ${e164} with different truthy UUIDs. Dropping e164 on older.`
            );

            existing.set({ e164: undefined });
            updateConversation(existing.attributes);

            byE164[e164] = conversation;

            // eslint-disable-next-line no-continue
            continue;
          }

          window.log.warn(
            `checkForConflicts: Found conflict with e164 ${e164}`
          );

          // Keep the newer one if it has a UUID, otherwise keep existing
          if (conversation.get('uuid')) {
            // Keep new one
            // eslint-disable-next-line no-await-in-loop
            await this.combineContacts(conversation, existing);
            byE164[e164] = conversation;
          } else {
            // Keep existing - note that this applies if neither had a UUID
            // eslint-disable-next-line no-await-in-loop
            await this.combineContacts(existing, conversation);
          }
        }
      }
    }

    window.log.info('checkForConflicts: complete!');
  }
  async combineContacts(
    current: ConversationModelType,
    obsolete: ConversationModelType
  ) {
    const obsoleteId = obsolete.get('id');
    const currentId = current.get('id');
    window.log.warn('combineContacts: Combining two conversations', {
      obsolete: obsoleteId,
      current: currentId,
    });

    if (!current.get('profileKey') && obsolete.get('profileKey')) {
      window.log.warn(
        'combineContacts: Copying profile key from old to new contact'
      );

      await current.setProfileKey(obsolete.get('profileKey'));
    }

    window.log.warn(
      'combineContacts: Delete all sessions tied to old conversationId'
    );
    const deviceIds = await window.textsecure.storage.protocol.getDeviceIds(
      obsoleteId
    );
    await Promise.all(
      deviceIds.map(async deviceId => {
        await window.textsecure.storage.protocol.removeSession(
          `${obsoleteId}.${deviceId}`
        );
      })
    );

    window.log.warn(
      'combineContacts: Delete all identity information tied to old conversationId'
    );
    await window.textsecure.storage.protocol.removeIdentityKey(obsoleteId);

    window.log.warn(
      'combineContacts: Ensure that all V1 groups have new conversationId instead of old'
    );
    const groups = await this.getAllGroupsInvolvingId(obsoleteId);
    groups.forEach(group => {
      const members = group.get('members');
      const withoutObsolete = without(members, obsoleteId);
      const currentAdded = uniq([...withoutObsolete, currentId]);

      group.set({
        members: currentAdded,
      });
      updateConversation(group.attributes);
    });

    // Note: we explicitly don't want to update V2 groups

    window.log.warn(
      'combineContacts: Delete the obsolete conversation from the database'
    );
    await removeConversation(obsoleteId, {
      Conversation: window.Whisper.Conversation,
    });

    window.log.warn('combineContacts: Update messages table');
    await migrateConversationMessages(obsoleteId, currentId);

    window.log.warn(
      'combineContacts: Eliminate old conversation from ConversationController lookups'
    );
    this._conversations.remove(obsolete);
    this._conversations.resetLookups();

    window.log.warn('combineContacts: Complete!', {
      obsolete: obsoleteId,
      current: currentId,
    });
  }
  /**
   * Given a groupId and optional additional initialization properties,
   * ensures the existence of a group conversation and returns a string
   * representing the local database ID of the group conversation.
   */
  ensureGroup(groupId: string, additionalInitProps = {}) {
    return this.getOrCreate(groupId, 'group', additionalInitProps).get('id');
  }
  /**
   * Given certain metadata about a message (an identifier of who wrote the
   * message and the sent_at timestamp of the message) returns the
   * conversation the message belongs to OR null if a conversation isn't
   * found.
   */
  async getConversationForTargetMessage(
    targetFromId: string,
    targetTimestamp: number
  ) {
    const messages = await getMessagesBySentAt(targetTimestamp, {
      MessageCollection: window.Whisper.MessageCollection,
    });
    const targetMessage = messages.find(m => {
      const contact = m.getContact();

      if (!contact) {
        return false;
      }

      const mcid = contact.get('id');
      return mcid === targetFromId;
    });

    if (targetMessage) {
      return targetMessage.getConversation();
    }

    return null;
  }
  prepareForSend(
    id: string,
    options?: any
  ): {
    wrap: (promise: Promise<any>) => Promise<void>;
    sendOptions: SendOptionsType | undefined;
  } {
    // id is any valid conversation identifier
    const conversation = this.get(id);
    const sendOptions = conversation
      ? conversation.getSendOptions(options)
      : undefined;
    const wrap = conversation
      ? conversation.wrapSend.bind(conversation)
      : async (promise: Promise<any>) => promise;

    return { wrap, sendOptions };
  }
  async getAllGroupsInvolvingId(
    conversationId: string
  ): Promise<Array<ConversationModelType>> {
    const groups = await getAllGroupsInvolvingId(conversationId, {
      ConversationCollection: window.Whisper.ConversationCollection,
    });
    return groups.map(group => this._conversations.add(group));
  }
  async loadPromise() {
    return this._initialPromise;
  }
  reset() {
    this._initialPromise = Promise.resolve();
    this._initialFetchComplete = false;
    this._conversations.reset([]);
  }
  isFetchComplete() {
    return this._initialFetchComplete;
  }
  async load() {
    window.log.info('ConversationController: starting initial fetch');

    if (this._conversations.length) {
      throw new Error('ConversationController: Already loaded!');
    }

    const load = async () => {
      try {
        const collection = await getAllConversations({
          ConversationCollection: window.Whisper.ConversationCollection,
        });

        this._conversations.add(collection.models);

        this._initialFetchComplete = true;

        await Promise.all(
          this._conversations.map(async conversation => {
            // This call is important to allow Conversation models not to generate their
            //   cached props on initial construction if we're in the middle of the load
            //   from the database. Then we come back to the models when it is safe and
            //   generate those props.
            conversation.generateProps();

            if (!conversation.get('lastMessage')) {
              await conversation.updateLastMessage();
            }

            // In case a too-large draft was saved to the database
            const draft = conversation.get('draft');
            if (draft && draft.length > MAX_MESSAGE_BODY_LENGTH) {
              conversation.set({
                draft: draft.slice(0, MAX_MESSAGE_BODY_LENGTH),
              });
              updateConversation(conversation.attributes);
            }
          })
        );
        window.log.info('ConversationController: done with initial fetch');
      } catch (error) {
        window.log.error(
          'ConversationController: initial fetch failed',
          error && error.stack ? error.stack : error
        );
        throw error;
      }
    };

    this._initialPromise = load();

    return this._initialPromise;
  }
}
