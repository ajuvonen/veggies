import 'chartjs-chart-matrix';

declare module 'chartjs-chart-matrix' {
  interface MatrixDataPoint {
    readonly category: string;
  }
}
