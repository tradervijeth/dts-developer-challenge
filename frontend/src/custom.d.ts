// This file contains custom type declarations to help TypeScript find modules

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
  export default { jsx, jsxs, Fragment };
}

declare module 'react' {
  export const useState: any;
  export const useEffect: any;
  export const useRef: any;
  export const useCallback: any;
  export const useMemo: any;
  export const useContext: any;
  export const createContext: any;
  export const Fragment: any;
  export const forwardRef: any;
  export const memo: any;
  export const createElement: any;

  export interface FC<P = {}> {
    (props: P): any;
  }

  export default {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
    useContext,
    createContext,
    Fragment,
    forwardRef,
    memo,
    createElement,
    FC
  };
}

declare module 'react-dom/client' {
  export function createRoot(container: Element | null): {
    render(element: any): void;
    unmount(): void;
  };
}

declare module 'date-fns' {
  export function format(date: Date | number, format: string, options?: any): string;
  // Add other date-fns functions as needed
}

declare module 'date-fns/locale' {
  export const enGB: any;
  // Add other locales as needed
}

declare module 'axios' {
  const axios: any;
  export default axios;
}

// Node.js globals
declare const __dirname: string;
declare const require: any;
declare const process: any;
declare const module: any;
