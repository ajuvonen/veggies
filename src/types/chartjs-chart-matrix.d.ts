import 'chartjs-chart-matrix';

declare module 'chartjs-chart-matrix' {
  interface MatrixDataPoint {
    weekString: string;
    category: string;
  }
}
