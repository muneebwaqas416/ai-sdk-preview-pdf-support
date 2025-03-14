'use client';

import { ProgressProps } from './types';

const Progress: React.FC<ProgressProps> = ({ current, total }) => {
  return (
    <div className="flex items-center justify-between max-w-3xl mx-auto mb-6">
      <div className="text-white/70">
        {current} / {total}
      </div>
      <div className="flex items-center gap-2">
        <div className="text-white/70 text-sm">Track progress</div>
        <label htmlFor='progress' className="relative inline-flex items-center cursor-pointer">
          <input name='progress' id='progress' type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
};

export default Progress;