export default interface ITemplateOption {
  projectName: string;
  template: 'project-template' | 'component-template';
  language: 'ts' | 'js';
}