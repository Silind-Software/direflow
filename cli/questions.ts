import inquirer from 'inquirer';
import IQuestionOption from './interfaces/IQuestionOption';
import ILanguageOption from './interfaces/ILanguageOption';

export const askCreateDireflowSetup = async (): Promise<IQuestionOption> => {
  return createQuestions('Direflow Setup');
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
