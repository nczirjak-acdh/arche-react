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
import Script from 'next/script';

interface MetadataPageProps {
  params: { id: string };
}

export default async function metadata({ params }: MetadataPageProps) {
  const { id } = await params;

  //const lang = 'en';
  const lang = (await cookies()).get('i18nextLng')?.value || 'en';

  let data;
  try {
    data = await fetchMetadata(id, lang);
  } catch (err) {
    return notFound();
  }

  if (!data) {
    return notFound();
  }

  return (
    <div className="p-8 bg-white mb-[100px]">
      <BasicBlock data={data} />
    </div>
  );
}
