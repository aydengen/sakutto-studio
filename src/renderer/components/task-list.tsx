import React from 'react';
import {
  FileVideo,
  Play,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { Button } from './ui/button'; // 假设你有这个 shadcn 组件，没有就用普通 <button>
import { Progress } from './ui/progress'; // 假设你有这个 shadcn 组件
import { formatFileSize, formatDuration } from '@/renderer/lib/utils';
import { CompressTask } from '@/renderer/hooks/useCompress';

interface TaskListProps {
  tasks: CompressTask[];
  onStart: (taskId: string) => void;
  onRemove: (taskId: string) => void;
  onCancel: (taskId: string) => void;
  onShowInFolder: (path: string) => void;
}

export function TaskList({
  tasks,
  onStart,
  onRemove,
  onCancel,
  onShowInFolder
}: TaskListProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStart={onStart}
          onRemove={onRemove}
          onCancel={onCancel}
          onShowInFolder={onShowInFolder}
        />
      ))}
    </div>
  );
}

function TaskItem({
  task,
  onStart,
  onRemove,
  onCancel,
  onShowInFolder
}: {
  task: CompressTask;
  onStart: (id: string) => void;
  onRemove: (id: string) => void;
  onCancel: (id: string) => void;
  onShowInFolder: (path: string) => void;
}) {
  const { videoInfo, status, progress, result } = task;

  return (
    <div className="group relative bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* 图标区域 */}
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <FileVideo className="w-6 h-6 text-gray-500" />
        </div>

        {/* 信息区域 */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-sm text-gray-900 truncate pr-4" title={videoInfo.filename}>
              {videoInfo.filename}
            </h3>
            {/* 状态标签 */}
            {/* <StatusBadge status={status} error={result?.error} /> */}
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>{formatFileSize(videoInfo.size)}</span>
            <span>•</span>
            <span>{videoInfo.width}x{videoInfo.height}</span>
            <span>•</span>
            <span>{formatDuration(videoInfo.duration)}</span>
          </div>

          {/* 进度条 (仅在压缩时显示) */}
          {status === 'compressing' && progress && (
            <div className="mt-3 space-y-1">
              <Progress value={progress.percent} className="h-2" />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{progress.percent.toFixed(0)}%</span>
                <span>剩余约 {progress.estimatedTimeRemaining}秒</span>
              </div>
            </div>
          )}

          {/* 成功结果 (仅在成功时显示) */}
          {status === 'success' && result && (
            <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
              <span>压缩后: {formatFileSize(result.outputSize || 0)}</span>
              <span className="bg-green-100 px-1.5 py-0.5 rounded text-green-700 font-medium">
                节省 {Math.round((result.compressionRatio || 0) * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* 按钮操作区域 */}
        <div className="flex items-center gap-2">
          {status === 'pending' && (
            <Button size="sm" onClick={() => onStart(task.id)}>
              <Play className="w-4 h-4 mr-1.5" /> 开始
            </Button>
          )}

          {status === 'compressing' && (
            <Button size="sm" variant="destructive" onClick={() => onCancel(task.id)}>
              <X className="w-4 h-4 mr-1.5" /> 取消
            </Button>
          )}

          {status === 'success' && result?.outputPath && (
            <Button size="icon" variant="outline" onClick={() => onShowInFolder(result.outputPath!)} title="打开所在文件夹">
              <FolderOpen className="w-4 h-4" />
            </Button>
          )}

          {(status === 'pending' || status === 'success' || status === 'error' || status === 'cancelled') && (
            <Button size="icon" variant="ghost" onClick={() => onRemove(task.id)} className="text-gray-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// 简单的状态徽标组件
function StatusBadge({ status, error }: { status: string, error?: string }) {
  switch (status) {
    case 'pending':
      return <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded flex-shrink">等待中</span>;
    case 'compressing':
      return <span className="text-xs text-blue-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> 处理中</span>;
    case 'success':
      return <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 完成</span>;
    case 'error':
      return <span className="text-xs text-red-500 flex items-center gap-1" title={error}><AlertCircle className="w-3 h-3" /> 失败</span>;
    case 'cancelled':
      return <span className="text-xs text-gray-400">已取消</span>;
    default:
      return null;
  }
}
