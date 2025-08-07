import { notFound } from 'next/navigation';
import { fetchMetadata } from '@/lib/metadataApi';
import PlaceBlock from '@/components/MetadataView/PlaceBlock';
import PersonBlock from '@/components/MetadataView/PersonBlock';
import OrganisationBlock from '@/components/MetadataView/OrganisationBlock';
import PublicationBlock from '@/components/MetadataView/PublicationBlock';
import ProjectBlock from '@/components/MetadataView/ProjectBlock';
import OldResourceBlock from '@/components/MetadataView/OldResourceBlock';
import BasicBlock from '@/components/MetadataView/BasicBlock';

interface MetadataPageProps {
  params: { id: string };
}

export default async function metadata({ params }: MetadataPageProps) {
  const { id } = await params;

  let data;
  try {
    data = await fetchMetadata(id, 'en');
  } catch (err) {
    return notFound();
  }

  if (!data) {
    console.log('NOT FOUND');
    return notFound();
  }
  console.log('AFTER');

  const type = data.getAcdhType;

  return (
    <div className="p-8 bg-white">
      {type === 'place' && <PlaceBlock data={data} />}
      {type === 'person' && <PersonBlock data={data} />}
      {type === 'organisation' && <OrganisationBlock data={data} />}
      {type === 'publication' && <PublicationBlock data={data} />}
      {type === 'project' && <ProjectBlock data={data} />}
      {type === 'oldresource' && <OldResourceBlock data={data} />}
      {![
        'place',
        'person',
        'organisation',
        'publication',
        'project',
        'oldresource',
      ].includes(type) && <BasicBlock data={data} />}
    </div>
  );
}
