import { useState, useEffect, useCallback } from 'react';
import { VideoInfo, CompressOptions, TaskProgress, TaskResult } from '@/shared/types';

// 定义前端用的任务状态结构
export interface CompressTask {
  id: string;
  videoInfo: VideoInfo;
  options: CompressOptions;
  status: 'pending' | 'compressing' | 'success' | 'error' | 'cancelled';
  progress?: TaskProgress;
  result?: TaskResult;
}

export function useCompress() {
  const [tasks, setTasks] = useState<CompressTask[]>([]);

  // 1. 初始化 IPC 监听
  useEffect(() => {
    const unsubProgress = window.electronAPI.onProgress((p) => {
      setTasks(prev => prev.map(t =>
        t.id === p.taskId ? { ...t, status: 'compressing', progress: p } : t
      ));
    });

    const unsubComplete = window.electronAPI.onTaskComplete((res) => {
      setTasks(prev => prev.map(t =>
        t.id === res.taskId
          ? { ...t, status: res.success ? 'success' : 'error', result: res }
          : t
      ));
    });

    return () => { unsubProgress(); unsubComplete(); };
  }, []);

  // 2. 添加文件逻辑
  const addFiles = useCallback(async () => {
    const { canceled, filePaths } = await window.electronAPI.selectFiles();
    if (canceled) return;

    for (const p of filePaths) {
      // 避免重复
      if (tasks.some(t => t.videoInfo.path === p)) continue;

      try {
        const info = await window.electronAPI.getVideoInfo(p);
        const newTask: CompressTask = {
          id: Date.now() + Math.random().toString(36),
          videoInfo: info,
          status: 'pending',
          options: {
            inputPath: p,
            quality: 'balanced', // 默认值
            outputFormat: 'original'
          }
        };
        setTasks(prev => [...prev, newTask]);
      } catch (e) {
        console.error('Failed to load video', e);
      }
    }
  }, [tasks]);

  // 3. 开始任务
  const startTask = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'compressing' } : t));
    window.electronAPI.startCompress(taskId, task.options);
  }, [tasks]);

  return { tasks, addFiles, startTask, setTasks };
}
