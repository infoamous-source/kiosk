import React from 'react';

interface SimpleMarkdownProps {
  content: string;
  className?: string;
}

type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'ol'; items: string[] }
  | { type: 'ul'; items: string[] };

function parseBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderInline(text: string): React.ReactNode[] {
  return parseBold(text);
}

function renderLineBreaks(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  lines.forEach((line, i) => {
    result.push(...renderInline(line));
    if (i < lines.length - 1) {
      result.push(<br key={`br-${i}`} />);
    }
  });
  return result;
}

function parseBlocks(content: string): Block[] {
  const paragraphs = content.split(/\n\n+/);
  const blocks: Block[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    const lines = trimmed.split('\n');

    const isOl = lines.every((l) => /^\d+\.\s/.test(l.trim()));
    if (isOl && lines.length > 0) {
      blocks.push({
        type: 'ol',
        items: lines.map((l) => l.trim().replace(/^\d+\.\s/, '')),
      });
      continue;
    }

    const isUl = lines.every((l) => /^[-•]\s/.test(l.trim()));
    if (isUl && lines.length > 0) {
      blocks.push({
        type: 'ul',
        items: lines.map((l) => l.trim().replace(/^[-•]\s/, '')),
      });
      continue;
    }

    blocks.push({ type: 'paragraph', text: trimmed });
  }

  return blocks;
}

export function SimpleMarkdown({ content, className }: SimpleMarkdownProps) {
  if (!content) return null;

  const blocks = parseBlocks(content);

  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'ol':
            return (
              <ol key={i} className="list-decimal list-inside space-y-1">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          case 'ul':
            return (
              <ul key={i} className="list-disc list-inside space-y-1">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case 'paragraph':
          default:
            return <p key={i}>{renderLineBreaks(block.text)}</p>;
        }
      })}
    </div>
  );
}
