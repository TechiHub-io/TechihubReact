import React from 'react';

function Filter() {
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
        <div className=' bg-[#fff] rounded-[8px] max-w-[1076px] w-[95%] lg:w-auto grid grid-cols-2 mx-auto md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-[31px] px-[41px] absolute left-[50%] translate-x-[-50%] bottom-[-45px] h-[90px] gap-[42px] justify-center items-center shadow-[4px_0px_10px_1px_#0cce68]'>
          <select name="Jobtype" className='bg-transparent text-[18px] font-semibold' id="">
            <option value="">Job Type</option>
            <option value="">a</option>
            <option value="">b</option>
          </select>
          <select name="Jobtype" className='bg-transparent text-[18px] font-semibold' id="">
            <option value="">Location</option>
            <option value="">a</option>
            <option value="">b</option>
          </select>
          <select name="Jobtype" className='bg-transparent text-[18px] font-semibold' id="">
            <option value="">Level</option>
            <option value="">a</option>
            <option value="">b</option>
          </select>
          <select name="Jobtype" className='bg-transparent text-[18px] font-semibold' id="">
            <option value="">Industry</option>
            <option value="">a</option>
            <option value="">b</option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default Filter;
