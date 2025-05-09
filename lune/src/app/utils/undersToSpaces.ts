export function undersToSpaces(input: string): string {
    if (!input) return '';
    return input.replace(/_/g, ' ');
  }