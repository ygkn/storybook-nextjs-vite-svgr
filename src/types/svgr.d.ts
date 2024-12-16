// types definition for svgr
// from https://react-svgr.com/docs/next/#typescript
declare module "*.svg" {
  import { FC, SVGProps } from "react";
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module "*.svg?url" {
  const content: string;
  export default content;
}
