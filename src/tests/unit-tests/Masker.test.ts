import { Masker, Tag } from '../../Masker';

describe('Masker', () => {
  const masker = new Masker();

  describe('maskString', () => {
    it('should wrap the provided tag around the string that needs to be maskd', () => {
      expect(masker.maskString('string', Tag.PII)).toEqual('[PII]string[/PII]');
    });
  });

  describe('maskNumber', () => {
    it('should wrap the provided tag around the number that needs to be maskd', () => {
      expect(masker.maskNumber(42, Tag.PII)).toEqual('[PII]42[/PII]');
    });
  });

  describe('maskObject', () => {
    it('should wrap the provided tag around root-level elements in object', () => {
      const originalObject = { name: 'Pencho' };
      const maskedObject = { name: '[PII]Pencho[/PII]' };
      expect(masker.maskObject(originalObject, [['name', Tag.PII]])).toEqual(maskedObject);
    });

    it('should wrap the provided tag around nested elements in object', () => {
      const originalObject = { id: 1, data: { name: 'Gosho', email: 'email@example.com' } };
      const maskedObject = { id: 1, data: { name: '[PII]Gosho[/PII]', email: '[PII]email@example.com[/PII]' } };
      expect(masker.maskObject(originalObject, [['data.name', Tag.PII], ['data.email', Tag.PII]])).toEqual(maskedObject);
    });

    it('should work with numbers', () => {
      const originalObject = { id: 1 };

      expect(masker.maskObject(originalObject, [['id', Tag.PII]])).toEqual({
        id: '[PII]1[/PII]',
      });
    });

    it('should NOT wrap the provided tag around elements that are not specified for obfuscating in object', () => {
      const originalObject = { favouriteColor: 'red', nested: { field: 'value' } };
      expect(masker.maskObject(originalObject, [['name', Tag.PII]])).toEqual(originalObject);
    });

    it('should return a copy of the error and not modify the original', () => {
      const originalError = new Error();
      const maskedError = masker.maskObject(originalError, [['bar', Tag.PII]]);
      expect(maskedError).not.toBe(originalError);
    });

    it('should preserve the prototype, name, message and stack of the error', () => {
      class CustomError extends Error {}
      const originalError = new CustomError();
      const maskedError = masker.maskObject(originalError, [['bar', Tag.PII]]);

      expect(maskedError).toBeInstanceOf(CustomError);
      expect(maskedError.name).toEqual(originalError.name);
      expect(maskedError.message).toEqual(originalError.message);
      expect(maskedError.stack).toEqual(originalError.stack);
    });

    it('should mask error specific props', () => {
      class CustomError extends Error {
        bar = 'foo'
        foo = {
          test: 'test',
        }
      }
      const originalError = new CustomError();
      const maskedError = masker.maskObject(originalError, [
        ['bar', Tag.PII],
        ['foo.test', Tag.PII],
      ]);

      expect(maskedError.bar).toEqual('[PII]foo[/PII]');
      expect(maskedError.foo.test).toEqual('[PII]test[/PII]');
    });
  });
});
