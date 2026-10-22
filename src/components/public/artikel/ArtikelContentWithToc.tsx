'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { List, ChevronDown, Bookmark, ExternalLink } from 'lucide-react';

interface HeadingItem {
  id: string;
  text: string;
  level: 'h2' | 'h3';
}

interface ReadAlsoArticle {
  title: string;
  slug: string;
  category?: string;
}

interface ArtikelContentWithTocProps {
  content: string;
  isHtml: boolean;
  readAlsoArticle?: ReadAlsoArticle | null;
  importantLink?: string | null;
  onHeadingsFound?: (headings: HeadingItem[], activeId: string | null) => void;
}

export default function ArtikelContentWithToc({
  content,
  isHtml,
  readAlsoArticle,
  importantLink,
  onHeadingsFound,
}: ArtikelContentWithTocProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scan headings from rendered content
  useEffect(() => {
    if (!contentRef.current) return;

    const headingElements = contentRef.current.querySelectorAll('h2, h3');
    const items: HeadingItem[] = [];

    headingElements.forEach((el, index) => {
      // Pastikan setiap heading memiliki ID yang unik untuk target scrolling
      if (!el.id) {
        const textSlug = el.textContent
          ? el.textContent
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
          : `heading-${index}`;
        el.id = textSlug || `heading-${index}`;
      }

      // Beri kelas scroll-margin agar tidak tertutup header sticky
      el.classList.add('scroll-mt-28');

      items.push({
        id: el.id,
        text: el.textContent || `Bagian ${index + 1}`,
        level: el.tagName.toLowerCase() === 'h3' ? 'h3' : 'h2',
      });
    });

    setHeadings(items);

    // Setup intersection observer untuk memantau heading aktif saat user scroll
    if (items.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveHeadingId(entry.target.id);
            }
          });
        },
        { rootMargin: '-100px 0% -60% 0%' }
      );

      headingElements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }
  }, [content, isHtml]);

  // Sync dengan parent jika diperlukan
  useEffect(() => {
    if (onHeadingsFound) {
      onHeadingsFound(headings, activeHeadingId);
    }
  }, [headings, activeHeadingId, onHeadingsFound]);

  return (
    <div className="flex flex-col gap-6">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* DAFTAR ISI (MOBILE & TABLET): COLLAPSIBLE ACCORDION             */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {headings.length >= 2 && (
        <div className="lg:hidden bg-white rounded-2xl border border-brand-sand overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setIsMobileTocOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left bg-gradient-to-r from-brand-sand/40 to-white hover:bg-brand-sand/50 transition-colors cursor-pointer"
            aria-expanded={isMobileTocOpen}
            aria-label="Buka Daftar Isi Artikel"
          >
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-dark">
              <List className="w-4 h-4 text-brand-chocolate" />
              <span>Daftar Isi Artikel</span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                isMobileTocOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isMobileTocOpen && (
            <div className="px-5 pb-5 pt-2 border-t border-brand-sand/60 animate-fadeIn">
              <ol className="space-y-2 text-xs sm:text-sm">
                {headings.map((item, idx) => (
                  <li
                    key={item.id}
                    className={item.level === 'h3' ? 'pl-4 border-l border-brand-sand' : ''}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => setIsMobileTocOpen(false)}
                      className={`block py-1 transition-colors leading-relaxed ${
                        activeHeadingId === item.id
                          ? 'text-brand-chocolate font-bold'
                          : 'text-neutral-600 hover:text-brand-dark'
                      }`}
                    >
                      <span className="text-neutral-400 mr-1.5 font-semibold">
                        {idx + 1}.
                      </span>
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ISI KONTEN ARTIKEL BERGAYA DEWABIZ (.blog-content)              */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div
        ref={contentRef}
        className="blog-content text-neutral-700 leading-loose text-sm sm:text-base space-y-5 text-left"
      >
        {isHtml ? (
          <div
            className="prose prose-neutral max-w-none prose-headings:text-brand-dark prose-headings:font-extrabold prose-h2:border-b prose-h2:border-brand-sand prose-h2:pb-2 prose-h2:mt-8 prose-h2:mb-4 prose-blockquote:border-brand-chocolate prose-blockquote:bg-brand-sand/30 prose-blockquote:rounded-r-2xl prose-blockquote:text-neutral-700 prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="space-y-5">
            {content.split('\n\n').map((paragraph, idx) => {
              // Jika ini paragraf ke-2 dan ada artikel terkait, sisipkan blok "Baca Juga" persis seperti DewaBiz
              const shouldInsertReadAlso = idx === 1 && readAlsoArticle;

              return (
                <React.Fragment key={idx}>
                  <p
                    className={
                      idx === 0
                        ? 'text-base sm:text-lg text-neutral-800 leading-relaxed font-normal'
                        : 'whitespace-pre-line text-neutral-700 leading-loose'
                    }
                  >
                    {paragraph}
                  </p>

                  {shouldInsertReadAlso && (
                    <aside className="my-6 p-4 rounded-r-2xl border-l-4 border-brand-chocolate bg-amber-50/70 border border-brand-sand/60 flex flex-col gap-1 shadow-xs">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-brand-chocolate uppercase tracking-wider">
                        <Bookmark className="w-3.5 h-3.5" />
                        Baca Juga
                      </span>
                      <Link
                        href={`/artikel/${readAlsoArticle.slug}`}
                        className="font-bold text-sm sm:text-base text-brand-dark hover:text-brand-chocolate hover:underline transition-colors leading-snug"
                      >
                        {readAlsoArticle.title}
                      </Link>
                    </aside>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAUTAN DOKUMEN / RUJUKAN RESMI (JIKA ADA DARI DATABASE)         */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {importantLink && (
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-900 text-xs sm:text-sm font-semibold">
            <ExternalLink className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Dokumen / Rujukan Resmi Terkait:</span>
          </div>
          <a
            href={importantLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-brand-chocolate hover:bg-brand-dark text-white font-bold text-xs shadow-sm transition-all inline-flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Buka Dokumen</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
