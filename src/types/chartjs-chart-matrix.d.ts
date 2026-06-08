import 'chartjs-chart-matrix';

declare module 'chartjs-chart-matrix' {
  interface MatrixDataPoint {
    readonly weekString: string;
    readonly category: string;
  }
}
