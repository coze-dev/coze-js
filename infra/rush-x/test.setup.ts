import { vi, type Mocked, beforeEach } from 'vitest';
import axios from 'axios';
import type * as Utilities from '@rushstack/rush-sdk/lib/utilities/Utilities';
import type * as PublishUtilities from '@rushstack/rush-sdk/lib/logic/PublishUtilities';
import type * as NodeCoreLib from '@rushstack/node-core-library';

vi.mock('axios');
vi.mock('@rushstack/node-core-library', async () => {
  const actual: typeof NodeCoreLib = await vi.importActual(
    '@rushstack/node-core-library',
  );
  return {
    ...actual,
    JsonFile: {
      load: vi
        .fn()
        .mockReturnValue({ version: '0.1.0', scripts: { 'test:cov': 'test' } }),
      save: vi.fn(),
    },
    Terminal: vi.fn().mockReturnValue({
      writeLine: vi.fn(),
    }),
  };
});

vi.mock('@rushstack/rush-sdk/lib/utilities/Utilities', async () => {
  const actual: typeof Utilities = await vi.importActual(
    '@rushstack/rush-sdk/lib/utilities/Utilities',
  );
  return {
    Utilities: {
      ...actual,
      executeCommand: vi.fn(),
    },
  };
});

vi.mock('@rushstack/rush-sdk/lib/logic/PublishUtilities', async () => {
  const actual: typeof PublishUtilities = await vi.importActual(
    '@rushstack/rush-sdk/lib/logic/PublishUtilities',
  );
  return {
    ...actual,
    PublishUtilities: {
      createTagname: vi.fn(),
      execCommand: vi.fn(),
      findChangeRequests: vi.fn(() => ({
        packageChanges: new Map(),
        versionPolicyChanges: new Map(),
      })),
      sortChangeRequests: vi.fn(() => []),
      updatePackages: actual.PublishUtilities.updatePackages,
    },
  };
});

const mockedAxios = axios as Mocked<typeof axios>;
mockedAxios.get.mockReset();
mockedAxios.post.mockReset();
mockedAxios.create.mockReturnThis();

beforeEach(() => {
  process.exit = vi.fn() as never;
});
