import { describe, it, expect, vi, beforeEach } from 'vitest';
import { select } from '@inquirer/prompts';

import { BumpType } from '../types';
import { requstBumpType } from '../request-bump-type';

// Mock dependencies
vi.mock('@inquirer/prompts');
vi.mock('chalk', () => ({
  default: {
    green: vi.fn((str: string) => str),
    bold: vi.fn((str: string) => str),
  },
}));

describe('request-bump-type', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(select).mockResolvedValue(BumpType.PATCH);
  });

  describe('requstBumpType', () => {
    it('should present correct choices with descriptions', async () => {
      await requstBumpType();

      // 验证选择列表的格式和内容
      expect(select).toHaveBeenCalledWith({
        message: 'Select version bump type:',
        choices: [
          {
            name: 'ALPHA: Alpha pre-release version, for example: 1.1.1-alpha.2597f3',
            value: BumpType.ALPHA,
          },
          {
            name: 'BETA: Beta pre-release version, for example: 1.1.1-beta.1',
            value: BumpType.BETA,
          },
          {
            name: 'PATCH: Patch update, backwards-compatible bug fixes, for example: 1.1.1 -> 1.1.2',
            value: BumpType.PATCH,
          },
          {
            name: 'MINOR: Minor update, backwards-compatible features, for example: 1.1.1 -> 1.2.0',
            value: BumpType.MINOR,
          },
          {
            name: 'MAJOR: Major update, incompatible API changes, for example: 1.1.1 -> 2.0.0',
            value: BumpType.MAJOR,
          },
        ],
      });
    });

    it('should return selected bump type', async () => {
      vi.mocked(select).mockResolvedValueOnce(BumpType.MINOR);
      const result = await requstBumpType();
      expect(result).toBe(BumpType.MINOR);
    });

    it('should return null when selection is cancelled', async () => {
      vi.mocked(select).mockRejectedValueOnce(new Error('Selection cancelled'));
      const result = await requstBumpType();
      expect(result).toBeNull();
    });
  });
});
