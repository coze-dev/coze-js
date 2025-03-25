import { describe, it, expect, vi } from 'vitest';
import semver from 'semver';
import dayjs from 'dayjs';

import { generateChangelog, type ChangeLog } from '../generate-changelog';

// Mock dependencies
vi.mock('semver');
vi.mock('dayjs');

// Mock the dayjs().format() and toISOString() calls
const mockDate = '2024-01-01';
const mockISOString = '2024-01-01T00:00:00.000Z';

vi.mocked(dayjs).mockReturnValue({
  format: () => mockDate,
  toISOString: () => mockISOString,
} as any);

// Mock semver functions
vi.mocked(semver.valid).mockImplementation(version => version as string);
vi.mocked(semver.rcompare).mockImplementation((a, b) => {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
});

describe('generateChangelog', () => {
  it('should generate changelog with no previous entries', () => {
    const result = generateChangelog({
      packageName: 'test-package',
      version: '1.0.0',
      commingChanges: [
        {
          packageName: 'test-package',
          changes: [
            {
              packageName: 'test-package',
              comment: 'Added new feature',
              type: 'minor',
            },
          ],
        },
      ],
    });

    expect(result.changelog.name).toBe('test-package');
    expect(result.changelog.entries).toHaveLength(1);
    expect(result.changelog.entries[0].version).toBe('1.0.0');
    expect(result.changelog.entries[0].comments.minor).toHaveLength(1);
    expect(result.changelog.entries[0].comments.minor[0].comment).toBe(
      'Added new feature',
    );
  });

  it('should merge with previous changelog entries', () => {
    const previousChangelog: ChangeLog = {
      name: 'test-package',
      entries: [
        {
          version: '0.9.0',
          tag: 'v0.9.0',
          date: '2023-12-31',
          comments: {
            patch: [{ comment: 'Old fix' }],
          },
        },
      ],
    };

    const result = generateChangelog({
      packageName: 'test-package',
      version: '1.0.0',
      commingChanges: [
        {
          packageName: 'test-package',
          changes: [
            {
              packageName: 'test-package',
              comment: 'Breaking change',
              type: 'major',
            },
          ],
        },
      ],
      previousChangelog,
    });

    expect(result.changelog.entries).toHaveLength(2);
    expect(result.changelog.entries[0].version).toBe('1.0.0');
    expect(result.changelog.entries[1].version).toBe('0.9.0');
  });

  it('should handle empty changes with default changelog', () => {
    const result = generateChangelog({
      packageName: 'test-package',
      version: '1.0.0',
      commingChanges: [],
      defaultChangelog: 'Default message',
    });

    expect(result.changelog.entries[0].comments.none[0].comment).toBe(
      'Default message',
    );
  });

  it('should handle custom fields in changes', () => {
    const result = generateChangelog({
      packageName: 'test-package',
      version: '1.0.0',
      commingChanges: [
        {
          packageName: 'test-package',
          changes: [
            {
              packageName: 'test-package',
              comment: 'Change with custom fields',
              type: 'patch',
              customFields: {
                PR: '#123',
                Author: 'test-author',
              },
            },
          ],
        },
      ],
    });

    expect(result.changelog.entries[0].comments.patch[0].customFields).toEqual({
      PR: '#123',
      Author: 'test-author',
    });
  });

  it('should deduplicate identical comments', () => {
    const result = generateChangelog({
      packageName: 'test-package',
      version: '1.0.0',
      commingChanges: [
        {
          packageName: 'test-package',
          changes: [
            {
              packageName: 'test-package',
              comment: 'Duplicate comment',
              type: 'patch',
            },
            {
              packageName: 'test-package',
              comment: 'Duplicate comment',
              type: 'patch',
            },
          ],
        },
      ],
    });

    expect(result.changelog.entries[0].comments.patch).toHaveLength(1);
  });

  it('should generate correct markdown format', () => {
    const result = generateChangelog({
      packageName: 'test-package',
      version: '1.0.0',
      commingChanges: [
        {
          packageName: 'test-package',
          changes: [
            {
              packageName: 'test-package',
              comment: 'Breaking change',
              type: 'major',
            },
            {
              packageName: 'test-package',
              comment: 'New feature',
              type: 'minor',
            },
            {
              packageName: 'test-package',
              comment: 'Bug fix',
              type: 'patch',
            },
          ],
        },
      ],
    });

    expect(result.report).toContain('test-package');
  });

  it('should handle all change types', () => {
    const result = generateChangelog({
      packageName: 'test-package',
      version: '1.0.0',
      commingChanges: [
        {
          packageName: 'test-package',
          changes: [
            {
              packageName: 'test-package',
              comment: 'Major change',
              type: 'major',
            },
            {
              packageName: 'test-package',
              comment: 'Minor change',
              type: 'minor',
            },
            {
              packageName: 'test-package',
              comment: 'Patch change',
              type: 'patch',
            },
            {
              packageName: 'test-package',
              comment: 'Dependency change',
              type: 'dependency',
            },
            {
              packageName: 'test-package',
              comment: 'None change',
              type: 'none',
            },
          ],
        },
      ],
    });

    const entry = result.changelog.entries[0];
    expect(entry.comments.major).toBeDefined();
    expect(entry.comments.minor).toBeDefined();
    expect(entry.comments.patch).toBeDefined();
    expect(entry.comments.dependency).toBeDefined();
    expect(entry.comments.none).toBeDefined();
  });
});
