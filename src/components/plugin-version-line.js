import React from "react"

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Legend,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { withStyles } from "@material-ui/core/styles"

import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"

import pluginData from "../../data/stats.json"

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    width: "80vw",
  },
  chartAxis: {},
  tooltipCard: {
    height: "auto",
    cursor: "pointer",
  },
  tooltipTable: {
    borderSpacing: 0,
  },
  tooltipHeader: {
    margin: 0,
    padding: "2px 8px",
  },
  tooltipCell: {
    margin: 0,
    padding: "2px 8px",
  },
})

class VersionLineTooltip extends React.Component {
  render() {
    const { classes, data, versionColors } = this.props

    var versionData = []

    for (var v in data.versions) {
      let percent = (data.versions[v].instances / data.total) * 100
      versionData.push({
        version: v,
        count: data.versions[v].instances,
        percent: percent.toPrecision(3),
      })
    }

    return (
      <Card variant="outlined" className={classes.tooltipCard}>
        <CardContent>
          <Typography variant="h4" color="textPrimary">
            {data.total} Instances
          </Typography>
          <table className={classes.tooltipTable}>
            <thead>
              <tr>
                <th>
                  <h2 className={classes.tooltipHeader}>Version</h2>
                </th>
                <th>
                  <h2 className={classes.tooltipHeader}>Instances</h2>
                </th>
                <th>
                  <h2 className={classes.tooltipHeader}>Percent</h2>
                </th>
              </tr>
            </thead>
            <tbody>
              {versionData.map((version, index) => (
                <tr key={`version-row-${index}`}>
                  <td>
                    <p
                      className={classes.tooltipCell}
                      style={{ color: versionColors[version.version] }}
                    >
                      {version.version}
                    </p>
                  </td>
                  <td>
                    <p className={classes.tooltipCell}>{version.count}</p>
                  </td>
                  <td>
                    <p className={classes.tooltipCell}>{version.percent}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    )
  }
}

const StyledVersionLineTooltip = withStyles(styles, { withTheme: true })(
  VersionLineTooltip,
)

const RenderVersionLineTooltip = (
  { active, payload, label },
  pluginId,
  colors,
) => {
  if (active && payload && payload.length) {
    return (
      <StyledVersionLineTooltip
        plugin={pluginId}
        data={payload[0].payload}
        versionColors={colors}
      />
    )
  } else {
    return null
  }
}

class PinnedVersionDetail extends React.Component {
  render() {
    const { classes, data, versionColors, onClose } = this.props

    if (!data) {
      return null
    }

    var versionData = []

    for (var v in data.versions) {
      let percent = (data.versions[v].instances / data.total) * 100
      versionData.push({
        version: v,
        count: data.versions[v].instances,
        percent: percent.toPrecision(3),
      })
    }

    return (
      <Card variant="outlined" className={classes.tooltipCard}>
        <CardContent>
          <Typography variant="h4" color="textPrimary">
            {data.total} Instances
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {data.date}
          </Typography>
          <table className={classes.tooltipTable}>
            <thead>
              <tr>
                <th>
                  <h2 className={classes.tooltipHeader}>Version</h2>
                </th>
                <th>
                  <h2 className={classes.tooltipHeader}>Instances</h2>
                </th>
                <th>
                  <h2 className={classes.tooltipHeader}>Percent</h2>
                </th>
              </tr>
            </thead>
            <tbody>
              {versionData.map((version, index) => (
                <tr key={`pinned-version-row-${index}`}>
                  <td>
                    <p
                      className={classes.tooltipCell}
                      style={{ color: versionColors[version.version] }}
                    >
                      {version.version}
                    </p>
                  </td>
                  <td>
                    <p className={classes.tooltipCell}>{version.count}</p>
                  </td>
                  <td>
                    <p className={classes.tooltipCell}>{version.percent}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Typography
            variant="caption"
            color="textSecondary"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          >
            Click to close
          </Typography>
        </CardContent>
      </Card>
    )
  }
}

const StyledPinnedVersionDetail = withStyles(styles, { withTheme: true })(
  PinnedVersionDetail,
)

class VersionLineChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = { pinnedData: null }
  }

  handleChartClick = nextState => {
    if (
      nextState &&
      nextState.activePayload &&
      nextState.activePayload.length
    ) {
      this.setState(prevState => ({
        pinnedData: prevState.pinnedData
          ? null
          : nextState.activePayload[0].payload,
      }))
    }
  }

  render() {
    const { theme } = this.props
    const { pinnedData } = this.state
    return (
      <div>
        <ResponsiveContainer height={400}>
          <LineChart
            data={pluginData[this.props.plugin.id].history}
            onClick={this.handleChartClick}
          >
            <CartesianGrid
              strokeDasharray="5 5"
              stroke={theme.palette.text.secondary}
            />
            <XAxis dataKey="date" stroke={theme.palette.text.primary} />
            <YAxis stroke={theme.palette.text.primary} />
            <Line
              name="Total"
              dataKey="total"
              strokeWidth={4}
              type="monotone"
            />
            {this.props.versionData.map((version, index) => (
              <Line
                name={version.version}
                key={`line-version-${index}`}
                fill={this.props.versionColors[version.version]}
                dataKey={item =>
                  (item.versions[version.version] &&
                    item.versions[version.version].instances) ||
                  null
                }
                strokeWidth={4}
                stroke={this.props.versionColors[version.version]}
                type="monotone"
              />
            ))}
            <Tooltip
              content={event =>
                RenderVersionLineTooltip(
                  event,
                  this.props.plugin.id,
                  this.props.versionColors,
                )
              }
            />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
        <StyledPinnedVersionDetail
          data={pinnedData}
          versionColors={this.props.versionColors}
          onClose={() => this.setState({ pinnedData: null })}
        />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(VersionLineChart)
