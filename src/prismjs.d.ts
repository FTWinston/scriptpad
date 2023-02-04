declare module 'prismjs/components/prism-core' {
    export function highlight(text: string, language: string ): string;
    export const languages: Record<string, string>;
}