// The idea with this file is to make it webpackable for the style guide

const { bindActionCreators } = require('redux');
const Backbone = require('../../ts/backbone');
const Crypto = require('../../ts/Crypto');
const {
  start: conversationControllerStart,
} = require('../../ts/ConversationController');
const Data = require('../../ts/sql/Client').default;
const Emojis = require('./emojis');
const EmojiLib = require('../../ts/components/emoji/lib');
const IndexedDB = require('./indexeddb');
const Notifications = require('../../ts/notifications');
const OS = require('../../ts/OS');
const Stickers = require('./stickers');
const Settings = require('./settings');
const RemoteConfig = require('../../ts/RemoteConfig');
const Util = require('../../ts/util');
const Metadata = require('./metadata/SecretSessionCipher');
const RefreshSenderCertificate = require('./refresh_sender_certificate');
const LinkPreviews = require('./link_previews');
const AttachmentDownloads = require('./attachment_downloads');

// Components
const {
  AttachmentList,
} = require('../../ts/components/conversation/AttachmentList');
const { CaptionEditor } = require('../../ts/components/CaptionEditor');
const {
  ContactDetail,
} = require('../../ts/components/conversation/ContactDetail');
const { ContactListItem } = require('../../ts/components/ContactListItem');
const {
  ConversationHeader,
} = require('../../ts/components/conversation/ConversationHeader');
const { Emojify } = require('../../ts/components/conversation/Emojify');
const { Lightbox } = require('../../ts/components/Lightbox');
const { LightboxGallery } = require('../../ts/components/LightboxGallery');
const {
  MediaGallery,
} = require('../../ts/components/conversation/media-gallery/MediaGallery');
const {
  MessageDetail,
} = require('../../ts/components/conversation/MessageDetail');
const { Quote } = require('../../ts/components/conversation/Quote');
const {
  SafetyNumberChangeDialog,
} = require('../../ts/components/SafetyNumberChangeDialog');
const {
  StagedLinkPreview,
} = require('../../ts/components/conversation/StagedLinkPreview');
const {
  getCallingNotificationText,
} = require('../../ts/components/conversation/CallingNotification');

// State
const { createTimeline } = require('../../ts/state/roots/createTimeline');
const {
  createCompositionArea,
} = require('../../ts/state/roots/createCompositionArea');
const { createCallManager } = require('../../ts/state/roots/createCallManager');
const { createLeftPane } = require('../../ts/state/roots/createLeftPane');
const {
  createSafetyNumberViewer,
} = require('../../ts/state/roots/createSafetyNumberViewer');
const {
  createStickerManager,
} = require('../../ts/state/roots/createStickerManager');
const {
  createStickerPreviewModal,
} = require('../../ts/state/roots/createStickerPreviewModal');
const {
  createShortcutGuideModal,
} = require('../../ts/state/roots/createShortcutGuideModal');

const { createStore } = require('../../ts/state/createStore');
const callingDuck = require('../../ts/state/ducks/calling');
const conversationsDuck = require('../../ts/state/ducks/conversations');
const emojisDuck = require('../../ts/state/ducks/emojis');
const expirationDuck = require('../../ts/state/ducks/expiration');
const itemsDuck = require('../../ts/state/ducks/items');
const networkDuck = require('../../ts/state/ducks/network');
const searchDuck = require('../../ts/state/ducks/search');
const stickersDuck = require('../../ts/state/ducks/stickers');
const updatesDuck = require('../../ts/state/ducks/updates');
const userDuck = require('../../ts/state/ducks/user');

const conversationsSelectors = require('../../ts/state/selectors/conversations');
const searchSelectors = require('../../ts/state/selectors/search');

// Types
const AttachmentType = require('./types/attachment');
const VisualAttachment = require('./types/visual_attachment');
const Contact = require('../../ts/types/Contact');
const Conversation = require('./types/conversation');
const Errors = require('./types/errors');
const MediaGalleryMessage = require('../../ts/components/conversation/media-gallery/types/Message');
const MessageType = require('./types/message');
const MIME = require('../../ts/types/MIME');
const PhoneNumber = require('../../ts/types/PhoneNumber');
const SettingsType = require('../../ts/types/Settings');

// Views
const Initialization = require('./views/initialization');

// Workflow
const { IdleDetector } = require('./idle_detector');
const MessageDataMigrator = require('./messages_data_migrator');

// Processes / Services
const {
  initializeNetworkObserver,
} = require('../../ts/services/networkObserver');
const {
  initializeUpdateListener,
} = require('../../ts/services/updateListener');
const { notify } = require('../../ts/services/notify');
const { calling } = require('../../ts/services/calling');

function initializeMigrations({
  userDataPath,
  getRegionCode,
  Attachments,
  Type,
  VisualType,
  logger,
}) {
  if (!Attachments) {
    return null;
  }
  const {
    createAbsolutePathGetter,
    createReader,
    createWriterForExisting,
    createWriterForNew,
    createDoesExist,
    getDraftPath,
    getPath,
    getStickersPath,
    getTempPath,
    openFileInFolder,
    saveAttachmentToDisk,
  } = Attachments;
  const {
    getImageDimensions,
    makeImageThumbnail,
    makeObjectUrl,
    makeVideoScreenshot,
    revokeObjectUrl,
  } = VisualType;

  const attachmentsPath = getPath(userDataPath);
  const readAttachmentData = createReader(attachmentsPath);
  const loadAttachmentData = Type.loadData(readAttachmentData);
  const loadPreviewData = MessageType.loadPreviewData(loadAttachmentData);
  const loadQuoteData = MessageType.loadQuoteData(loadAttachmentData);
  const loadStickerData = MessageType.loadStickerData(loadAttachmentData);
  const getAbsoluteAttachmentPath = createAbsolutePathGetter(attachmentsPath);
  const deleteOnDisk = Attachments.createDeleter(attachmentsPath);
  const writeNewAttachmentData = createWriterForNew(attachmentsPath);
  const copyIntoAttachmentsDirectory = Attachments.copyIntoAttachmentsDirectory(
    attachmentsPath
  );
  const doesAttachmentExist = createDoesExist(attachmentsPath);

  const stickersPath = getStickersPath(userDataPath);
  const writeNewStickerData = createWriterForNew(stickersPath);
  const getAbsoluteStickerPath = createAbsolutePathGetter(stickersPath);
  const deleteSticker = Attachments.createDeleter(stickersPath);
  const readStickerData = createReader(stickersPath);

  const tempPath = getTempPath(userDataPath);
  const getAbsoluteTempPath = createAbsolutePathGetter(tempPath);
  const writeNewTempData = createWriterForNew(tempPath);
  const deleteTempFile = Attachments.createDeleter(tempPath);
  const readTempData = createReader(tempPath);
  const copyIntoTempDirectory = Attachments.copyIntoAttachmentsDirectory(
    tempPath
  );

  const draftPath = getDraftPath(userDataPath);
  const getAbsoluteDraftPath = createAbsolutePathGetter(draftPath);
  const writeNewDraftData = createWriterForNew(draftPath);
  const deleteDraftFile = Attachments.createDeleter(draftPath);
  const readDraftData = createReader(draftPath);

  return {
    attachmentsPath,
    copyIntoAttachmentsDirectory,
    copyIntoTempDirectory,
    deleteAttachmentData: deleteOnDisk,
    deleteDraftFile,
    deleteExternalMessageFiles: MessageType.deleteAllExternalFiles({
      deleteAttachmentData: Type.deleteData(deleteOnDisk),
      deleteOnDisk,
    }),
    deleteSticker,
    deleteTempFile,
    doesAttachmentExist,
    getAbsoluteAttachmentPath,
    getAbsoluteDraftPath,
    getAbsoluteStickerPath,
    getAbsoluteTempPath,
    loadAttachmentData,
    loadMessage: MessageType.createAttachmentLoader(loadAttachmentData),
    loadPreviewData,
    loadQuoteData,
    loadStickerData,
    openFileInFolder,
    readAttachmentData,
    readDraftData,
    readStickerData,
    readTempData,
    saveAttachmentToDisk,
    processNewAttachment: attachment =>
      MessageType.processNewAttachment(attachment, {
        writeNewAttachmentData,
        getAbsoluteAttachmentPath,
        makeObjectUrl,
        revokeObjectUrl,
        getImageDimensions,
        makeImageThumbnail,
        makeVideoScreenshot,
        logger,
      }),
    processNewSticker: stickerData =>
      MessageType.processNewSticker(stickerData, {
        writeNewStickerData,
        getAbsoluteStickerPath,
        getImageDimensions,
        logger,
      }),
    processNewEphemeralSticker: stickerData =>
      MessageType.processNewSticker(stickerData, {
        writeNewStickerData: writeNewTempData,
        getAbsoluteStickerPath: getAbsoluteTempPath,
        getImageDimensions,
        logger,
      }),
    upgradeMessageSchema: (message, options = {}) => {
      const { maxVersion } = options;

      return MessageType.upgradeSchema(message, {
        writeNewAttachmentData,
        getRegionCode,
        getAbsoluteAttachmentPath,
        makeObjectUrl,
        revokeObjectUrl,
        getImageDimensions,
        makeImageThumbnail,
        makeVideoScreenshot,
        logger,
        maxVersion,
      });
    },
    writeMessageAttachments: MessageType.createAttachmentDataWriter({
      writeExistingAttachmentData: createWriterForExisting(attachmentsPath),
      logger,
    }),
    writeNewAttachmentData: createWriterForNew(attachmentsPath),
    writeNewDraftData,
  };
}

exports.setup = (options = {}) => {
  const { Attachments, userDataPath, getRegionCode, logger } = options;

  const Migrations = initializeMigrations({
    userDataPath,
    getRegionCode,
    Attachments,
    Type: AttachmentType,
    VisualType: VisualAttachment,
    logger,
  });

  const Components = {
    AttachmentList,
    CaptionEditor,
    ContactDetail,
    ContactListItem,
    ConversationHeader,
    Emojify,
    getCallingNotificationText,
    Lightbox,
    LightboxGallery,
    MediaGallery,
    MessageDetail,
    Quote,
    SafetyNumberChangeDialog,
    StagedLinkPreview,
    Types: {
      Message: MediaGalleryMessage,
    },
  };

  const Roots = {
    createCallManager,
    createCompositionArea,
    createLeftPane,
    createSafetyNumberViewer,
    createShortcutGuideModal,
    createStickerManager,
    createStickerPreviewModal,
    createTimeline,
  };

  const Ducks = {
    calling: callingDuck,
    conversations: conversationsDuck,
    emojis: emojisDuck,
    expiration: expirationDuck,
    items: itemsDuck,
    network: networkDuck,
    updates: updatesDuck,
    user: userDuck,
    search: searchDuck,
    stickers: stickersDuck,
  };

  const Selectors = {
    conversations: conversationsSelectors,
    search: searchSelectors,
  };

  const Services = {
    initializeNetworkObserver,
    initializeUpdateListener,
    notify,
    calling,
  };

  const State = {
    bindActionCreators,
    createStore,
    Roots,
    Ducks,
    Selectors,
  };

  const Types = {
    Attachment: AttachmentType,
    Contact,
    Conversation,
    Errors,
    Message: MessageType,
    MIME,
    PhoneNumber,
    Settings: SettingsType,
    VisualAttachment,
  };

  const Views = {
    Initialization,
  };

  const Workflow = {
    IdleDetector,
    MessageDataMigrator,
  };

  return {
    AttachmentDownloads,
    Backbone,
    Components,
    Crypto,
    conversationControllerStart,
    Data,
    Emojis,
    EmojiLib,
    IndexedDB,
    LinkPreviews,
    Metadata,
    Migrations,
    Notifications,
    OS,
    RefreshSenderCertificate,
    RemoteConfig,
    Settings,
    Services,
    State,
    Stickers,
    Types,
    Util,
    Views,
    Workflow,
  };
};
