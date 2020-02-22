import Handlebars from 'handlebars';
import fs from 'fs';

const template = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Test Setup</title>
    </head>
    <body>
      {{{component}}}
    </body>
  </html>
`;

const writeBasicHTML = () => {
  const basicHtmlTemplate = Handlebars.compile(template);
  const html = basicHtmlTemplate({ component: '<test-setup></test-setup>' });

  console.log('Writing HTML file');
  fs.writeFileSync('cypress/test-setup/public/index.html', html);
};

export default writeBasicHTML;
