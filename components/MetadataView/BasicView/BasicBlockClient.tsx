'use client';
import { useState, useEffect } from 'react';
import MetadataContentTop from '../MetadataContentTop';
import Content from './Content';
import RightCards from './RightCards';
import ExpertView from './ExpertView';

export default function BasicBlockClient({ dataJson }: { dataJson: any }) {
  const [expertView, setExpertView] = useState(false);

  // Load saved state from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem('expertView');
    if (stored !== null) {
      setExpertView(stored === 'true');
    }
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem('expertView', String(expertView));
  }, [expertView]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 gap-[20px]">
      <div className="flex flex-col gap-[20px] ">
        {/* Top bar with toggle button */}
        <MetadataContentTop
          data={dataJson}
          expertView={expertView}
          setExpertView={setExpertView}
        />

        <div className="flex flex-col lg:flex-row w-full gap-8">
          <div
            className="w-full lg:w-[70%] bg-white rounded-[12px] border border-[#E1E1E1] p-[24px]"
            id="meta-content-container"
          >
            {expertView ? (
              <ExpertView dataJson={dataJson.expertTableData} />
            ) : (
              <Content dataJson={dataJson} />
            )}
          </div>

          <RightCards dataJson={dataJson} />
        </div>
      </div>
    </section>
  );
}
