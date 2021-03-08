import lodash from 'lodash';

class Obfuscator {
  public obfuscateObject(obj: unknown, paths: Array<string>, tag: string): Record<string, unknown> {
    const upperCasedTag = tag.toUpperCase();
    const clonedObj = lodash.cloneDeep(obj);
    const allPaths: Array<string> = this.collectPaths(obj);

    for (const path of allPaths) {
      if (paths.some((propPath) => new RegExp(propPath).test(path))) {
        const rawValue = lodash.get(clonedObj, path);
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
}

export {
  Obfuscator,
};
