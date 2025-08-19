import React from 'react';

import BasicBlockClient from './BasicBlockClient';

export default function BasicBlock({ data }: { data: any }) {
  const dataJson = data.toJSON();

  return <BasicBlockClient dataJson={dataJson} />;
}
