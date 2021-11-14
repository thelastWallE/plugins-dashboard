import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


import { 
  PieChart,
  Pie,
  Label,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { withStyles } from '@material-ui/core/styles';

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
const renderCustomizedLabel = ({cx, cy, outerRadius, innerRadius, value, name, percent, midAngle, index}, colors) => {
  
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 0) * cos;
  const sy = cy + (outerRadius + 0) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 7;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  const color = colors[name];

  if (percent > 0.005) { 
    return (
      <>
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={color} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={color} stroke="none"/>
        <text x={ex + (cos >= 0 ? 1 : -1) * 5} y={ey} textAnchor={textAnchor} dominantBaseline="central" fill={color}>{`${name}`}</text>
      </> 
    );
  } else {
    return ('');
  }
};

class VersionPieTooltip extends React.Component {
  render() {
    const { classes } = this.props;
    const color = this.props.versionColors[this.props.version];
    return (
      <Card variant="outlined" className={ classes.tooltipCard }>
        <CardContent>
          <Typography variant="subtitle1" style={ { color: color }} >Version: { this.props.version }</Typography>
          <Typography variant="h3" color="textPrimary">{ `${(this.props.instances / this.props.totalInstances * 100).toFixed(1)}%` }</Typography>
          <Typography variant="caption" color="textSecondary">{ `${this.props.instances} instances` }</Typography>
        </CardContent>
      </Card>
    )
  }
}

const StyledVersionPieTooltip = withStyles(styles, { withTheme: true })(VersionPieTooltip);

const RenderVersionPieTooltip = ({active, payload, label}, pluginId, total, colors) => {
  if (active && payload && payload.length) {
    return <StyledVersionPieTooltip version={payload[0].name} instances={payload[0].value} plugin={pluginId} totalInstances={total} versionColors={colors}/>
  } else {
    return null;
  }
}

class VersionPieChart extends React.Component {
  render() {
    var totalInstances = 0;
    for (var v of this.props.versionData) totalInstances += v.count;


    return (
      <ResponsiveContainer width={'99%'} height={500}>
        <PieChart>
          <Pie 
            data={ this.props.versionData} 
            cx="50%"
            cy="50%"
            dataKey="count" 
            nameKey="version"
            labelLine={false}
            label={(item) => renderCustomizedLabel(item, this.props.versionColors)}
            innerRadius="30%"
            outerRadius="60%"
          >
            <Label value="Versions" fill="textPrimary" offset={0} position="center" />
            { this.props.versionData.map((version, index)=> (
              <Cell key={`pie-version-${index}`} fill={ this.props.versionColors[version.version] } />
            ))}
          </Pie>
          {/* <Legend align="left" verticalAlign="middle" layout="vertical" /> */}
          <Tooltip content={ (event) => RenderVersionPieTooltip(event, this.props.plugin.id, totalInstances, this.props.versionColors) }/>
        </PieChart>
      </ResponsiveContainer>
    )
  }
}

export default withStyles(styles, {withTheme: true})(VersionPieChart);
