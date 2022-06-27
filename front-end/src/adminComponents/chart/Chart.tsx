import React from 'react'
import "./Chart.css";
import {
LineChart,
Line,
XAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer,
} from "recharts";
import { UserStatsType } from '../../pages/adminPages/adminHome/AdminHome'

interface Props {
    data: UserStatsType[],
    dataKey: any,
    grid: any
}

const Chart: React.FC<Props> = ({ data, dataKey, grid }) => {

return (
    <div className="chart">
        <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
            <XAxis dataKey="name" stroke="#5550bd" />
            <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
            <Tooltip />
            {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </LineChart>
        </ResponsiveContainer>
    </div>
);
}
export default Chart