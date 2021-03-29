import lodash from 'lodash';

enum Tag {
  PII = 'PII',
  SECRET = 'SECRET'
}

type PlainObject = Record<string, unknown>;

class Obfuscator {
  public obfuscateString(value: string, tag: Tag): string {
    return `[${tag}]${value}[/${tag}]`;
  }

  public obfuscateObject<T extends PlainObject | Error>(object: T, obfuscateSettings: Array<[string, Tag]>): T {
    if (this.isPlainObject(object)) {
      return this.obfuscatePlainObject(object, obfuscateSettings);
    }

    return this.obfuscateError(object as Error, obfuscateSettings) as T;
  }

  private obfuscatePlainObject<T extends PlainObject>(plainObject: T, obfuscateSettings: Array<[string, Tag]>): T {
    const clonedObj = lodash.cloneDeep(plainObject);
    const allPaths: Array<string> = this.collectPaths(plainObject);

    const pathToTagMap = new Map();
    const allPathsToObfuscate = [];

    for (const anObfuscateSetting of obfuscateSettings) {
      pathToTagMap.set(anObfuscateSetting[0], anObfuscateSetting[1]);
      allPathsToObfuscate.push(anObfuscateSetting[0]);
    }

    for (const path of allPaths) {
      const actualPath = path[0];
      if (allPathsToObfuscate.some((propPath) => new RegExp(propPath[0]).test(actualPath))) {
        const rawValue = lodash.get(clonedObj, path);

        const tag = this.determineTag(pathToTagMap, path);
        if (!tag) {
          continue;
        }
        lodash.set(clonedObj, path, this.obfuscateString(rawValue as string, tag));
      }
    }

    return clonedObj;
  }

  private obfuscateError<T extends Error>(err: T, obfuscateSettings: Array<[string, Tag]>): T {
    const clonedErr = new Error(err.message);
    Object.setPrototypeOf(clonedErr, Object.getPrototypeOf(err));

    const dataToAssign = {};
    for (const prop of Object.getOwnPropertyNames(err)) {
      dataToAssign[prop] = lodash.cloneDeep(err[prop]);
    }

    Object.assign(clonedErr, this.obfuscatePlainObject(dataToAssign, obfuscateSettings));

    return clonedErr as T;
  }

  private collectPaths(input: any, currentPath?: string) {
    const paths = [];

    if (lodash.isPlainObject(input)) {
      for (const key in input) {
        const fullPath: string = this.buildPath(key, currentPath);
        const value = input[key];

        paths.push(fullPath, ...this.collectPaths(value).map((nestedPath) => this.buildPath(nestedPath, fullPath)));
      }
    }

    return paths;
  }

  private buildPath(propPath: string, basePath?: string) {
    return basePath === undefined ? String(propPath) : `${basePath}.${propPath}`;
  }

  private determineTag(pathToTagMap: any, path: string) {
    const tag = pathToTagMap.get(path);
    return tag;
  }

  private isPlainObject(value: unknown): value is PlainObject {
    return lodash.isPlainObject(value);
  }
}

export {
  Obfuscator,
  Tag,
};
