'use client'
import React, { useReducer } from 'react';
import Homethirdsection from '@/(components)/homepage/Homethirdsection';
import Filter from '@/(components)/jobs/Filter';
import Jobs from '@/(components)/jobs/Jobs';
import { Action, State } from '@/libs/types/Jobstypes';

const initialState = {
  jobType: '',
  location: '',
  // level: '',
  // experience: ''
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_JOBTYPE':
      return { ...state, jobType: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    default:
      return state;
  }
}

function Page() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <main>
      <Filter dispatch={dispatch} />
      <Jobs filters={state} />
      <Homethirdsection title={'What People say about Techihub'} />
    </main>
  );
}

export default Page;
