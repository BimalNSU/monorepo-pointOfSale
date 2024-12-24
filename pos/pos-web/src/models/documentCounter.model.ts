//counterId = "invoice" or 'product'
export interface DocumentCounter {
  isIncludeDateStr: boolean; //default false
  prefix: string | null;
  dateStr: string | null; //e.g. YYYYMMDD
  count: number;
}
