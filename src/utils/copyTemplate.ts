import { resolve } from 'path';
import ncp from 'ncp';
import mkdirp from 'mkdirp';
import ITemplateOption from '../interfaces/ITemplateOption';

export const copyTemplate = async (options: ITemplateOption): Promise<string> => {
  const currentDirectory = process.cwd();
  const templateDirectory = resolve(__dirname, `../../templates/${options.template}/${options.language}`);

  const projectDirectory: string = await new Promise((resolve, reject) => {
    const projectDir = `${currentDirectory}/${options.projectName}`;
    mkdirp(projectDir, (err) => {
      if (err) {
        console.log(err);
        reject(`Could not create directory: ' + ${projectDir}`);
      }

      resolve(projectDir);
    });
  });

  await new Promise((resolve, reject) => {
    ncp.ncp(templateDirectory, projectDirectory, (err) => {
      if (err) {
        console.log(err);
        reject('Could not copy template files');
      }

      resolve();
    });
  });

  return projectDirectory;
};
