<script lang="ts">
import {Chart as ChartJS, Tooltip} from 'chart.js';
import {MatrixController, MatrixElement} from 'chartjs-chart-matrix';
import {createTypedChart} from 'vue-chartjs';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(MatrixController, MatrixElement, Tooltip);

export default createTypedChart('matrix', MatrixController);
</script>
