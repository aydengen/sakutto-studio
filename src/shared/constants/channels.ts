export const IpcChannels = {
  // 文件与目录
  SELECT_FILES: 'dialog:select-files',
  SELECT_OUTPUT_DIR: 'dialog:select-output-dir',
  SHOW_IN_FOLDER: 'shell:show-in-folder',

  // 视频操作
  GET_VIDEO_INFO: 'video:get-info',
  COMPRESS_START: 'video:compress-start',
  COMPRESS_CANCEL: 'video:compress-cancel',
  COMPRESS_CANCEL_ALL: 'video:compress-cancel-all',

  // 事件 (Main -> Renderer)
  ON_PROGRESS: 'video:on-progress',
  ON_COMPLETE: 'video:on-complete',

  // 历史记录
  HISTORY_GET: 'history:get',
  HISTORY_CLEAR: 'history:clear',
} as const;
