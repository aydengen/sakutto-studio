import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannels } from '@/shared/constants/channels';

contextBridge.exposeInMainWorld('electronAPI', {
  selectFiles: () => ipcRenderer.invoke(IpcChannels.SELECT_FILES),
  selectOutputDir: () => ipcRenderer.invoke(IpcChannels.SELECT_OUTPUT_DIR),
  getVideoInfo: (path: string) => ipcRenderer.invoke(IpcChannels.GET_VIDEO_INFO, path),

  startCompress: (taskId: string, options: any) =>
    ipcRenderer.invoke(IpcChannels.COMPRESS_START, taskId, options),

  cancelTask: (taskId: string) => ipcRenderer.send(IpcChannels.COMPRESS_CANCEL, taskId),
  cancelAllTasks: () => ipcRenderer.send(IpcChannels.COMPRESS_CANCEL_ALL),

  showInFolder: (path: string) => ipcRenderer.send(IpcChannels.SHOW_IN_FOLDER, path),

  getHistory: () => ipcRenderer.invoke(IpcChannels.HISTORY_GET),
  clearHistory: () => ipcRenderer.invoke(IpcChannels.HISTORY_CLEAR),

  // 监听器封装
  onProgress: (callback: any) => {
    const handler = (_: any, data: any) => callback(data);
    ipcRenderer.on(IpcChannels.ON_PROGRESS, handler);
    return () => ipcRenderer.removeListener(IpcChannels.ON_PROGRESS, handler);
  },
  onTaskComplete: (callback: any) => {
    const handler = (_: any, data: any) => callback(data);
    ipcRenderer.on(IpcChannels.ON_COMPLETE, handler);
    return () => ipcRenderer.removeListener(IpcChannels.ON_COMPLETE, handler);
  }
});
