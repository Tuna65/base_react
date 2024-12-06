declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}
declare let ENV;
declare let API_URL;
// declare let fetch;
declare let HOSTNAME;
declare let API_HOSTNAME;