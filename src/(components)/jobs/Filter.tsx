'use client'
import React, { useEffect, useState, useCallback } from 'react';
import Select,  { SingleValue, ActionMeta } from 'react-select';
import { FixedSizeList as List } from 'react-window';
import debounce from 'lodash.debounce';
import ClipLoader from 'react-spinners/ClipLoader';
import cities from 'cities.json';
import { City, FilterProps, OptionType } from '@/libs/types/Jobstypes';

const Filter: React.FC<FilterProps> = ({ dispatch }) => {
  const [cityOptions, setCityOptions] = useState<OptionType[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<OptionType[]>([]);
  const [selectedCity, setSelectedCity] = useState<SingleValue<OptionType>>(null);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    const options: OptionType[] = (cities as City[]).map(city => ({
      label: `${city.name}, ${city.country}`,
      value: city.name
    }));
    setCityOptions(options);
    setFilteredOptions(options);
    setLoading(false);
  }, []);

  const handleChange = (selectedOption: SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
    setSelectedCity(selectedOption);
    if (selectedOption && selectedOption.value) {
      dispatch({ type: 'SET_LOCATION', payload: selectedOption.value });
    }
  };

  const handleInputChange = useCallback(debounce((inputValue) => {
    setFiltering(true);
    if (inputValue) {
      setFilteredOptions(
        cityOptions.filter(option =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(cityOptions);
    }
    setFiltering(false);
  }, 300), [cityOptions]);

  const MenuList = (props: any) => {
    const height = 35;
    const rows = props.children.length;
    const menuHeight = rows > 8 ? 8 * height : rows * height;

    return (
      <List
        height={menuHeight}
        itemCount={rows}
        itemSize={height}
        width="100%"
      >
        {({ index, style }) => (
          <div style={style}>
            {props.children[index]}
          </div>
        )}
      </List>
    );
  };

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
        <div className=' bg-[#fff] rounded-[8px] max-w-[1076px] w-[95%] lg:w-auto grid grid-cols-1 mx-auto md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 py-[31px] px-[41px] relative md:absolute left-[50%] translate-x-[-50%] bottom-[-45px] h-[100%] md:h-[90px] gap-[42px] justify-between items-center shadow-[4px_0px_10px_1px_#0cce68]'>
          <select name="jobType" className='bg-transparent w-[200px] border-[1px] p-[8px] text-[18px] font-semibold' onChange={handleFilterChange}>
            <option value="">Job Type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="Onsite">Onsite</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>
          
          <Select
            className='w-[200px] bg-transparent text-[14px] font-semibold'
            components={{ MenuList }}
            options={filteredOptions}
            value={selectedCity}
            onChange={handleChange}
            onInputChange={handleInputChange}
            isLoading={filtering}
            placeholder="search location"
          />
          {/* <select name="level" className='bg-transparent text-[18px] font-semibold' onChange={handleFilterChange}>
            <option value="">Level</option>
            <option value="Executive">Executive</option>
            <option value="Senior/Managerial">Senior/Managerial</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Junior">Junior</option>
          </select>
          <select name="experience" className='bg-transparent text-[18px] font-semibold' onChange={handleFilterChange}>
            <option value="">Years of Experience</option>
            <option value="0-2 Years">0-2 Years</option>
            <option value="2-4 Years">2-4 Years</option>
            <option value="5-7 Years">5-7 Years</option>
            <option value="Above 7 years">Above 7 years</option>
          </select> */}
        </div>
      </div>
    </section>
  );
}

export default Filter;
