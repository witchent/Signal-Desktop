/* global Backbone, Signal, Whisper */

/* eslint-disable more/no-then */

// eslint-disable-next-line func-names
(function() {
  'use strict';

  window.Whisper = window.Whisper || {};

  Whisper.KeyVerificationPanelView = Whisper.View.extend({
    className: 'panel',
    templateName: 'key-verification',
    initialize(options) {
      this.render();

      this.view = new Whisper.ReactWrapperView({
        JSX: Signal.State.Roots.createSafetyNumberViewer(window.reduxStore, {
          contactID: options.model.get('id'),
        }),
        onInitialRender: () => {
          if (options.onLoad) {
            options.onLoad(this);
          }
        },
      });

      this.$('.key-verification-wrapper').append(this.view.el);
    },

    remove() {
      if (this.view) {
        this.view.remove();
      }
      Backbone.View.prototype.remove.call(this);
    },
  });
})();
