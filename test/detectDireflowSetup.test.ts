import { fs, vol } from 'memfs';
import isDireflowSetup from '../cli/helpers/detectDireflowSetup';

jest.mock('fs', () => fs);

const isSetupFilePath = '/path/to/mock/setup';
const isNotSetupFilePath = '/path/to/mock/non-setup';

const mockFsJson = {
  [`${isSetupFilePath}/direflow-webpack.js`]: '',
  [`${isNotSetupFilePath}/foo`]: '',
};
vol.fromJSON(mockFsJson);

describe('Detect Direflow Setup', () => {
  afterAll(() => {
    vol.reset();
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
