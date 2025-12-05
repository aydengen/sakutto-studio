import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { IpcChannels } from '@/shared/constants/channels';
import {
  CompressOptions,
  TaskResult,
  TaskProgress,
  VideoInfo,
  CompressionQuality,
  OutputFormat
} from '@/shared/types';

// 初始化 FFmpeg 路径
// 这里处理了 asar 打包后的路径问题
const fixPath = (pathStr: string) => pathStr.replace('app.asar', 'app.asar.unpacked');
ffmpeg.setFfmpegPath(fixPath(ffmpegPath.path));

export class VideoService {
  private static runningCommands = new Map<string, ffmpeg.FfmpegCommand>();

  // 获取视频信息
  static async getVideoInfo(filePath: string): Promise<VideoInfo> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);
        const stream = metadata.streams.find(s => s.codec_type === 'video');
        const stats = fs.statSync(filePath);
        resolve({
          path: filePath,
          filename: path.basename(filePath),
          size: stats.size,
          duration: metadata.format.duration || 0,
          width: stream?.width || 0,
          height: stream?.height || 0,
          fps: eval(stream?.r_frame_rate || '0'), // 简单处理 fps
          extension: path.extname(filePath).slice(1),
          codec: stream?.codec_name || 'unknown'
        });
      });
    });
  }

  // 执行压缩
  static async compress(
    window: BrowserWindow,
    taskId: string,
    options: CompressOptions
  ): Promise<TaskResult> {
    return new Promise(async (resolve) => {
      try {
        const info = await this.getVideoInfo(options.inputPath);

        // 简单的输出路径生成逻辑
        const outputPath = options.outputPath || this.generateOutputPath(options);

        // CRF 映射
        const crfMap: Record<CompressionQuality, number> = { high: 18, balanced: 23, max: 28 };
        const crf = crfMap[options.quality];

        const command = ffmpeg(options.inputPath)
          .videoCodec('libx264')
          .size('1280x?')
          .outputOptions([`-crf ${crf}`, '-preset medium'])
          .on('progress', (p) => {
            const progressData: TaskProgress = {
              taskId,
              percent: p.percent || 0,
              speed: 'Processing',
              estimatedTimeRemaining: 0 // 简化处理，你可以加上之前的计算逻辑
            };
            // ✅ 主动推送进度
            if (!window.isDestroyed()) {
              window.webContents.send(IpcChannels.ON_PROGRESS, progressData);
            }
          })
          .on('end', () => {
            this.runningCommands.delete(taskId);
            const stats = fs.statSync(outputPath);
            const result: TaskResult = {
              taskId,
              success: true,
              outputPath,
              outputSize: stats.size,
              compressionRatio: 1 - (stats.size / info.size)
            };
            // ✅ 推送完成事件
            if (!window.isDestroyed()) {
              window.webContents.send(IpcChannels.ON_COMPLETE, result);
            }
            resolve(result);
          })
          .on('error', (err) => {
            console.error(err);
            this.runningCommands.delete(taskId);
            resolve({ taskId, success: false, error: err.message });
          })
          .save(outputPath);

        this.runningCommands.set(taskId, command);

      } catch (e: any) {
        resolve({ taskId, success: false, error: e.message });
      }
    });
  }

  static cancel(taskId: string) {
    const cmd = this.runningCommands.get(taskId);
    if (cmd) {
      cmd.kill('SIGKILL');
      this.runningCommands.delete(taskId);
    }
  }

  static cancelAll() {
    this.runningCommands.forEach(cmd => cmd.kill('SIGKILL'));
    this.runningCommands.clear();
  }

  private static generateOutputPath(opts: CompressOptions): string {
    const ext = opts.outputFormat === 'original' ? path.extname(opts.inputPath) : `.${opts.outputFormat}`;
    return opts.inputPath.replace(/(\.[^.]+)$/, `_compressed${ext}`);
  }
}
