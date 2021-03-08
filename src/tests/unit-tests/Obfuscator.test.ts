import { Obfuscator, Tag } from '../../Obfuscator';

describe('Obfuscator', () => {
  const obfuscator = new Obfuscator();
  
  describe('obfuscateString', () => {
    it('should wrap the provided tag around the string that needs to be obfuscated', () => {
      expect(obfuscator.obfuscateString('string', 'pii')).toEqual('[PII]string[/PII]');
    });
  });

  describe('obfuscateObject', () => {
    it('should wrap the provided tag around root-level elements in object', () => {
      const originalObject = { name: 'Pencho' };
      const obfuscatedObject = { name: '[PII]Pencho[/PII]' };
      expect(obfuscator.obfuscateObject(originalObject, [['name', Tag.PII]])).toEqual(obfuscatedObject);
    });

    it('should wrap the provided tag around nested elements in object', () => {
      const originalObject = { id: 1, data: { name: 'Gosho', email: 'email@example.com' } };
      const obfuscatedObject = { id: 1, data: { name: '[PII]Gosho[/PII]', email: '[PII]email@example.com[/PII]' } };
      expect(obfuscator.obfuscateObject(originalObject, [['data.name', Tag.PII], ['data.email', Tag.PII]])).toEqual(obfuscatedObject);
    });

    it('should NOT wrap the provided tag around elements that are not specified for obfuscating in object', () => {
      const originalObject = { favouriteColor: 'red', nested: { field: 'value' } };
      expect(obfuscator.obfuscateObject(originalObject, [['name', Tag.PII]])).toEqual(originalObject);
    });
  });
});
