import fs from 'fs';
import chalk from 'chalk';
import { chooseType, chooseLanguage, askCreateProject, askCreateComponent } from './questions';
import { copyTemplate } from './utils/copyTemplate';
import { getNameFormats, isProject, createDefaultName } from './utils/utils';
import { writeProjectNames } from './utils/writeNames';
import { projectFinishedMessage, moreInfoMessage, componentFinishedMessage } from './messages';

export const create = async (): Promise<void> => {
  if (isProject()) {
    return createComponent();
  }

  const answers = await chooseType();

  if (answers.type === 'project') {
    return createProject();
  }

  if (answers.type === 'component') {
    return createComponent();
  }
};

export const createProject = async () => {
  try {
    await handleCreateProject();
  } catch (err) {
    console.log('');
    console.log(chalk.red('Unfortunately, something went wrong creating your Direflow Project'));
    console.log(err);
    console.log('');
  }
};

export const createComponent = async () => {
  try {
    await handleCreateComponent();
  } catch (err) {
    console.log('');
    console.log(chalk.red('Unfortunately, something went wrong creating your Direflow Component'));
    console.log(err);
    console.log('');
  }
};

const handleCreateProject = async () => {
  const setupAnswer = await askCreateProject();
  const languageAnswer = await chooseLanguage();

  if (fs.existsSync(setupAnswer.name)) {
    console.log(chalk.red(`The directory '${setupAnswer.name}' already exists at the current location`));
    return;
  }

  const projectDirectory = await copyTemplate({
    projectName: setupAnswer.name,
    template: 'project-template',
    language: languageAnswer.language,
  });

  await writeProjectNames(projectDirectory, getNameFormats(setupAnswer.name), setupAnswer.description, 'direflow-project');

  console.log(chalk.greenBright(projectFinishedMessage(setupAnswer.name)));
  console.log(chalk.blueBright(moreInfoMessage));
};

const handleCreateComponent = async () => {
  const setupAnswer = await askCreateComponent();
  const languageAnswer = await chooseLanguage();

  const componentName = createDefaultName(setupAnswer.name);
  const componentDir = isProject() ? `direflow-components/${componentName}` : componentName;

  if (fs.existsSync(componentDir)) {
    console.log(chalk.red(`The directory '${componentDir}' already exists at the current location`));
    return;
  }

  const componentDirectory = await copyTemplate({
    projectName: componentDir,
    template: 'component-template',
    language: languageAnswer.language,
  });

  await writeProjectNames(componentDirectory, getNameFormats(componentName), setupAnswer.description, 'direflow-component');

  console.log(chalk.greenBright(componentFinishedMessage(componentDir)));
  console.log(chalk.blueBright(moreInfoMessage));
};
