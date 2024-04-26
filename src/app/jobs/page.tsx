import Homethirdsection from '@/components/homepage/Homethirdsection';
import Filter from '@/components/jobs/Filter';
import Jobs from '@/components/jobs/Jobs';

import React from 'react';

function page() {
 
  return (
    <main>
      <Filter />
      <Jobs />
      <Homethirdsection title={'What People say about Techihub'} />
    </main>
  );
}

export default page;
