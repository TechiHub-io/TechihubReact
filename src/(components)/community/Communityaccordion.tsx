import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const data = [
  {
    id: '1',
    title: "What is Techihub?",
    des: "Techihub is a digital tech community connecting top talent with leading companies across Africa and beyond to be at the frontier of creating innovative solutions for the world. "
  },
  {
    id: '2',
    title: "How can Techihub benefit my company?",
    des: "Techihub offers comprehensive talent sourcing and recruitment services tailored to your organization's needs. We also offer a diverse pool of candidates in the tech space and across different parts of the world through our community platform. Whether you're looking for short-term project staffing or permanent placements, we provide access to a diverse pool of skilled tech professionals."
  },
  {
    id: '3',
    title: "What regions does Techihub operate in?",
    des: "Techihub primarily focuses on Africa but extends its services globally, connecting companies and tech talent across different continents."
  },
  {
    id: '4',
    title: " What types of tech roles does Techihub specialize in?",
    des: "We cater to a wide range of tech roles including software developers, data scientists, UX/UI designers, project managers, cybersecurity experts, and more."
  },
  {
    id: '5',
    title: "How does Techihub ensure quality in talent sourcing?",
    des: "We employ rigorous screening processes that not only assess the culture fit but also technical competency. Our aim is to ensure a seamless fit between the employer's requirements and the candidate's skills."
  },
  {
    id: '6',
    title: "Is Techihub only for tech professionals or can companies from other sectors benefit too?",
    des: "While our primary focus is on the tech industry, we also assist companies from various sectors that require tech talent to drive their digital transformation initiatives."
  },
  {
    id: '7',
    title: "How can I post a job opening on Techihub's platform?",
    des: "Posting a job opening on Techihub is straightforward. Simply register as an employer, create your company profile, and start posting your job listings to reach our extensive network of tech professionals."
  },
  {
    id: '8',
    title: "Does Techihub offer any additional services to companies?",
    des: "Yes, besides talent sourcing, we provide consulting services to help companies optimize their tech recruitment strategies and build effective tech teams."
  },
  {
    id: '9',
    title: " I'm a tech professional. How can I benefit from Techihub?",
    des: "As a tech professional, Techihub offers you access to a global job board featuring diverse career opportunities, career advice, networking events, and community support."
  }
]

const Communityaccordion = () => {
  return (
    <section >
      <div className='max-w-[1440px] mx-auto w-[90%]'>
        <h2 className='text-center py-[42px]'>Frequently asked questions</h2>
        <Accordion type="single" className='shadow-[0px_5px_16px_rgba(8,_15,_52,_0.06)] rounded-[18px] p-[24px]' collapsible>
          {
            data.map((dat) => (
              <AccordionItem value={dat.id} className='max-w-[697px] mx-auto'>
                <AccordionTrigger className='text-[22px] py-[32px] no-underline hover:no-underline focus-within:text-[#0CCE68]'>{dat.title}</AccordionTrigger>
                <AccordionContent className='text-[18px] text-[#6F6C90]'>
                  {dat.des}
                </AccordionContent>
              </AccordionItem>
            ))
          }
        </Accordion>
      </div>
    </section>
  )
}

export default Communityaccordion
