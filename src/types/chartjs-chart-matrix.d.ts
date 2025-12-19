import 'chartjs-chart-matrix';

declare module 'chartjs-chart-matrix' {
  interface MatrixDataPoint {
    x: number | string;
    y: number | string;
    v: number;
    d: string;
  }
}
