import fileMock from 'mock-fs';
import { isDireflowSetup } from '../cli/utils/detectDireflowSetup';

const isSetupFilePath = 'path/to/mock/setup';
const isNotSetupFilePath = 'path/to/mock/non-setup';

const mockFile = `
  {
    "direflowMetadata": {
      "title": "cool-component",
      "description": "This component is cool",
      "type": "direflow-component",
      "createVersion": "0.0.0"
    }
  }
`;

fileMock({
  [isSetupFilePath]: {
    'direflow-config.js': mockFile,
  },
  [isNotSetupFilePath]: {},
});

describe('Detect Direflow Setup', () => {
  afterAll(() => {
    fileMock.restore()
  });

  it('should return true if Direflow Setup', () => {
    const isSetup = isDireflowSetup(isSetupFilePath, mockFile);
    expect(isSetup).toBeTruthy();
  });

  it('should return false if not Direflow Setup', () => {
    const isSetup = isDireflowSetup(isNotSetupFilePath);
    expect(isSetup).toBeFalsy();
  });
});
