import React from 'react';
import { XAxis } from 'recharts';

const CustomXAxis = ({ dataKey = 'name', ...props }) => {
  return <XAxis dataKey={dataKey} {...props} />;
};

export default CustomXAxis;
