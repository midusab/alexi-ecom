import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full animate-pulse">
      <div className="relative aspect-[4/3] bg-slate-200" />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div className="h-5 bg-slate-200 rounded-md w-1/2" />
          <div className="h-5 bg-slate-200 rounded-md w-1/4" />
        </div>
        <div className="space-y-2 mb-4 flex-1 mt-2">
          <div className="h-4 bg-slate-100 rounded-md w-full" />
          <div className="h-4 bg-slate-100 rounded-md w-5/6" />
        </div>
        <div className="space-y-2 mb-5">
          <div className="h-3 bg-slate-100 rounded-md w-1/2" />
          <div className="h-3 bg-slate-100 rounded-md w-2/3" />
        </div>
        <div className="w-full h-10 bg-slate-200 rounded-xl mt-auto" />
      </div>
    </div>
  );
}
