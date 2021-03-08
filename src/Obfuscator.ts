import lodash from 'lodash';

enum Tag {
  PII = 'PII',
  SECRET = 'SECRET'
}

class Obfuscator {
  public obfuscateObject(object: Record<string, unknown>, obfuscateSettings: Array<[string, Tag]>): Record<string, unknown> {
    const clonedObj = lodash.cloneDeep(object);
    const allPaths: Array<string> = this.collectPaths(object);

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

        lodash.set(clonedObj, path, this.obfuscateString(rawValue, upperCasedTag));
      }
    }

    return clonedObj;
  }

  public obfuscateString(value: string, tag: Tag): string {
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
    return tag;
  }
}

export {
  Obfuscator,
  Tag,
};
