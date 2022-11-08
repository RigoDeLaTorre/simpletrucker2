import React, { Component } from 'react'
import CanvasJSReact from './canvasjs.react'
var CanvasJS = CanvasJSReact.CanvasJS
var CanvasJSChart = CanvasJSReact.CanvasJSChart

class ReportChart extends Component {
  render() {
    const { title, data, type } = this.props
    const options = {
      animationEnabled: true,
      exportEnabled: false,
      // theme: "dark2", // "light1", "dark1", "dark2"
      title: {
        text: title
      },
      data: [
        {
          type: type,
          indexLabel: '{label}: {y}%',
          startAngle: -90,
          dataPoints: data
        }
      ]
    }

    return (
      <div>
        <CanvasJSChart
          options={options}
          /* onRef={ref => this.chart = ref} */
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    )
  }
}

export default ReportChart
