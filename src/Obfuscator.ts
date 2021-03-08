import lodash from 'lodash';

enum Tag {
  PII = 'pii',
  SECRET = 'secret'
}

class Obfuscator {
  public obfuscateObject(obj: unknown, obfuscateSettings: Array<[string, Tag]>): Record<string, unknown> {
    const clonedObj = lodash.cloneDeep(obj);
    const allPaths: Array<string> = this.collectPaths(obj);

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

        let upperCasedTag;
        try {
          upperCasedTag = this.determineTag(pathToTagMap, path);
        } catch (ex) {
          continue;
        }

        const transformedValue = `[${upperCasedTag}]${rawValue}[/${upperCasedTag}]`;

        lodash.set(clonedObj, path, transformedValue);
      }
    }

    return clonedObj;
  }

  public obfuscateString(value: string, tag: string): string {
    const upperCasedTag = tag.toUpperCase();
    return `[${upperCasedTag}]${value}[/${upperCasedTag}]`;
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
    if (!tag) {
      throw new Error();
    }
    return  tag.toUpperCase();
  }
}

export {
  Obfuscator,
  Tag,
};
