
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getDataFromScriptElement } from '../Utils.ts';


interface DataPoint {
    year: number,
    transportation: number
    energy: number
    industrial: number
    industrialFuels: number
    householdFuels: number
    agriculture: number
    waste: number
    other: number
}

interface Metric {
    name: string
    color: string
    selector: (dp: DataPoint) => number
}

const metrics: Metric[] = [
    { name: "Other", color: "", selector: dp => dp.other },
    { name: "Waste", color: "", selector: dp => dp.waste },
    { name: "Industrial", color: "", selector: dp => dp.industrial },
    { name: "Agriculture", color: "", selector: dp => dp.agriculture },
    { name: "Household fuels", color: "", selector: dp => dp.householdFuels },
    { name: "Industrial fuels", color: "", selector: dp => dp.industrialFuels },
    { name: "Transportation", color: "", selector: dp => dp.transportation },
    { name: "Energy", color: "", selector: dp => dp.energy },
]


const Content: React.FC<{ emissionsDataId: string, height: number }> = (props) => {
    const data = (JSON.parse(getDataFromScriptElement(props.emissionsDataId)) as [number, number, number, number, number, number, number, number, number][]).map(
        ([year, transportation, energy, industrial, industrialFuels, householdFuels, agriculture, waste, other]) => ({
            year, transportation, energy, industrial, industrialFuels, householdFuels, agriculture, waste, other
        } as DataPoint)
    )


    let baseOptions = {}

    const columnChartOptions: Highcharts.Options = {
        ...baseOptions,
        chart: { type: "column", height: props.height },
        title: null,
        plotOptions: {
            column: { stacking: "normal" },
            series: {
                marker: { enabled: false }
            }
        },
        xAxis: { categories: data.map(dp => dp.year.toString()), tickmarkPlacement: "on" },
        yAxis: { title: { text: "Emisije [kt CO<sub>2</sub>]", useHTML: true } },
        series: metrics.map(metric => ({ type: "column", name: metric.name, data: data.map(metric.selector) }))

    }

    const areaChartOptions: Highcharts.Options = {
        ...baseOptions,
        chart: { type: "area", height: props.height },
        title: null,
        plotOptions: {
            area: { stacking: "normal" },
            series: {
                marker: { enabled: false }
            }
        },
        xAxis: { categories: data.map(dp => dp.year.toString()), tickmarkPlacement: "on" },
        yAxis: { title: { text: "Emisije [kt CO<sub>2</sub>]", useHTML: true } },
        series: metrics.map(metric => ({ type: "area", name: metric.name, data: data.map(metric.selector) }))
    }

    return (
        <>
            <HighchartsReact highcharts={Highcharts} options={columnChartOptions} />
            <HighchartsReact highcharts={Highcharts} options={areaChartOptions} />
        </>
    )
}

export default (elementId: string, height: number, emissionsDataId: string) => {
    ReactDOM.render(<Content emissionsDataId={emissionsDataId} height={height} />, document.getElementById(elementId))
}
