import React from 'react'
const content = [
  {
    title: "Terms and conditions",
    id: "terms-and-conditions",
    content: "Velstar is a Shopify Plus agency, and we partner with brands to help them grow, we also do the same with our people! Here at Velstar, we don't just make websites, we create exceptional digital experiences that consumers love. Our team of designers, developers, strategists, and creators work together to push brands to the next level. From Platform Migration, User Experience & User Interface Design, to Digital Marketing, we have a proven track record in delivering outstanding eCommerce solutions and driving sales for our clients. The role will involve translating project specifications into clean, test-driven, easily maintainable code. You will work with the Project and Development teams as well as with the Technical Director, adhering closely to project plans and delivering work that meets functional & non-functional requirements. You will have the opportunity to create new, innovative, secure and scalable features for our clients on the Shopify platform. Want to work with us? You're in good company!"
  },
  {
    title: "Linitations",
    id: "linitations",
    content: "Great troubleshooting and analytical skills combined with the desire to tackle challenges head-on 3+ years of experience in back-end development working either with multiple smaller projects simultaneously or large-scale applications Experience with HTML, JavaScript, CSS, PHP, Symphony and/or Laravel Working regularly with APIs and Web Services (REST, GrapthQL, SOAP, etc) Have experience/awareness in Agile application development, commercial off-the-shelf software, middleware, servers and storage, and database management. Familiarity with version control and project management systems (e.g., Github, Jira) Great troubleshooting and analytical skills combined with the desire to tackle challenges head-on Ambitious and hungry to grow your career in a fast-growing agency"
  },
  {
    title: "Privacy policy",
    id: "privacy-policy",
    content: "Great troubleshooting and analytical skills combined with the desire to tackle challenges head-on 3+ years of experience in back-end development working either with multiple smaller projects simultaneously or large-scale applications Experience with HTML, JavaScript, CSS, PHP, Symphony and/or Laravel Working regularly with APIs and Web Services (REST, GrapthQL, SOAP, etc) Have experience/awareness in Agile application development, commercial off-the-shelf software, middleware, servers and storage, and database management. Familiarity with version control and project management systems (e.g., Github, Jira) Great troubleshooting and analytical skills combined with the desire to tackle challenges head-on Ambitious and hungry to grow your career in a fast-growing agency"
  },
  // Add more sections as needed
];
const page = () => {
  return (
    <main className='max-w-[1189px] mx-auto w-[90%] flex flex-col gap-[32px] md:flex-row md:justify-between '>
      <section className='max-w-[734px] w-full'>
        <h1 >
          Terms and conditions
        </h1>
        <br />
        {
          content.map((cont) => (
            <div className='flex flex-col gap-[32px]'>
              <h4 className='font-bold pt-[16px]' id={`${cont.id}`}>
                {cont.title}
              </h4>
              <p>
                {cont.content}
              </p>
            </div> 
            
          ))
        }
      </section>
      <aside className='aside max-w-[284px] w-full hidden md:flex flex-col text-[24px] sticky top-[0px]'>
        {
          content.map((cont) => (
            <a href={`#${cont.id}`} className=' font-medium no-underline hover:opacity-[0.8] hover:no-underline'>
              {cont.title}
            </a>
          ))
        }
      </aside>
    </main>
  )
}

export default page
