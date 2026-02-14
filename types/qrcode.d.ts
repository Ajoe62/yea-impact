// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
declare module 'qrcode' {
  interface ToDataURLOptions {
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    type?: 'image/png' | 'image/jpeg' | string;
    width?: number;
    margin?: number;
    color?: { dark?: string; light?: string };
  }

  function toDataURL(text: string, opts?: ToDataURLOptions): Promise<string>;

  const exports: {
    toDataURL: typeof toDataURL;
    // keep an index signature for any other exports
    [key: string]: any;
  };

  export = exports;
}
