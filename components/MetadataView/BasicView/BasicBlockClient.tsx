'use client';
import { useState, useEffect } from 'react';
import MetadataContentTop from '../MetadataContentTop';
import Content from './Content';
import RightCards from './RightCards';
import ExpertView from './ExpertView';
import PlaceBlock from '../PlaceView/PlaceBlock';
import PersonBlock from '../PersonView/PersonBlock';
import OrganisationBlock from '../OrganisationView/OrganisationBlock';
import PublicationBlock from '../Publication/PublicationBlock';
import ProjectBlock from '../Project/ProjectBlock';
import OldResourceBlock from '../OldResourceView/OldResourceBlock';

export default function BasicBlockClient({ dataJson }: { dataJson: any }) {
  const [expertView, setExpertView] = useState(false);

  const type = dataJson.acdhType;
  const known = [
    'Place',
    'Person',
    'Organisation',
    'Publication',
    'Project',
    'OldResource',
  ];
  const isKnown = known.some(
    (k) => type?.endsWith('#' + k) || type?.endsWith('/' + k)
  );

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
    <section className="max-w-7xl mx-auto gap-[20px]">
      <div className="flex flex-col gap-[20px] ">
        <MetadataContentTop
          data={dataJson}
          expertView={expertView}
          setExpertView={setExpertView}
        />
        <div className="flex flex-col lg:flex-row w-full gap-8">
          <div
            className="w-full lg:w-[75%] bg-white rounded-[12px] border border-[#E1E1E1] p-[24px]"
            id="meta-content-container"
          >
            {expertView ? (
              <ExpertView dataJson={dataJson.expertTableData} />
            ) : (
              <>
                {type?.includes('Place') && <PlaceBlock dataJson={dataJson} />}
                {type?.includes('Person') && (
                  <PersonBlock dataJson={dataJson} />
                )}
                {type?.includes('Organisation') && (
                  <OrganisationBlock dataJson={dataJson} />
                )}
                {type?.includes('Publication') && (
                  <PublicationBlock dataJson={dataJson} />
                )}
                {type?.includes('Project') && (
                  <ProjectBlock dataJson={dataJson} />
                )}
                {type?.includes('OldResource') && (
                  <OldResourceBlock dataJson={dataJson} />
                )}
                {!isKnown && <Content dataJson={dataJson} />}
              </>
            )}
          </div>

          <RightCards dataJson={dataJson} />
        </div>
      </div>
    </section>
  );
}
