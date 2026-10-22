'use client';

import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface HeadingItem {
  id: string;
  text: string;
  level: 'h2' | 'h3';
}

export default function ArtikelDesktopToc() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // Cari heading di dalam container .blog-content
    const container = document.querySelector('.blog-content');
    if (!container) return;

    const headingEls = container.querySelectorAll('h2, h3');
    if (!headingEls || headingEls.length < 2) {
      setHeadings([]);
      return;
    }

    const items: HeadingItem[] = [];
    headingEls.forEach((el, index) => {
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
      el.classList.add('scroll-mt-28');

      items.push({
        id: el.id,
        text: el.textContent || `Bagian ${index + 1}`,
        level: el.tagName.toLowerCase() === 'h3' ? 'h3' : 'h2',
      });
    });

    setHeadings(items);

    // Observer untuk menandai heading aktif saat scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0% -60% 0%' }
    );

    headingEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (headings.length < 2) return null;

  const scrollToHeading = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className="hidden lg:block bg-white rounded-3xl p-5 shadow-sm border border-brand-sand">
      <h3 className="flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-dark mb-3 pb-2.5 border-b border-brand-sand/70">
        <List className="w-4 h-4 text-brand-chocolate" />
        <span>Daftar Isi Artikel</span>
      </h3>

      <nav className="space-y-1 max-h-72 overflow-y-auto no-scrollbar">
        {headings.map((item, idx) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => scrollToHeading(e, item.id)}
              className={`block px-3 py-1.5 text-xs transition-all border-l-2 leading-relaxed ${
                item.level === 'h3' ? 'pl-6 text-[11px]' : ''
              } ${
                isActive
                  ? 'border-brand-chocolate text-brand-chocolate font-bold bg-amber-50/70 rounded-r-lg'
                  : 'border-transparent text-neutral-600 hover:text-brand-dark hover:border-brand-sand hover:bg-brand-sand/30'
              }`}
            >
              <span className="text-neutral-400 mr-1.5 font-medium">{idx + 1}.</span>
              {item.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
