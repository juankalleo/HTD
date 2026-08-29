"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

export function Toc({
  label,
  items,
  video,
}: {
  label: string;
  items: TocItem[];
  video?: string;
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const videoUrl = video ? `https://www.youtube.com/watch?v=${video}` : undefined;

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -65% 0px", threshold: 0 }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="tableOfContents_FQwY thin-scrollbar">
      <div className="nexttech-glossary-label">{label}</div>
      <ul className="table-of-contents table-of-contents__left-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`table-of-contents__link toc-highlight${
                activeId === item.id ? " table-of-contents__link--active" : ""
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      {videoUrl && (
        <div className="nexttech-video">
          <div className="nexttech-glossary-label">Vídeo explicativo</div>
          <a
            className="nexttech-video__link"
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="nexttech-video__thumb"
              src={`https://img.youtube.com/vi/${video}/hqdefault.jpg`}
              alt="Miniatura do vídeo explicativo"
              loading="lazy"
            />
            <span className="nexttech-video__cta">Assista no YouTube ↗</span>
          </a>
        </div>
      )}
    </div>
  );
}
