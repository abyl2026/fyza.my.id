'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function RedirectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const slug = searchParams.get('slug');
    if (slug) {
      router.replace(`/artikel/${slug}`);
    } else {
      router.replace('/artikel');
    }
  }, [searchParams, router]);

  return null;
}

export default function ArtikelDetailRedirect() {
  return (
    <Suspense fallback={null}>
      <RedirectContent />
    </Suspense>
  );
}
