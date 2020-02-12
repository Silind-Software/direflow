import inquirer from 'inquirer';
import IQuestionOption from './interfaces/IQuestionOption';
import ILanguageOption from './interfaces/ILanguageOption';

export async function chooseLanguage(): Promise<ILanguageOption> {
  console.log('');
  return inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: 'Which language do you want to use?',
      choices: [
        {
          value: 'js',
          name: 'JavaScript',
        },
        {
          value: 'ts',
          name: 'TypeScript',
        },
      ],
    },
  ]);
}

export async function chooseLinter(language: 'js' | 'ts'): Promise<{ linter: 'eslint' | 'tslint' }> {
  if (language === 'js') {
    return {
      linter: 'eslint',
    };
  }

  console.log('');
  return inquirer.prompt([
    {
      type: 'list',
      name: 'linter',
      message: 'Which linter do you want to use?',
      choices: [
        {
          value: 'eslint',
          name: 'ESLint',
        },
        {
          value: 'tslint',
          name: 'TSLint',
        },
      ],
    },
  ]);
}

export async function isNpmModule(): Promise<{ npmModule: boolean }> {
  console.log('');
  return inquirer.prompt([
    {
      type: 'list',
      name: 'npmModule',
      message: 'Do you want this to be a npm module?',
      choices: [
        {
          value: true,
          name: 'yes',
        },
        {
          value: false,
          name: 'no',
        },
      ],
    },
  ]);
}

export async function chooseName(): Promise<IQuestionOption> {
  console.log('');
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: `Choose a name for your Direflow Setup:`,
      validate: (value: string) => {
        const pass = /^[a-zA-Z0-9-_]+$/.test(value);

        if (pass) {
          return true;
        }

        return 'Please enter a valid name';
      },
    },
  ]);
}

export async function chooseDescription(): Promise<IQuestionOption> {
  console.log('');
  return inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: `Give your Direflow Setup a description (optional)`,
    },
  ]);
}
