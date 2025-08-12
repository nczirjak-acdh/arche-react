import React from 'react';

import BasicBlockClient from './BasicBlockClient';

export default function BasicBlock({ data }: { data: any }) {
  console.log('BasicBlock');
  console.log(data);
  const dataJson = data.toJSON();

  return <BasicBlockClient dataJson={dataJson} />;
}
