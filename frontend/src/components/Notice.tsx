import type { ReactNode } from 'react';
import './Notice.css';

interface NoticeProps {
  kind: 'info' | 'success' | 'error';
  children: ReactNode;
}

export function Notice({ kind, children }: NoticeProps) {
  return (
    <div className={`notice notice--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
