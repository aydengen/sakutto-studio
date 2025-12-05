import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { HistoryEntry } from '@/shared/types';

const HISTORY_FILE = path.join(app.getPath('userData'), 'history.json');

export class HistoryService {
  static getHistory(): HistoryEntry[] {
    try {
      if (!fs.existsSync(HISTORY_FILE)) return [];
      return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
    } catch { return []; }
  }

  static add(entry: HistoryEntry) {
    const list = this.getHistory();
    list.unshift(entry);
    // 只保留最近 50 条
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(list.slice(0, 50), null, 2));
  }

  static clear() {
    fs.writeFileSync(HISTORY_FILE, '[]');
  }
}
