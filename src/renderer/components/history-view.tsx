import React, { useEffect, useState } from 'react';
import { History, Trash2, FolderOpen, FileVideo } from 'lucide-react';
import { Button } from './ui/button';
// import { ScrollArea } from '@/renderer/components/ui/scroll-area'; // 假设你有这个 shadcn 组件
import { HistoryEntry } from '@/shared/types';
import { formatFileSize } from '@/renderer/lib/utils';

interface HistoryViewProps {
  onShowInFolder: (path: string) => void;
}

export function HistoryView({ onShowInFolder }: HistoryViewProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载历史记录
  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setLoading(false);
    }
  };

  // 清除历史记录
  const clearHistory = async () => {
    await window.electronAPI.clearHistory();
    setHistory([]);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">加载中...</div>;
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <History className="w-12 h-12 mb-3 opacity-20" />
        <p>暂无历史记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold">历史记录 ({history.length})</h2>
        <Button variant="ghost" size="sm" onClick={clearHistory} className="text-red-500 hover:text-red-600 hover:bg-red-50">
          <Trash2 className="w-4 h-4 mr-2" />
          清空
        </Button>
      </div>

      <div className="space-y-2">
        {history.map((entry) => (
          <div key={entry.id} className="bg-white border rounded-lg p-3 flex items-center gap-3 text-sm hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded flex items-center justify-center flex-shrink-0">
              <FileVideo className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-medium truncate text-gray-900">{entry.inputFilename}</div>
              <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                <span>{formatFileSize(entry.inputSize)} → {formatFileSize(entry.outputSize)}</span>
                <span className="text-green-600 font-medium">
                  -{Math.round(entry.compressionRatio * 100)}%
                </span>
                <span className="text-gray-300">|</span>
                <span>{new Date(entry.completedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => onShowInFolder(entry.outputPath)}
              title="查看文件"
            >
              <FolderOpen className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
