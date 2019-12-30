# Contributing

## Issues
In the case of a bug report, a suggestions, or if you just need help, please feel very free to open an issue.  
  
For general issues, please use the following labels:  
- Something is not working as intended: `Bug`
- Need help with something: `Help wanted`
- Have a question: `Question`
- Have a suggestion or want to request a feature: `Enhancement`
- Does the question regard direflow-component: `Direflow Component`
- Does the question regard direflow-cli: `Direflow CLI`

## Pull request
Pull requests are really welcome!  
  
### Version
When doing a pull request, please make sure to include an new version in your PR.  
There are multiple packages that needs to be in sync, so in order to update the version of Direflow, please use the script:
```console
yarn update-version <new-version>
```

In order to create a version patch, use the command:
```console
yarn update-version patch
```

## Developing on Direflow
Start by making a fork of the direflow repository, and clone it down.  
  
### Install
Now cd into the project folder and run the command:
```console
yarn install:all
```
This command will install the project, the packages and all peer dependencies.

### Link
In order to test your changes locally, you want to link the project using the command:
```console
npm link
```

Now, in order to make sure all version-references are pointed to your local version of the project, use the command:
```console
yarn update-version link
```

### Build
After applying your changes, build the project using the command:
```console
yarn build-link
```

Now, test that the project is working by using the command:
```console
direflow -v
```

This should give you the latest version with a '-link' appended:
```console
  Current version of direflow-cli:
  2.0.2-link
```

Now, test your new functionality.
> Note: After you have build the project using build-link, you may want to run install:all again before continuing to develop.

### Commit the changes
Before committing your new changes, remember to change the version using the command:
```console
yarn update-version <new-version>
```