import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    registerables,
} from 'chart.js';
import * as autocolorPlugin from 'chartjs-plugin-autocolors';
ChartJS.register(...registerables);

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    autocolorPlugin,
);
