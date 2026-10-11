import * as React from "react";

/**
 * Safe renderer for the small markdown subset used in exam content:
 * paragraphs, line breaks, **bold**, "- " lists, "| a | b |" tables, and [[itemId]] gaps.
 * Never uses dangerouslySetInnerHTML.
 */
function inline(text: string, gap?: (id: string) => React.ReactNode, keyPrefix = ""): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[\[([^\]]+)\]\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<strong key={`${keyPrefix}b${i++}`}>{m[1]}</strong>);
    else if (m[2] !== undefined) out.push(<React.Fragment key={`${keyPrefix}g${i++}`}>{gap ? gap(m[2]) : "____"}</React.Fragment>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function RichText({ text, gap, className }: { text: string; gap?: (id: string) => React.ReactNode; className?: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className={`paper-text ${className ?? ""}`}>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        if (lines.every((l) => l.trim().startsWith("|"))) {
          const rows = lines.filter((l) => !/^\|\s*-{2,}/.test(l.trim())).map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
          const [head, ...body] = rows;
          return (
            <table key={bi}>
              <thead><tr>{head.map((c, i) => <th key={i}>{inline(c, gap, `h${bi}${i}`)}</th>)}</tr></thead>
              <tbody>{body.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci}>{inline(c, gap, `c${bi}${ri}${ci}`)}</td>)}</tr>)}</tbody>
            </table>
          );
        }
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return <ul key={bi}>{lines.map((l, li) => <li key={li}>{inline(l.trim().slice(2), gap, `l${bi}${li}`)}</li>)}</ul>;
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <React.Fragment key={li}>
                {li > 0 && <br />}
                {inline(l, gap, `p${bi}${li}`)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
