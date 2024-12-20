import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import NavigateBackButton from '@/components/NavigateBackButton';
import { TextButtonCreatePoll } from './components/text-button-create-poll';
import { Editor } from './components/editor';
import { getTranslations } from 'next-intl/server';

export default async function EventCreation() {
  const t = await getTranslations('/voice/manage/create');

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
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
          <TextButtonCreatePoll />
        </div>
      </Navigation>
    </div>
  );
}
