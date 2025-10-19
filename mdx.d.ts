declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";
  const component: (props: MDXProps) => JSX.Element;
  export default component;
}
