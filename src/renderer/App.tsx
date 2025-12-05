import React from 'react';
import { useCompress } from './hooks/useCompress';
import { Button } from '@/renderer/components/ui/button';
import { FilePicker } from '@/renderer/components/file-picker';
import { TaskList } from '@/renderer/components/task-list';
import { HistoryView } from '@/renderer/components/history-view';

export default function App() {
  const { tasks, addFiles, startTask, setTasks } = useCompress(); // 确保 useCompress 暴露了 setTasks 或对应的 remove/cancel 方法
  const [view, setView] = React.useState<'tasks' | 'history'>('tasks');

  return (
    <div className="container mx-auto max-w-3xl p-6">
      {/* 头部切换 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sakutto Studio</h1>
        <div className="space-x-2">
          <Button variant={view === 'tasks' ? 'default' : 'ghost'} onClick={() => setView('tasks')}>压缩任务</Button>
          <Button variant={view === 'history' ? 'default' : 'ghost'} onClick={() => setView('history')}>历史记录</Button>
        </div>
      </div>

      {view === 'tasks' ? (
        <>
          <FilePicker onClick={addFiles} className="mb-8" />
          <TaskList
            tasks={tasks}
            onStart={startTask}
            onRemove={(id) => setTasks(prev => prev.filter(t => t.id !== id))}
            onCancel={(id) => window.electronAPI.cancelTask(id)}
            onShowInFolder={(path) => window.electronAPI.showInFolder(path)}
          />
        </>
      ) : (
        <HistoryView onShowInFolder={(path) => window.electronAPI.showInFolder(path)} />
      )}
    </div>
  )
}
