'use client';

export function BackButton() {
  return (
    <div className="fixed top-5 z-50 left-6 sm:left-auto sm:right-[calc(50%+200px+24px)]">
      <button 
        onClick={() => window.history.back()}
        className="w-[58px] h-[58px] bg-white border border-outline rounded-full shadow-main flex items-center justify-center hover:bg-surface-hover transition-colors cursor-pointer"
      >
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
