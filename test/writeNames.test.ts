import { promisify } from 'util';
import { fs, vol } from 'memfs';
import writeProjectNames from '../cli/helpers/writeNames';

jest.mock('fs', () => fs);

const mockDirPath = '/path/to/mock/dir';
const mockFsJson = {
  './package.json': `
    {
      "name": "{{names.snake}}",
      "description": "{{defaultDescription}}"
    }
    `,
  './README.md': `
    # {{names.title}}
    > {{defaultDescription}}
    `,
  './tslint.json': 'this-content-includes-tslint-rules',
  './.eslintrc': 'this-content-includes-eslint-rules',
  './nested/index.tsx': `
    direflowComponent.configure({
      name: '{{names.snake}}',
      useShadow: true,
    });
    direflowComponent.create(App);
    `,
};

const readFile = promisify(fs.readFile);

const createMockFileSystem = async (options?: { noDescription?: boolean; useTslint?: boolean }) => {

  vol.fromJSON(mockFsJson, mockDirPath);
  await writeProjectNames({
    names: {
      title: 'Cool Component',
      pascal: 'CoolComponent',
      snake: 'cool-component',
    },
    projectDirectoryPath: mockDirPath,
    description: options?.noDescription ? '' : 'This component is cool',
    linter: options?.useTslint ? 'tslint' : 'eslint',
    packageVersion: '0.0.0',
    type: 'direflow-component',
    npmModule: false,
  });
};

describe('Write names to file #1', () => {
  beforeAll(async () => {
    await createMockFileSystem();
  });

  afterAll(() => {
    vol.reset();
  });

  it('should change package.json correctly', async () => {
    const changedFile = await readFile(`${mockDirPath}/package.json`) as any;
    expect(changedFile.toString()).toBe(`
    {
      "name": "cool-component",
      "description": "This component is cool"
    }
    `);
  });

  it('should change index.tsx correctly', async () => {
    const changedFile = await readFile(`${mockDirPath}/nested/index.tsx`) as any;
    expect(changedFile.toString()).toBe(`
    direflowComponent.configure({
      name: 'cool-component',
      useShadow: true,
    });
    direflowComponent.create(App);
    `);
  });

  it('should change README.md correctly', async () => {
    const changedFile = await readFile(`${mockDirPath}/README.md`) as any;
    expect(changedFile.toString()).toBe(`
    # Cool Component
    > This component is cool
    `);
  });
});

describe('Write names to file #1', () => {
  beforeAll(async () => {
    await createMockFileSystem({ noDescription: true });
  });

  afterAll(() => {
    vol.reset();
  });

  it('should use fallback description in package.json', async () => {
    const changedFile = await readFile(`${mockDirPath}/package.json`) as any;
    expect(changedFile.toString()).toBe(`
    {
      "name": "cool-component",
      "description": "This project is created using Direflow"
    }
    `);
  });

  it('should use fallback description in README.md', async () => {
    const changedFile = await readFile(`${mockDirPath}/README.md`) as any;
    expect(changedFile.toString()).toBe(`
    # Cool Component
    > This project is created using Direflow
    `);
  });
});

describe('Remove tslint file', () => {
  beforeAll(async () => {
    await createMockFileSystem();
  });

  afterAll(() => {
    vol.reset();
  });

  it('should remove tslint file given eslint option', async () => {
    const getFile = () => {
      return readFile(`${mockDirPath}/tslint.json`);
    };

    await expect(getFile).rejects.toThrow(
      Error("ENOENT: no such file or directory, open '/path/to/mock/dir/tslint.json'"),
    );
  });
});

describe('Remove eslint file', () => {
  beforeAll(async () => {
    await createMockFileSystem({ useTslint: true });
  });

  afterAll(() => {
    vol.reset();
  });

  it('should remove eslint file given tslint option', async () => {
    const getFile = () => {
      return readFile(`${mockDirPath}/.eslintrc`) as any;
    };

    await expect(getFile).rejects.toThrow(
      Error("ENOENT: no such file or directory, open '/path/to/mock/dir/.eslintrc'"),
    );
  });
});
