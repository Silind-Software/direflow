<span align="center">

  ![](https://silind-s3.s3.eu-west-2.amazonaws.com/direflow/gh-banner.png)

</span>

<span align="right">

  ![NPM Version](https://img.shields.io/npm/v/direflow-cli)
  [![Github License](https://img.shields.io/github/license/Silind-Software/direflow)](https://github.com/Silind-Software/direflow/blob/master/LICENSE)
  ![Build Status](https://github.com/Silind-Software/direflow/workflows/build/badge.svg)
  ![Code Coverage](https://img.shields.io/codecov/c/github/Silind-Software/direflow)

</span>

## [Official webpage](https://direflow.io/)

#### Set up a React App and build it as a Web Component
> This setup is is based on [*react-scripts*](https://www.npmjs.com/package/react-scripts) from [*create-react-app*](https://create-react-app.dev/docs/getting-started)  
> A thorough description of the principles used in this setup, can be read [in this article](https://itnext.io/react-and-web-components-3e0fca98a593)

### Features include
✔ Full Webpack control  
✔ Bundling multiple components together  
✔ Data-sharing and interactions bewteen components  
✔ Passing child elements to the component  
✔ Plugins for varies purposes: font-loading, external scripts, styled-components, and more ...

## Get started

Start by downloading the cli:
```console
npm i -g direflow-cli
```
#### Read more on [direflow.io](https://direflow.io/get-started)

### Create a new Direflow Component
```console
direflow create -c
```

This will bootstrap a new Direflow Component for you.
Now use the following commands:
```console
cd <project-folder>
yarn install
yarn start
```

Your Direflow Component will start running on `localhost:3000` and your browser opens a new window  

<p align="center">
<img src="https://silind-s3.s3.eu-west-2.amazonaws.com/create-react-web-component-demo/create-react-web-component.png" />
</p>

#### Read more on [direflow.io](https://direflow.io/direflow-component)


### Create a new Direflow Project
```console
direflow create -p
```

Now cd into the project, and create the first Direflow Component  
```consloe
cd <project-name>
direflow create -c
```

This will create a folder called `direflow-components`, which will contain all Direflow Components related to the project.

#### Read more on [direflow.io](https://direflow.io/direflow-project)

## Contributing

#### Issues
In the case of a bug report, bugfix or a suggestions, please feel very free to open an issue.

#### Pull request
Pull requests are always welcome, and I'll do my best to do reviews as fast as I can.

## License

This project is licensed under the [MIT License](https://github.com/Silind-Software/direflow/blob/master/LICENSE)

## Get Help
Read more about using Web Components with React on the [official React Docs](https://reactjs.org/docs/web-components.html)  

- Contact me on [Twitter](https://twitter.com/silindsoftware)
- If appropriate, [open an issue](https://github.com/Silind-Software/direflow/issues/new) on GitHub
