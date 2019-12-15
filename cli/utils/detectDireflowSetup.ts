import fs from 'fs';

export const isDireflowSetup = (currentDirectory = process.cwd(), metaData?: string): boolean => {
  if (!fs.existsSync(`${currentDirectory}/direflow-config.js`)) {
    return false;
  }

  const spec = metaData ? JSON.parse(metaData) : require(`${currentDirectory}/direflow-config.js`);

  return spec.direflowMetadata && spec.direflowMetadata.type && spec.direflowMetadata.type === 'direflow-component';
};
