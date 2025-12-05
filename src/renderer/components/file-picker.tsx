import React from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/renderer/lib/utils';

interface FilePickerProps {
  onClick: () => void; // 点击触发选择文件对话框
  className?: string;
}

export function FilePicker({ onClick, className }: FilePickerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center h-48 w-full rounded-xl border-2 border-dashed transition-all duration-200 ease-out cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        "border-gray-200 hover:border-primary/60 hover:bg-gray-50 active:scale-[0.99]",
        className
      )}
    >
      <span className="p-4 rounded-full bg-gray-100 mb-3 transition-colors group-hover:bg-primary/10">
        <Upload className="w-8 h-8 text-gray-400 transition-colors group-hover:text-primary" />
      </span>
      <p className="text-sm font-medium text-gray-700">
        点击选择视频文件
      </p>
      <p className="text-xs text-gray-400 mt-1">
        支持 MP4, MOV, AVI, MKV 等常见格式
      </p>
    </button>
  );
}
