import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  items: Record<string, string>;
};

const DisplayField = ({ title, items }: Props) => {
  const { t } = useTranslation();
  console.log(title);
  return (
    <span>
      <strong>{t(title)}: </strong>

      {items.flatMap((item, index) => {
        const element =
          item.type === 'REL' ? (
            <Link key={index} href={`/metadata/${item.id}`}>
              {item.value}
            </Link>
          ) : (
            <span key={index}>{item.value}</span>
          );

        // add commas between items
        return index === 0 ? [element] : [', ', element];
      })}
    </span>
  );
};

export default DisplayField;
