import inquirer from 'inquirer';
import IQuestionOption from './interfaces/IQuestionOption';
import ILanguageOption from './interfaces/ILanguageOption';
import ITypeOption from './interfaces/ITypeOption';

export const askCreateProject = async (): Promise<IQuestionOption> => {
  return createQuestions('Direflow Project');
};

export const askCreateComponent = async (): Promise<IQuestionOption> => {
  return createQuestions('Direflow Component');
};

export const chooseType = async (): Promise<ITypeOption> => {
  const questions = [
    {
      type: 'list',
      name: 'type',
      message: 'What do you want to create?',
      choices: [
        {
          value: 'project',
          name: 'A new Direflow Project',
        },
        {
          value: 'component',
          name: 'A new Direflow Component',
        },
      ],
    },
  ];

  console.log('');
  return inquirer.prompt(questions);
};

export const chooseLanguage = async (): Promise<ILanguageOption> => {
  const questions = [
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
  ];

  console.log('');
  return inquirer.prompt(questions);
};

const createQuestions = (createName: string): Promise<IQuestionOption> => {
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: `Choose a name for your ${createName}:`,
      validate: (value: string) => {
        const pass = /^[a-zA-Z0-9-_]+$/.test(value);

        if (pass) {
          return true;
        }

        return 'Please enter a valid name';
      },
    },
    {
      type: 'input',
      name: 'description',
      message: `Give your ${createName} a description (optional)`,
    },
  ];

  console.log('');
  return inquirer.prompt(questions);
};
