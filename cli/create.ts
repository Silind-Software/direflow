import fs from 'fs';
import chalk from 'chalk';
import { chooseLanguage, askCreateDireflowSetup } from './questions';
import { copyTemplate } from './utils/copyTemplate';
import { getNameFormats, isDireflowSetup, createDefaultName } from './utils/utils';
import { writeProjectNames } from './utils/writeNames';
import { moreInfoMessage, componentFinishedMessage, projectDeprecated } from './messages';

export const create = async (): Promise<void> => {
  return createDireflowSetup();
};

export const createProject = async () => {
  console.log(chalk.gray(projectDeprecated()));
};

export const createDireflowSetup = async () => {
  try {
    await handleCreateDireflowSetup();
  } catch (err) {
    console.log('');
    console.log(chalk.red('Unfortunately, something went wrong creating your Direflow Component'));
    console.log(err);
    console.log('');
  }
};

const handleCreateDireflowSetup = async () => {
  if (isDireflowSetup()) {
    console.log(chalk.red('You are trying to create a new Direflow Setup inside an existing Direflow Setup.'));
    return;
  }

  const setupAnswer = await askCreateDireflowSetup();
  const languageAnswer = await chooseLanguage();

  const componentName = createDefaultName(setupAnswer.name);
  const componentDir = componentName;

  if (fs.existsSync(componentDir)) {
    console.log(chalk.red(`The directory '${componentDir}' already exists at the current location`));
    return;
  }

  const componentDirectory = await copyTemplate({
    projectName: componentDir,
    language: languageAnswer.language,
  });

  await writeProjectNames(componentDirectory, getNameFormats(componentName), setupAnswer.description, 'direflow-component');

  console.log(chalk.greenBright(componentFinishedMessage(componentDir)));
  console.log(chalk.blueBright(moreInfoMessage));
};
