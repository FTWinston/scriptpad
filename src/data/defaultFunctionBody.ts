export const defaultFunctionBody = `return input\n  .split('\\n') // Separate each line.
  .filter(line => line.length > 0) // Remove empty lines.
  .map(line => line.replaceAll(\`"\`, \`\\\\"\`)) // Escape all quotes.
  .map(line => \`\"\${line}\"\`) // Wrap each line in quotes.
  .join(', '); // Join them back together with commas.`