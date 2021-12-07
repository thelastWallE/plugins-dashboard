import React from 'react';

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
} from 'recharts';

import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import pluginData from '../../data/stats.json';

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    width: "80vw",
  },
  chartAxis: {
  },
  tooltipCard: {
  }
});

class VersionLineTooltip extends React.Component {
  render() {
    const {classes, data } = this.props;

    var versionData = [];

    for (var v in data.versions) {
      let percent = data.versions[v].instances / data.total * 100;
      versionData.push({version: v, count: data.versions[v].instances, percent: percent.toPrecision(3)});
    }

    return (
      <Card variant="outlined" className={ classes.tooltipCard }>
        <CardContent>
          <Typography variant="h4" color="textPrimary">{ data.total } Instances</Typography>
          <div class="row">
            <div class="column">
              <h2>Version</h2>
            </div>
            <div class="column">
              <h2>Instances</h2>
            </div>
            <div class="column">
              <h2>Percent</h2>
            </div>
          </div>
          { versionData.map((version, index) => (
              <div class="row">
                <div class="column">
                  <p>{version.version}</p>
                </div>
                <div class="column">
                  <p>{version.count}</p>
                </div>
                <div class="column">
                  <p>{version.percent}</p>
                </div>
              </div>
          ))}
        </CardContent>
      </Card>
    );
  }
}

const StyledVersionLineTooltip = withStyles(styles, { withTheme: true })(VersionLineTooltip);

const RenderVersionLineTooltip = ({active, payload, label}, pluginId, colors) => {
  if (active && payload && payload.length) {
    return <StyledVersionLineTooltip plugin={pluginId} data={ payload[0].payload } versionColors={colors}/>
  } else {
    return null;
  }
};

class VersionLineChart extends React.Component {
  render() {
    const {theme} = this.props;
    return (
      <ResponsiveContainer height={400}>
        <LineChart data={ pluginData[this.props.plugin.id].history }>
          <CartesianGrid strokeDasharray="5 5" stroke={ theme.palette.text.secondary }/>
          <XAxis dataKey="date" stroke={ theme.palette.text.primary }/>
          <YAxis stroke={ theme.palette.text.primary } />
          <Line name="Total" dataKey="total" strokeWidth={4} type="monotone" />
          { this.props.versionData.map((version, index) => (
            <Line
              name={version.version}
              key={`line-version-${index}`}
              fill={this.props.versionColors[version.version] }
              dataKey={ (item) => (item.versions[version.version] && item.versions[version.version].instances) || null }
              strokeWidth={4}
              stroke={ this.props.versionColors[version.version] }
              type="monotone"
            />
          ))}
          <Tooltip content={ (event) => RenderVersionLineTooltip(event, this.props.plugin.id, this.props.versionColors) }/>
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(VersionLineChart);
