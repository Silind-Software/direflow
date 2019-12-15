import fileMock from 'mock-fs';
import { promisify } from 'util';
import fs from 'fs';
import { writeProjectNames } from '../cli/utils/writeNames';

const readFile = promisify(fs.readFile);

const filePath = 'path/to/mock/dir';
const files = [
  {
    name: 'package.json',
    content: `
    {
      "name": "%name-snake%",
      "description": "%description%"
    }
    `,
  },
  {
    name: 'index.tsx',
    content: `
    direflowComponent.render(App, '%name-snake%');
    `,
  },
  {
    name: 'README.md',
    content: `
    # %name-title%
    > %description%
    `,
  },
  {
    name: 'direflow-config.js',
    content: `
    direflowMetadata: {
      title: '%name-snake%',
      description: '%description%',
      type: '%setup-type%',
      createVersion: '%install-version%',
    },
    `,
  },
];

const fileMocks = files.reduce((acc: any, current: any) => {
  return {
    ...acc,
    [current.name]: current.content,
  };
}, {});

fileMock({
  [filePath]: fileMocks,
});

describe('Write names to file', () => {
  beforeAll(async () => {
    await writeProjectNames(
      filePath,
      {
        title: 'Cool Component',
        pascal: 'CoolComponent',
        snake: 'cool-component',
      },
      'This component is cool',
      'direflow-component',
      '0.0.0'
    );
  });

  it('should change package.json correctly', async () => {
    const changedFile = await readFile(`${filePath}/package.json`);
    expect(changedFile.toString()).toBe(`
    {
      "name": "cool-component",
      "description": "This component is cool"
    }
    `);
  });

  it('should change index.tsx correctly', async () => {
    const changedFile = await readFile(`${filePath}/index.tsx`);
    expect(changedFile.toString()).toBe(`
    direflowComponent.render(App, 'cool-component');
    `);
  });

  it('should change README.md correctly', async () => {
    const changedFile = await readFile(`${filePath}/README.md`);
    expect(changedFile.toString()).toBe(`
    # Cool Component
    > This component is cool
    `);
  });

  it('should change direflow-config.js correctly', async () => {
    const changedFile = await readFile(`${filePath}/direflow-config.js`);
    expect(changedFile.toString()).toBe(`
    direflowMetadata: {
      title: 'cool-component',
      description: 'This component is cool',
      type: 'direflow-component',
      createVersion: '0.0.0',
    },
    `);
  });
});
