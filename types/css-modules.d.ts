// types/css-modules.d.ts
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { [key: string]: string };
  export default classes;
}

// Added to support Tailwind's layer directives
interface TailwindDirectives {
  base: string;
  components: string;
  utilities: string;
}

declare module "tailwindcss/directives" {
  export const layer: TailwindDirectives;
}
