import { ipcMain, dialog, shell, BrowserWindow } from 'electron';
import { IpcChannels } from '@/shared/constants/channels';
import { VideoService } from '@/main/services/video-service';
import { HistoryService } from '@/main/services/history-service';
import * as path from 'path';

export function setupVideoHandlers(mainWindow: BrowserWindow) {
  // 文件选择
  ipcMain.handle(IpcChannels.SELECT_FILES, async () => {
    const res = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'mkv'] }]
    });
    return { canceled: res.canceled, filePaths: res.filePaths };
  });

  // 输出目录
  ipcMain.handle(IpcChannels.SELECT_OUTPUT_DIR, async () => {
    const res = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    return { canceled: res.canceled, path: res.filePaths[0] };
  });

  // 获取信息
  ipcMain.handle(IpcChannels.GET_VIDEO_INFO, (_, path) => VideoService.getVideoInfo(path));

  // 开始压缩
  ipcMain.handle(IpcChannels.COMPRESS_START, async (_, taskId, options) => {
    // 压缩完成后记录历史
    const result = await VideoService.compress(mainWindow, taskId, options);
    if (result.success) {
      // 简单记录，具体字段可根据需要补全
      HistoryService.add({
        id: taskId,
        inputFilename: path.basename(options.inputPath),
        outputPath: result.outputPath!,
        outputSize: result.outputSize!,
        inputSize: 0, // 需要从 VideoInfo 获取，这里简化
        compressionRatio: result.compressionRatio!,
        completedAt: Date.now()
      });
    }
    return result;
  });

  // 取消
  ipcMain.on(IpcChannels.COMPRESS_CANCEL, (_, id) => VideoService.cancel(id));
  ipcMain.on(IpcChannels.COMPRESS_CANCEL_ALL, () => VideoService.cancelAll());

  // 历史记录
  ipcMain.handle(IpcChannels.HISTORY_GET, () => HistoryService.getHistory());
  ipcMain.handle(IpcChannels.HISTORY_CLEAR, () => HistoryService.clear());

  // 工具
  ipcMain.on(IpcChannels.SHOW_IN_FOLDER, (_, p) => shell.showItemInFolder(p));
}
