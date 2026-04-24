import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import NavigateBackButton from '@/components/navigate-back-button';
import { CreatePollButton } from './components/create-poll-button';
import { Editor } from './components/editor';
import { getTranslations } from 'next-intl/server';

export default async function EventCreation() {
  const t = await getTranslations('/voice/manage/create');

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <div className={`mx-2 flex flex-col overflow-y-auto`}>
        <div className={'flex justify-center'}>
          <Editor />
        </div>
      </div>

      <Navigation>
        <div className="mr-1">
          <NavigateBackButton />
        </div>

        <div className="ml-1">
          <CreatePollButton />
        </div>
      </Navigation>
    </div>
  );
}
