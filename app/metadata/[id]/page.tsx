import { notFound } from 'next/navigation';
import { fetchMetadata } from '@/lib/metadataApi';
import PlaceBlock from '@/components/MetadataView/PlaceView/PlaceBlock';
import PersonBlock from '@/components/MetadataView/PersonView/PersonBlock';
import OrganisationBlock from '@/components/MetadataView/OrganisationView/OrganisationBlock';
import PublicationBlock from '@/components/MetadataView/Publication/PublicationBlock';
import ProjectBlock from '@/components/MetadataView/Project/ProjectBlock';
import OldResourceBlock from '@/components/MetadataView/OldResourceView/OldResourceBlock';
import BasicBlock from '@/components/MetadataView/BasicView/BasicBlock';
import { cookies } from 'next/headers';

interface MetadataPageProps {
  params: { id: string };
}

export default async function metadata({ params }: MetadataPageProps) {
  const { id } = await params;

  const lang = (await cookies()).get('i18nextLng')?.value || 'en';

  console.log('ITTT::::');
  console.log(lang);
  let data;
  try {
    data = await fetchMetadata(id, lang);
    console.log('fetchMetadata inside metadata');
    console.log(data);
    console.log(data.getDataByProperty('acdh:hasTitle'));
  } catch (err) {
    return notFound();
  }

  if (!data) {
    console.log('NOT FOUND');
    return notFound();
  }
  const dataJson = data.toJSON();
  const type = dataJson.acdhType;

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
