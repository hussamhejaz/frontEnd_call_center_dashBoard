import React from 'react';
import { YAxis } from 'recharts';

const CustomYAxis = ({ dataKey = 'value', ...props }) => {
  return <YAxis dataKey={dataKey} {...props} />;
};

export default CustomYAxis;
