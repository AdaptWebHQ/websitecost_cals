'use client';

import { useEffect } from 'react';
import { useTitleStore } from '@/store/title-store';

interface PageTitleSetterProps {
  title: string;
}

export default function PageTitleSetter({ title }: PageTitleSetterProps) {
  const { setTitle } = useTitleStore();

  useEffect(() => {
    setTitle(title);
    return () => setTitle(null);
  }, [title, setTitle]);

  return null;
}
