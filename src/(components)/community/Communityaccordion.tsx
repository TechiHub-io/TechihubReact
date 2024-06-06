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
    title: "What is Webflow and why is it the best website builder?",
    des: "Vitae congue eu consequat ac felis placerat vestibulum lectus mauris ultrices. Cursus sit amet dictum sit amet justo donec enim diam porttitor lacus luctus accumsan tortor posuere."
  },
  {
    id: '2',
    title: "What is Webflow and why is it the best website builder?",
    des: "Vitae congue eu consequat ac felis placerat vestibulum lectus mauris ultrices. Cursus sit amet dictum sit amet justo donec enim diam porttitor lacus luctus accumsan tortor posuere."
  },
  {
    id: '3',
    title: "What is Webflow and why is it the best website builder?",
    des: "Vitae congue eu consequat ac felis placerat vestibulum lectus mauris ultrices. Cursus sit amet dictum sit amet justo donec enim diam porttitor lacus luctus accumsan tortor posuere."
  },
  {
    id: '4',
    title: "What is Webflow and why is it the best website builder?",
    des: "Vitae congue eu consequat ac felis placerat vestibulum lectus mauris ultrices. Cursus sit amet dictum sit amet justo donec enim diam porttitor lacus luctus accumsan tortor posuere."
  },
  {
    id: '5',
    title: "What is Webflow and why is it the best website builder?",
    des: "Vitae congue eu consequat ac felis placerat vestibulum lectus mauris ultrices. Cursus sit amet dictum sit amet justo donec enim diam porttitor lacus luctus accumsan tortor posuere."
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
