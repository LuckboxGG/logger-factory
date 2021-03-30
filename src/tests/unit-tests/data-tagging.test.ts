import {
  tagString,
  tagObject,
  Tag,
} from '../../index';

describe('Data Tagging', () => {
  describe('tagString', () => {
    it('should wrap the provided tag around the string that needs to be tagd', () => {
      expect(tagString('string', Tag.PII)).toEqual('[PII]string[/PII]');
    });
  });

  describe('tagObject', () => {
    it('should wrap the provided tag around root-level elements in object', () => {
      const originalObject = { name: 'Pencho' };
      const taggedObject = { name: '[PII]Pencho[/PII]' };
      expect(tagObject(originalObject, [['name', Tag.PII]])).toEqual(taggedObject);
    });

    it('should wrap the provided tag around nested elements in object', () => {
      const originalObject = { id: 1, data: { name: 'Gosho', email: 'email@example.com' } };
      const taggedObject = { id: 1, data: { name: '[PII]Gosho[/PII]', email: '[PII]email@example.com[/PII]' } };
      expect(tagObject(originalObject, [['data.name', Tag.PII], ['data.email', Tag.PII]])).toEqual(taggedObject);
    });

    it('should NOT wrap the provided tag around elements that are not specified for taging in object', () => {
      const originalObject = { favouriteColor: 'red', nested: { field: 'value' } };
      expect(tagObject(originalObject, [['name', Tag.PII]])).toEqual(originalObject);
    });

    it('should return a copy of the error and not modify the original', () => {
      const originalError = new Error();
      const taggedError = tagObject(originalError, [['bar', Tag.PII]]);
      expect(taggedError).not.toBe(originalError);
    });

    it('should preserve the prototype, name, message and stack of the error', () => {
      class CustomError extends Error {}
      const originalError = new CustomError();
      const taggedError = tagObject(originalError, [['bar', Tag.PII]]);

      expect(taggedError).toBeInstanceOf(CustomError);
      expect(taggedError.name).toEqual(originalError.name);
      expect(taggedError.message).toEqual(originalError.message);
      expect(taggedError.stack).toEqual(originalError.stack);
    });

    it('should tag error specific props', () => {
      class CustomError extends Error {
        bar = 'foo'
        foo = {
          test: 'test',
        }
      }
      const originalError = new CustomError();
      const taggedError = tagObject(originalError, [
        ['bar', Tag.PII],
        ['foo.test', Tag.PII],
      ]);

      expect(taggedError.bar).toEqual('[PII]foo[/PII]');
      expect(taggedError.foo.test).toEqual('[PII]test[/PII]');
    });
  });
});
