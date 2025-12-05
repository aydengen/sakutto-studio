// 压缩质量预设
export type CompressionQuality = 'high' | 'balanced' | 'max';
export type OutputFormat = 'original' | 'mp4' | 'mov' | 'avi' | 'mkv' | 'webm';

// 视频基本信息
export interface VideoInfo {
  path: string;
  filename: string;
  size: number;
  duration: number;
  width: number;
  height: number;
  fps: number;
  extension: string;
  codec: string;
}

// 压缩参数
export interface CompressOptions {
  inputPath: string;
  outputPath?: string;
  quality: CompressionQuality;
  outputFormat: OutputFormat;
}

// 进度数据
export interface TaskProgress {
  taskId: string;
  percent: number;
  speed: string; // e.g. "25 fps"
  estimatedTimeRemaining: number;
}

// 结果数据
export interface TaskResult {
  taskId: string;
  success: boolean;
  outputPath?: string;
  outputSize?: number;
  compressionRatio?: number;
  error?: string;
}

// 历史记录
export interface HistoryEntry {
  id: string;
  inputFilename: string;
  outputSize: number;
  inputSize: number;
  outputPath: string;
  compressionRatio: number;
  completedAt: number;
}

// 渲染进程使用的 API 定义（用于 Preload）
export interface ElectronAPI {
  selectFiles: () => Promise<{ canceled: boolean; filePaths: string[] }>;
  selectOutputDir: () => Promise<{ canceled: boolean; path?: string }>;
  getVideoInfo: (path: string) => Promise<VideoInfo>;
  startCompress: (taskId: string, options: CompressOptions) => Promise<TaskResult>;
  cancelTask: (taskId: string) => void;
  cancelAllTasks: () => void;
  showInFolder: (path: string) => void;
  getHistory: () => Promise<HistoryEntry[]>;
  clearHistory: () => Promise<void>;

  // 监听器
  onProgress: (callback: (data: TaskProgress) => void) => () => void;
  onTaskComplete: (callback: (data: TaskResult) => void) => () => void;
}
