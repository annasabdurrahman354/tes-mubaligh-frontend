export function ucwords(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function ucwordsCustom(str: string): string {
  return str
    .split(" ")
    .map((word) => {
      // Preserve leading non-alphabetic characters and handle compound words with dashes or apostrophes
      let match = word.match(/^([^a-zA-Z]*)([a-zA-Z'-]+)(.*)$/);

      if (!match) return word; // If no alphabetic characters, return as is

      let prefix = match[1];
      let coreWord = match[2];
      let suffix = match[3];

      // Check if the core word contains any vowel (a, e, i, o, u)
      if (!/[aeiouAEIOU]/.test(coreWord.replace(/[-']/g, ""))) {
        return word; // Leave unchanged if no vowels are found
      }
      // Capitalize each part of a compound word after a dash but not after an apostrophe
      let processedWord = coreWord
        .split(/(-)/)
        .map((part) =>
          part === "-"
            ? part
            : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
        )
        .join("");

      return prefix + processedWord + suffix;
    })
    .join(" ");
}

export const base64ToFile = async (base64String: string, filename: string): Promise<File | null> => {
  try {
    const res = await fetch(base64String);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error("Error converting base64 to File:", error);
    return null;
  }
};
