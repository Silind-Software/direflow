import fs from 'fs';
import chalk from 'chalk';
import { chooseLanguage, askCreateDireflowSetup, chooseLinter, isNpmModule } from './questions';
import { copyTemplate } from './utils/copyTemplate';
import { getNameFormats, createDefaultName } from './utils/nameFormat';
import { isDireflowSetup } from './utils/detectDireflowSetup';
import { writeProjectNames } from './utils/writeNames';
import { moreInfoMessage, componentFinishedMessage } from './messages';

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

  const { name, description } = await askCreateDireflowSetup();
  const { language } = await chooseLanguage();
  const { linter } = await chooseLinter(language);
  const { npmModule } = await isNpmModule();

  const componentName = createDefaultName(name);
  const projectName = componentName;

  if (fs.existsSync(projectName)) {
    console.log(chalk.red(`The directory '${projectName}' already exists at the current location`));
    return;
  }

  const projectDirectoryPath = await copyTemplate({
    language,
    projectName,
  });

  await writeProjectNames({
    linter, projectDirectoryPath, description, npmModule,
    names: getNameFormats(componentName),
    type: 'direflow-component',
  });

  console.log(chalk.greenBright(componentFinishedMessage(projectName)));
  console.log(chalk.blueBright(moreInfoMessage));
};
