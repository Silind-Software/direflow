import fileMock from 'mock-fs';
import { isDireflowSetup } from '../cli/utils/detectDireflowSetup';

const isSetupFilePath = 'path/to/mock/setup';
const isNotSetupFilePath = 'path/to/mock/non-setup';

fileMock({
  [isSetupFilePath]: {
    'direflow-webpack.js': '',
  },
  [isNotSetupFilePath]: {},
});

describe('Detect Direflow Setup', () => {
  afterAll(() => {
    fileMock.restore()
  });

  it('should return true if Direflow Setup', () => {
    const isSetup = isDireflowSetup(isSetupFilePath);
    expect(isSetup).toBeTruthy();
  });

  it('should return false if not Direflow Setup', () => {
    const isSetup = isDireflowSetup(isNotSetupFilePath);
    expect(isSetup).toBeFalsy();
  });
});
