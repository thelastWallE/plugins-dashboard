import React from 'react';

import { 
  PieChart,
  Pie,
  Cell,
  LineChart,
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

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name}, colors) => {
  const radius = 25 + innerRadius + (outerRadius - innerRadius);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    
    <text 
      x={x} 
      y={y} 
      fill={ colors[index] }
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central" 
    >
      {percent < 0.05 ? '' : `${name}`}
    </text>
  );
};


class VersionLineTooltip extends React.Component {
  render() {
    const {classes, data } = this.props;

    var versionData = [];

    for (var v in data.versions) {
      versionData.push({version: v, count: data.versions[v].instances});
    }

    return (
      <Card variant="outlined" className={ classes.tooltipCard }>
        <CardContent>
          <Typography variant="h4" color="textPrimary">{ data.total } Instances</Typography>
          { versionData.map((version) => ( 
            <Typography variant="subtitle1">
              Version: {version.version} Count: {version.count[version.version]}
            </Typography>
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
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(VersionLineChart);