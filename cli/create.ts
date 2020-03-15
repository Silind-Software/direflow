import fs from 'fs';
import chalk from 'chalk';
import { chooseName, chooseDescription, chooseLanguage, chooseLinter, isNpmModule } from './questions';
import copyTemplate from './helpers/copyTemplate';
import { getNameFormats, createDefaultName } from './helpers/nameFormat';
import isDireflowSetup from './helpers/detectDireflowSetup';
import { writeProjectNames } from './helpers/writeNames';
import { moreInfoMessage, componentFinishedMessage } from './messages';

interface ISetupPresets {
  name?: string;
  description?: string;
  language?: 'js' | 'ts';
  linter?: 'eslint' | 'tslint';
  npmModule?: boolean;
}

export async function createDireflowSetup(preset: ISetupPresets = {}): Promise<void> {
  if (isDireflowSetup()) {
    console.log(
      chalk.red('You are trying to create a new Direflow Setup inside an existing Direflow Setup.'),
    );
    return;
  }

  if (!preset.name) {
    const { name } = await chooseName();
    preset.name = name;
  }

  if (!preset.description) {
    const { description } = await chooseDescription();
    preset.description = description;
  }

  if (!preset.language) {
    const { language } = await chooseLanguage();
    preset.language = language;
  }

  if (!preset.linter) {
    const { linter } = await chooseLinter(preset.language);
    preset.linter = linter;
  }

  if (!preset.npmModule) {
    const { npmModule } = await isNpmModule();
    preset.npmModule = npmModule;
  }

  const { name, description, language, linter, npmModule } = preset;

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
    linter,
    projectDirectoryPath,
    description,
    npmModule,
    names: getNameFormats(componentName),
    type: 'direflow-component',
  });

  console.log(chalk.greenBright(componentFinishedMessage(projectName)));
  console.log(chalk.blueBright(moreInfoMessage));
}

export default createDireflowSetup;
