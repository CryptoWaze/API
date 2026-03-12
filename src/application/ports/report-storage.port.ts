export const REPORT_STORAGE = Symbol('REPORT_STORAGE');

export interface IReportStorage {
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  get(key: string): Promise<{ body: Buffer; contentType: string }>;
}
