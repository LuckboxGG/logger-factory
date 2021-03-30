import lodash from 'lodash';

export enum Tag {
  PII = 'PII',
  SECRET = 'SECRET'
}

type PlainObject = Record<string, unknown>;

export function tagString(value: string, tag: Tag): string {
  return `[${tag}]${value}[/${tag}]`;
}

export function tagObject<T extends PlainObject | Error>(object: T, tagSettings: Array<[string, Tag]>): T {
  if (isError(object)) {
    return tagError(object, tagSettings);
  } else if (isPlainObject(object)) {
    return tagPlainObject(object, tagSettings);
  }

  throw new Error('Input must be plain object or a class inheriting from Error');
}

function tagPlainObject<T extends PlainObject>(plainObject: T, tagSettings: Array<[string, Tag]>): T {
  const clonedObj = clone(plainObject);
  const pathToTagMap = constructPathToTagMap(tagSettings);

  const allPaths = collectPaths(plainObject);
  for (const path of allPaths) {
    const tag = pathToTagMap.get(path);
    if (!tag) {
      continue;
    }

    const rawValue = lodash.get(clonedObj, path);
    if (typeof rawValue !== 'string') {
      continue;
    }

    lodash.set(clonedObj, path, tagString(rawValue, tag));
  }

  return clonedObj;
}

function tagError<T extends Error>(err: T, tagSettings: Array<[string, Tag]>): T {
  const clonedErr = new Error(err.message);
  Object.setPrototypeOf(clonedErr, Object.getPrototypeOf(err));

  const dataToAssign = {};
  for (const prop of Object.getOwnPropertyNames(err)) {
    dataToAssign[prop] = clone(err[prop]);
  }

  Object.assign(clonedErr, tagPlainObject(dataToAssign, tagSettings));

  return clonedErr as T;
}

function collectPaths(input: any, currentPath?: string) {
  const paths: Array<string> = [];

  if (lodash.isPlainObject(input)) {
    for (const key in input) {
      const fullPath = buildPath(key, currentPath);
      const value = input[key];

      paths.push(fullPath, ...collectPaths(value).map((nestedPath) => buildPath(nestedPath, fullPath)));
    }
  }

  return paths;
}

function buildPath(propPath: string, basePath?: string) {
  return basePath === undefined ? String(propPath) : `${basePath}.${propPath}`;
}

function isPlainObject(value: unknown): value is PlainObject {
  return lodash.isPlainObject(value);
}

function isError(value: unknown): value is Error {
  return value instanceof Error;
}

function constructPathToTagMap(tagSettings: Array<[string, Tag]>) {
  const pathToTagMap = new Map();
  for (const [path, tag] of tagSettings) {
    pathToTagMap.set(path, tag);
  }

  return pathToTagMap;
}

function clone<T extends any>(value: T): T {
  return lodash.cloneDeep(value);
}

