import semver from 'semver';
import dayjs from 'dayjs';

interface ChangeLogComment {
  comment: string;
  author?: string;
  commit?: string;
  customFields?: Record<string, string>;
}

interface ChangeLogEntry {
  version: string;
  tag: string;
  date: string;
  comments: {
    major?: ChangeLogComment[];
    minor?: ChangeLogComment[];
    patch?: ChangeLogComment[];
    dependency?: ChangeLogComment[];
    none?: ChangeLogComment[];
  };
}

export interface ChangeLog {
  name: string;
  entries: ChangeLogEntry[];
}

interface Change {
  packageName: string;
  comment: string;
  type: 'none' | 'dependency' | 'patch' | 'minor' | 'major';
  customFields?: Record<string, string>;
}

export interface ChangeFile {
  changes: Change[];
  packageName: string;
  email?: string;
}

/**
 * Convert change type to corresponding title
 */
const getChangeTypeTitle = (type: Change['type']): string => {
  switch (type) {
    case 'major':
      return '### Breaking Changes';
    case 'minor':
      return '### New Features';
    case 'patch':
      return '### Bug Fixes';
    case 'dependency':
      return '### Dependencies';
    case 'none':
      return '### Other Changes';
    default:
      return '';
  }
};

/**
 * Generate changelog for a single version
 */
const generateVersionChangelog = ({
  version,
  changes,
  tag,
  defaultChangelog,
}: {
  version: string;
  changes: Change[];
  tag: string;
  defaultChangelog?: string;
}): ChangeLogEntry => {
  // Group changes by type
  const groupedChanges =
    changes.length > 0
      ? changes.reduce(
          (acc, change) => {
            const { type, comment, customFields } = change;
            if (!acc[type]) {
              acc[type] = [];
            }
            const node = acc[type];
            if (node.some(existing => existing.comment === comment) === false) {
              node.push({
                comment,
                customFields,
              });
            }
            return acc;
          },
          {} as unknown as ChangeLogEntry['comments'],
        )
      : { none: [{ comment: defaultChangelog }] };

  return {
    version,
    tag,
    date: dayjs().toISOString(),
    comments: groupedChanges,
  };
};

/**
 * Convert changelog to Markdown format
 */
const changelogToMarkdown = (changelog: ChangeLog): string => {
  const lines: string[] = [];
  lines.push(`# ${changelog.name}`);
  lines.push('');

  changelog.entries.forEach(entry => {
    lines.push(
      `## ${entry.version} - ${dayjs(entry.date).format('YYYY-MM-DD')}`,
    );
    lines.push('');

    // Output different types of changes in fixed order
    const typeOrder: Change['type'][] = [
      'major',
      'minor',
      'patch',
      'dependency',
      'none',
    ];

    typeOrder.forEach(type => {
      const changes = entry.comments[type];
      if (changes?.length) {
        lines.push(getChangeTypeTitle(type));
        lines.push('');
        changes.forEach(change => {
          lines.push(`- ${change.comment}`);
          // Add custom fields to changelog if they exist
          if (change.customFields) {
            Object.entries(change.customFields).forEach(([key, value]) => {
              lines.push(`  - ${key}: ${value}`);
            });
          }
        });
        lines.push('');
      }
    });

    lines.push('');
  });

  return lines.join('\n');
};

interface GenerateChangelogOptions {
  packageName: string;
  version: string;
  commingChanges: ChangeFile[];
  previousChangelog?: ChangeLog;
  defaultChangelog?: string;
  tag?: string;
}
/**
 * Merge and generate changelog
 */
export const generateChangelog = ({
  commingChanges,
  previousChangelog,
  version,
  packageName,
  tag,
  defaultChangelog = 'Publish for noop',
}: GenerateChangelogOptions): {
  changelog: ChangeLog;
  report: string;
} => {
  // Create new changelog entry
  const newEntry = generateVersionChangelog({
    version,
    changes: commingChanges.flatMap(r => r.changes),
    tag: tag || 'HEAD',
    defaultChangelog,
  });

  const allEntries = (
    previousChangelog ? [newEntry, ...previousChangelog.entries] : [newEntry]
  ).sort((a, b) => {
    // Handle invalid version numbers
    if (!semver.valid(a.version) || !semver.valid(b.version)) {
      return 0;
    }
    // Use semver.rcompare for descending sort (newer versions first)
    return semver.rcompare(a.version, b.version);
  });

  // Merge with existing changelog
  const changelog: ChangeLog = {
    name: packageName,
    entries: allEntries,
  };

  // Convert to markdown
  const markdown = changelogToMarkdown(changelog);
  return {
    changelog,
    report: markdown,
  };
};
