"use client";

import { useEffect, useState } from "react";
import { useLocale } from "./locale-provider";

export type TocItem = { id: string; label: string };

function VideoCard({ videoId, lang, watchLabel, thumbAlt }: { videoId: string; lang: string; watchLabel: string; thumbAlt: string }) {
  return (
    <a
      className="nexttech-video__link"
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="nexttech-video__lang">{lang}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="nexttech-video__thumb"
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={thumbAlt}
        loading="lazy"
      />
      <span className="nexttech-video__cta">{watchLabel}</span>
    </a>
  );
}

export function Toc({
  items,
  video,
  videoEn,
}: {
  items: TocItem[];
  video?: string;
  videoEn?: string;
}) {
  const { t } = useLocale();
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

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
      <div className="nexttech-glossary-label">{t.toc.glossary}</div>
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
      {(videoEn || video) && (
        <div className="nexttech-video">
          <div className="nexttech-glossary-label">{t.toc.videoLabel}</div>
          <div className="nexttech-video__stack">
            {videoEn && (
              <VideoCard videoId={videoEn} lang="(English)" watchLabel={t.toc.watchOnYoutube} thumbAlt={t.toc.videoThumbAlt} />
            )}
            {video && (
              <VideoCard videoId={video} lang="PT-BR" watchLabel={t.toc.watchOnYoutube} thumbAlt={t.toc.videoThumbAlt} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
