'use client'
import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import citiesData from '@/libs/data/cities.json';
import { FilterProps } from '@/libs/types/Jobstypes';

const Filter: React.FC<FilterProps> = ({ dispatch }) => {
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cityOptions = citiesData.map(city => ({
      value: city.name,
      label: `${city.name}, ${city.country_name}`
    }));
    setCities(cityOptions);
    setLoading(false);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch({ type: `SET_${name.toUpperCase()}`, payload: value });
  };

  if (loading) {
    return <div className='flex justify-center mx-auto'><ClipLoader size={50} color={"#123abc"} loading={loading} /></div>
  }

  return (
    <section className='relative w-[100%] mx-auto max-w-[1330px]'>
      <div className='relative '>
        <div className='max-w-[1162px] mx-auto min-w-[240px] h-[318px] bg-[#88FF99] relative flex justify-center items-center rounded-[20px]'>
          <img
            src='/images/jobs/job1.svg'
            className='absolute  w-[20%] lg:w-auto top-[13px] left-[50%] translate-x-[-50%]'
            loading='lazy'
            alt='sql'
          />
          <img
            src='/images/jobs/job2.svg'
            className='absolute w-[5%] lg:w-auto right-[42px] top-[50%] translate-y-[-50%]'
            loading='lazy'
            alt='sql'
          />
          <h1 className='text-[28px] text-center z-30 max-w-[350px] lg:text-[48px] lg:max-w-[622px]'>Find your dream Job here</h1>
          <img
            src='/images/jobs/job3.svg'
            className='absolute w-[5%] lg:w-auto left-[26px] top-[50%] translate-y-[-50%]'
            loading='lazy'
            alt='sql'
          />
        </div>
        <div className=' bg-[#fff] rounded-[8px] max-w-[1076px] w-[95%] lg:w-auto grid grid-cols-1 mx-auto md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 py-[31px] px-[41px] relative md:absolute left-[50%] translate-x-[-50%] bottom-[-45px] h-[100%] md:h-[90px] gap-[42px] justify-between items-center shadow-[4px_0px_10px_1px_#0cce68]'>
          <select name="jobType" className='bg-transparent w-[200px] border-[1px] p-[8px] text-[18px] font-semibold' onChange={handleFilterChange}>
            <option value="">Job Type</option>
            <option value="fulltime">Full-time</option>
            <option value="parttime">Part-time</option>
            <option value="Onsite">Onsite</option>
            <option value="remote">Remote</option>
            <option value="internship">Internship</option>
          </select>
          
          <select 
            name="location" 
            className='bg-transparent w-[200px] border-[1px] p-[8px] text-[18px] font-semibold'
            onChange={handleFilterChange}
          >
            <option value="">Select Location</option>
            {cities.map((city, index) => (
              <option key={index} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>

          <select name="jobLevel" className='bg-transparent w-[200px] border-[1px] p-[8px] text-[18px] font-semibold' onChange={handleFilterChange}>
            <option value="">Job Level</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid level</option>
            <option value="experienced">Experienced</option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default Filter;
