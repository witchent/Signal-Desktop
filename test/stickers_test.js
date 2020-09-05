/* global Signal */

const { Stickers } = Signal;

describe('Stickers', () => {
  describe('getDataFromLink', () => {
    it('returns null for invalid URLs', () => {
      assert.isNull(Stickers.getDataFromLink('https://'));
      assert.isNull(Stickers.getDataFromLink('signal.art/addstickers/'));
    });

    it("returns null for URLs that don't have a hash", () => {
      assert.isNull(
        Stickers.getDataFromLink('https://signal.art/addstickers/')
      );
      assert.isNull(
        Stickers.getDataFromLink('https://signal.art/addstickers/#')
      );
    });

    it('returns null when no key or pack ID is found', () => {
      assert.isNull(
        Stickers.getDataFromLink(
          'https://signal.art/addstickers/#pack_id=c8c83285b547872ac4c589d64a6edd6a'
        )
      );
      assert.isNull(
        Stickers.getDataFromLink(
          'https://signal.art/addstickers/#pack_id=c8c83285b547872ac4c589d64a6edd6a&pack_key='
        )
      );
      assert.isNull(
        Stickers.getDataFromLink(
          'https://signal.art/addstickers/#pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e'
        )
      );
      assert.isNull(
        Stickers.getDataFromLink(
          'https://signal.art/addstickers/#pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e&pack_id='
        )
      );
    });

    it('returns null when the pack ID is invalid', () => {
      assert.isNull(
        Stickers.getDataFromLink(
          'https://signal.art/addstickers/#pack_id=garbage&pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e'
        )
      );
    });

    it('returns null if the ID or key are passed as arrays', () => {
      assert.isNull(
        Stickers.getDataFromLink(
          'https://signal.art/addstickers/#pack_id[]=c8c83285b547872ac4c589d64a6edd6a&pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e'
        )
      );
      assert.isNull(
        Stickers.getDataFromLink(
          'https://signal.art/addstickers/#pack_id=c8c83285b547872ac4c589d64a6edd6a&pack_key[]=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e'
        )
      );
    });

    it('parses the ID and key from the hash', () => {
      assert.deepEqual(
        Stickers.getDataFromLink(
          'https://signal.art/addstickers/#pack_id=c8c83285b547872ac4c589d64a6edd6a&pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e'
        ),
        {
          id: 'c8c83285b547872ac4c589d64a6edd6a',
          key:
            '59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e',
        }
      );
    });

    it('ignores additional hash parameters', () => {
      assert.deepEqual(
        Stickers.getDataFromLink(
          'https://signal.art/addstickers/#pack_id=c8c83285b547872ac4c589d64a6edd6a&pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e&pack_foo=bar'
        ),
        {
          id: 'c8c83285b547872ac4c589d64a6edd6a',
          key:
            '59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e',
        }
      );
    });

    it('only parses the first ID and key from the hash if more than one is supplied', () => {
      assert.deepEqual(
        Stickers.getDataFromLink(
          'https://signal.art/addstickers/#pack_id=c8c83285b547872ac4c589d64a6edd6a&pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e&pack_id=extra&pack_key=extra'
        ),
        {
          id: 'c8c83285b547872ac4c589d64a6edd6a',
          key:
            '59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e',
        }
      );
    });
  });

  describe('isPackIdValid', () => {
    it('returns false for non-strings', () => {
      assert.isFalse(Stickers.isPackIdValid(undefined));
      assert.isFalse(Stickers.isPackIdValid(null));
      assert.isFalse(Stickers.isPackIdValid(123));
      assert.isFalse(Stickers.isPackIdValid(123));
      assert.isFalse(
        Stickers.isPackIdValid(['b9439fa5fdc8b9873fe64f01b88b8ccf'])
      );
      assert.isFalse(
        // eslint-disable-next-line no-new-wrappers
        Stickers.isPackIdValid(new String('b9439fa5fdc8b9873fe64f01b88b8ccf'))
      );
    });

    it('returns false for invalid pack IDs', () => {
      assert.isFalse(Stickers.isPackIdValid(''));
      assert.isFalse(
        Stickers.isPackIdValid('x9439fa5fdc8b9873fe64f01b88b8ccf')
      );
      assert.isFalse(
        // This is one character too short.
        Stickers.isPackIdValid('b9439fa5fdc8b9873fe64f01b88b8cc')
      );
      assert.isFalse(
        // This is one character too long.
        Stickers.isPackIdValid('b9439fa5fdc8b9873fe64f01b88b8ccfa')
      );
    });

    it('returns true for valid pack IDs', () => {
      assert.isTrue(Stickers.isPackIdValid('b9439fa5fdc8b9873fe64f01b88b8ccf'));
      assert.isTrue(Stickers.isPackIdValid('3eff225a1036a58a7530b312dd92f8d8'));
      assert.isTrue(Stickers.isPackIdValid('DDFD48B8097DA7A4E928192B10963F6A'));
    });
  });

  describe('redactPackId', () => {
    it('redacts pack IDs', () => {
      assert.strictEqual(
        Stickers.redactPackId('b9439fa5fdc8b9873fe64f01b88b8ccf'),
        '[REDACTED]ccf'
      );
    });
  });
});
