import {Chart as ChartJS} from 'chart.js';
import {MatrixController, MatrixElement} from 'chartjs-chart-matrix';
import {createTypedChart} from 'vue-chartjs';

ChartJS.register(MatrixController, MatrixElement);
const HeatmapChart = createTypedChart('matrix', MatrixController);

export {HeatmapChart};
