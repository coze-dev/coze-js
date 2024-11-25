import { type Mock } from 'vitest';

import { presetRules } from '../src/rules';
import { AuditEngine } from '../src/engine';

vi.mock('../src/rules', () => ({
  presetRules: [
    { name: 'foo', fn: vi.fn() },
    { name: 'bar', fn: vi.fn() },
    { name: 'tmp', fn: vi.fn() },
    { name: 'tmp2', fn: vi.fn() },
  ],
}));

describe('AuditEngine', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should run success for main workflow', async () => {
    const mockProject = { packageName: 'test' };
    (presetRules[0].fn as Mock).mockResolvedValue([{ content: 'foo' }]);
    (presetRules[1].fn as Mock).mockResolvedValue([{ content: 'bar' }]);
    (presetRules[2].fn as Mock).mockResolvedValue([]);
    (presetRules[3].fn as Mock).mockResolvedValue([]);
    const engine = new AuditEngine({
      project: mockProject,
      rules: [['foo'], ['bar', 'warning'], ['tmp']],
    });
    const result = await engine.run();
    expect(result).toEqual([
      {
        content: 'foo',
        level: 'error',
        rule: 'foo',
        packageName: 'test',
      },
      {
        content: 'bar',
        level: 'warning',
        rule: 'bar',
        packageName: 'test',
      },
    ]);
    expect(presetRules[3].fn).not.toBeCalled();
  });

  it('should remove empty config property', async () => {
    const mockProject = { packageName: 'test' };
    (presetRules[0].fn as Mock).mockResolvedValue([{ content: 'foo' }]);
    (presetRules[1].fn as Mock).mockResolvedValue([]);
    (presetRules[2].fn as Mock).mockResolvedValue([]);
    (presetRules[3].fn as Mock).mockResolvedValue([]);
    const engine = new AuditEngine({
      project: mockProject,
      rules: [],
      reporter: undefined,
    });
    const result = await engine.run();
    expect(result).toEqual([
      {
        content: 'foo',
        level: 'error',
        rule: 'foo',
        packageName: 'test',
      },
    ]);
  });

  it('should throw error if do not pass project config', () => {
    expect(
      () =>
        new AuditEngine({
          project: undefined,
        }),
    ).toThrowError();
  });

  it('should return empty result if disable', async () => {
    const mockProject = { packageName: 'test' };
    const engine = new AuditEngine({ enable: false, project: mockProject });
    expect(await engine.run()).toEqual([]);
  });

  it('should throw error if bypass invalid rule name', () => {
    const mockProject = { packageName: 'test' };
    const engine = new AuditEngine({
      project: mockProject,
      rules: [['invalid-rule']],
    });
    expect(() => engine.run()).rejects.toThrow();
    expect(presetRules[0].fn).not.toBeCalled();
  });
});
