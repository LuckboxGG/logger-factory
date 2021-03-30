import lodash from 'lodash';

enum Tag {
  PII = 'PII',
  SECRET = 'SECRET'
}

type PlainObject = Record<string, unknown>;

class Masker {
  public maskString(value: string, tag: Tag): string {
    return `[${tag}]${value}[/${tag}]`;
  }

  public maskNumber(value: number, tag: Tag): string {
    return `[${tag}]${value}[/${tag}]`;
  }

  public maskObject<T extends PlainObject | Error>(object: T, maskSettings: Array<[string, Tag]>): T {
    if (this.isError(object)) {
      return this.maskError(object, maskSettings);
    } else if (this.isPlainObject(object)) {
      return this.maskPlainObject(object, maskSettings);
    }

    throw new Error('Input must be plain object or a class inheriting from Error');
  }

  private maskPlainObject<T extends PlainObject>(plainObject: T, maskSettings: Array<[string, Tag]>): T {
    const clonedObj = this.clone(plainObject);
    const pathToTagMap = this.constructPathToTagMap(maskSettings);

    const allPaths = this.collectPaths(plainObject);
    for (const path of allPaths) {
      const tag = pathToTagMap.get(path);
      if (!tag) {
        continue;
      }

      const rawValue = lodash.get(clonedObj, path);
      if (typeof rawValue === 'string') {
        lodash.set(clonedObj, path, this.maskString(rawValue, tag));
      }

      if (typeof rawValue === 'number') {
        lodash.set(clonedObj, path, this.maskNumber(rawValue, tag));
      }
    }

    return clonedObj;
  }

  private maskError<T extends Error>(err: T, maskSettings: Array<[string, Tag]>): T {
    const clonedErr = new Error(err.message);
    Object.setPrototypeOf(clonedErr, Object.getPrototypeOf(err));

    const dataToAssign = {};
    for (const prop of Object.getOwnPropertyNames(err)) {
      dataToAssign[prop] = this.clone(err[prop]);
    }

    Object.assign(clonedErr, this.maskPlainObject(dataToAssign, maskSettings));

    return clonedErr as T;
  }

  private collectPaths(input: any, currentPath?: string) {
    const paths: Array<string> = [];

    if (lodash.isPlainObject(input)) {
      for (const key in input) {
        const fullPath = this.buildPath(key, currentPath);
        const value = input[key];

        paths.push(fullPath, ...this.collectPaths(value).map((nestedPath) => this.buildPath(nestedPath, fullPath)));
      }
    }

    return paths;
  }

  private buildPath(propPath: string, basePath?: string) {
    return basePath === undefined ? String(propPath) : `${basePath}.${propPath}`;
  }

  private isPlainObject(value: unknown): value is PlainObject {
    return lodash.isPlainObject(value);
  }

  private isError(value: unknown): value is Error {
    return value instanceof Error;
  }

  private constructPathToTagMap(maskSettings: Array<[string, Tag]>) {
    const pathToTagMap = new Map();
    for (const [path, tag] of maskSettings) {
      pathToTagMap.set(path, tag);
    }

    return pathToTagMap;
  }

  private clone<T extends any>(value: T): T {
    return lodash.cloneDeep(value);
  }
}

export {
  Masker,
  Tag,
};
