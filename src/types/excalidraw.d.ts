import { ExcalidrawImperativeAPI, ExcalidrawProps } from '@excalidraw/excalidraw/types/types';

declare module '@excalidraw/excalidraw' {
  export const Excalidraw: React.ForwardRefExoticComponent<
    Partial<ExcalidrawProps> & React.RefAttributes<ExcalidrawImperativeAPI>
  >;

  export function exportToBlob(opts: {
    elements: readonly any[];
    appState?: any;
    files?: any;
    mimeType?: string;
    quality?: number;
  }): Promise<Blob>;
}