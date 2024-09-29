export function checkString(line: string, keywords: string[]): boolean {
  return keywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase()));
}

export function getLastLine(text: string): [string, string] {
  const trimmedText = text.trimEnd();
  const index = trimmedText.lastIndexOf("\n");
  const lastLine = index === -1 ? trimmedText : trimmedText.substring(index + 1);
  const updatedText = index === -1 ? "" : trimmedText.substring(0, index);
  return [lastLine, updatedText];
}

export function searchByText(text: string, needed: number, keywords: string[] = []): string[] {
  const found: string[] = [];
  let remainingText = text;

  while (remainingText.length > 0 && found.length < needed) {
    const [lastLine, restOfText] = getLastLine(remainingText);
    remainingText = restOfText;

    if (!keywords.length || checkString(lastLine, keywords)) {
      found.push(lastLine);
    }
  }

  return found;
}

export function searchByArray(text: string, needed: number, keywords: string[] = []): string[] {
  const found: string[] = [];
  const lines = text.split("\n");

  for (let i = lines.length - 1; i >= 0; --i) {
    if (found.length >= needed) break;
    if (!keywords.length || checkString(lines[i], keywords)) {
      found.push(lines[i]);
    }
  }

  return found;
}

type SearchByType = "array" | "text";
export const SEARCHBY: SearchByType = "text";

export function searchBy(text: string, needed: number, keywords: string[] = []): string[] {
  const func = SEARCHBY === "array" ? searchByArray : searchByText;
  return func(text, needed, keywords);
}
