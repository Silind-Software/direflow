import { resolve } from 'path';
import fs from 'fs';
import ncp from 'ncp';
import { ITemplateOption } from '../types/TemplateOption';

const copyTemplate = async (options: ITemplateOption): Promise<string> => {
  const currentDirectory = process.cwd();
  const templateDirectory = resolve(__dirname, `../../templates/${options.language}`);

  const projectDirectory: string = await new Promise((projectResolve, reject) => {
    const projectDir = `${currentDirectory}/${options.projectName}`;
    fs.mkdir(projectDir, (err: any) => {
      if (err) {
        console.log(err);
        reject(new Error(`Could not create directory: ${projectDir}`));
      }

      projectResolve(projectDir);
    });
  });

  await new Promise((ncpResolve, reject) => {
    ncp.ncp(templateDirectory, projectDirectory, (err) => {
      if (err) {
        console.log(err);
        reject(new Error('Could not copy template files'));
      }

      ncpResolve(true);
    });
  });

  await new Promise((renameResolve, reject) => {
    fs.rename(
      `${projectDirectory}/src/direflow-components/direflow-component`,
      `${projectDirectory}/src/direflow-components/${options.projectName}`,
      (err) => {
        if (err) {
          console.log(err);
          reject(new Error('Could not rename component folder'));
        }

        renameResolve(true);
      },
    );
  });

  return projectDirectory;
};

export default copyTemplate;
