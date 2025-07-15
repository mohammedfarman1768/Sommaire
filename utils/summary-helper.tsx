export type ParsedSection = {
  title: string;
  points: string[];
};

export function parseSection(section: string): ParsedSection {
  const [title, ...content] = section.split('\n');

  const cleanTitle = title.startsWith('#')
    ? title.substring(1).trim()
    : title.trim();

  const points: string[] = [];
  let currentPoint = '';

  content.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('•')) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = trimmedLine;
    } else if (!trimmedLine) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = '';
    } else {
      currentPoint += ' ' + trimmedLine;
    }
  });

  if (currentPoint) points.push(currentPoint.trim());

  return {
    title: cleanTitle,
    points: points.filter(
      (point) =>
        point &&
        !point.startsWith('#') &&
        !point.startsWith('[Choose')
    ),
  };
}

export type PointMeta = {
  isNumbered: boolean;
  isMainPoint: boolean;
  hasEmoji: boolean;
  isEmpty: boolean;
};

export function parsePoint(point: string): PointMeta {
  const isNumbered = /^\d+\./.test(point);
  const isMainPoint = /^•/.test(point);
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u;
  const hasEmoji = emojiRegex.test(point);
  const isEmpty = !point.trim();

  return {
    isNumbered,
    isMainPoint,
    hasEmoji,
    isEmpty,
  };
}

export type EmojiPoint = {
  emoji: string;
  text: string;
} | null;

export function parseEmojiPoint(content: string): EmojiPoint {
  const cleanContent = content.replace(/^[•]\s*/, '').trim();
  const match = cleanContent.match(/^(\p{Emoji}+)(.+)$/u);
  if (!match) return null;

  const [, emoji, text] = match;
  return {
    emoji: emoji.trim(),
    text: text.trim(),
  };
}
