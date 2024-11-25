import { type Mock } from 'vitest';

import { readConfig } from '../src/utils/read-config';
import { AuditEngine } from '../src/engine';
import { auditPackage } from '../src';

vi.mock('../src/utils/read-config', () => ({
  readConfig: vi.fn(),
}));

vi.mock('../src/engine', () => ({ AuditEngine: vi.fn() }));

const mockProject = { project: 'path/to/folder' };
describe('auditPackage', () => {
  it('should run success with correct params', async () => {
    const mockRun = vi.fn().mockResolvedValue([{ foo: 'bar' }]);
    (AuditEngine as Mock).mockReturnValue({ run: mockRun });
    (readConfig as Mock).mockReturnValue({ foo: 'bar' });

    const res = await auditPackage(mockProject);
    expect(readConfig).toBeCalled();
    expect(AuditEngine).toBeCalledWith({ foo: 'bar', project: mockProject });
    expect(res).toEqual([{ foo: 'bar' }]);
  });
});
