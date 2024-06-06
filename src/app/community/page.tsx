import CommunitySec from '@/(components)/community/CommunitySec'
import Communityaccordion from '@/(components)/community/Communityaccordion'
import Herocommunity from '@/(components)/community/Herocommunity'
import Header from '@/(components)/shared/Header'
import React from 'react'

const page = () => {
  return (
    <main>
      <Herocommunity />
      <CommunitySec />
      <Communityaccordion />
    </main>
  )
}

export default page
