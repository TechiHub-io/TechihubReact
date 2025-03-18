'use client'
import React, { useReducer } from 'react';
import Homethirdsection from '@/(components)/homepage/Homethirdsection';
import Filter from '@/(components)/jobs/Filter';
import Jobs from '@/(components)/jobs/Jobs';
import { Action, State } from '@/libs/types/Jobstypes';

const initialState = {
  jobType: '',
  location: '',
  level: '',
  // experience: ''
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_JOBTYPE':
      return { ...state, jobType: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_JOBLEVEL':
      return { ...state, jobLevel: action.payload };
    default:
      return state;
  }
}

function Page() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <main>
      {/* <Filter dispatch={dispatch} />
      <Jobs filters={state} />
      */}
      
      <div className="bg-gray-100 py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Coming Soon</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          We're working hard to bring you an amazing job search experience. 
          Stay tuned for our comprehensive job listings and advanced filtering options.
        </p>
       
      </div>
      
      <Homethirdsection title={'What People say about Techihub'} />
    </main>
  );
}

export default Page;