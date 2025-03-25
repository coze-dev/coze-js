import { type z } from 'zod';

export interface McpTool {
  name: string;
  description: string;
  schema: z.ZodObject<any>;
  execute: (
    args: z.infer<McpTool['schema']>,
  ) => Promise<{ content: Array<{ type: 'text'; text: string }> }>;
}

interface Person {
  name: string;
  email: string;
  url?: string;
}

interface License {
  type?: string;
  url?: string;
}

interface Repository {
  type: string;
  url: string;
}

interface Distribution {
  shasum: string;
  tarball: string;
  integrity: string;
  signatures: Array<{
    sig: string;
    keyid: string;
  }>;
}

interface PackageVersion {
  name: string;
  version: string;
  description?: string;
  keywords?: string[];
  author?: Person;
  contributors?: Person[];
  maintainers?: Person[];
  homepage?: string;
  bugs?: {
    url: string;
  };
  license?: string;
  licenses?: License[];
  repository?: Repository;
  main?: string;
  bin?: Record<string, string>;
  jam?: {
    main: string;
  };
  volo?: {
    type: string;
    ignore: string[];
  };
  engines?: string[] | Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  directories?: Record<string, string>;
  scripts?: Record<string, string>;
  dist: Distribution;
}

export interface NpmInfo {
  _id: string;
  _rev: string;
  name: string;
  'dist-tags': {
    latest: string;
    [key: string]: string;
  };
  versions: Record<string, PackageVersion>;
  time: Record<string, string>;
  bugs: {
    url: string;
  };
  author: Person;
  license: string;
  homepage: string;
  keywords: string[];
  repository: Repository;
  description: string;
  contributors: Person[];
}

// npm search result
export interface NpmSearchResponse {
  objects: NpmPackageSearchResult[];
  total: number;
  time: string;
}

interface NpmPackageSearchResult {
  downloads: {
    monthly: number;
    weekly: number;
  };
  dependents: number;
  updated: string;
  searchScore: number;
  package: NpmPackage;
  score: {
    final: number;
    detail: {
      popularity: number;
      quality: number;
      maintenance: number;
    };
  };
  flags: {
    insecure: number;
  };
}

interface NpmPackage {
  name: string;
  keywords: string[];
  version: string;
  author?: string;
  description: string;
  sanitized_name: string;
  publisher: NpmUser;
  maintainers: NpmUser[];
  license: string;
  date: string;
  links: {
    homepage: string;
    repository: string;
    bugs: string;
    npm: string;
  };
}

interface NpmUser {
  email: string;
  username: string;
}
