import React from "react";

const blogsdata = [
  {
    id: "trending",
    title: "Trending",
    subsections: [
      {
        id: "1",
        url: "/images/blogs/blog1.jpg",
        title: "Lorem ipsum dolor ",
        date: "April 24, 2022 - 5 min read",
        content:
          "Nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.",
      },
      {
        id: "2",
        url: "/images/blogs/blog1.jpg",
        title: "Lorem ipsum dolor ",
        date: "April 24, 2022 - 5 min read",
        content:
          "Nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.",
      },
      {
        id: "3",
        url: "/images/blogs/blog1.jpg",
        title: "Lorem ipsum dolor ",
        date: "April 24, 2022 - 5 min read",
        content: "Nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.",
      },
    ],
  },
  {
    id: "latestposts",
    title: "Latest posts",
    subsections: [
      {
        id: "1",
        url: "/images/blogs/blog3.jpg",
        title: "Lorem ipsum dolor ",
        date: "April 24, 2022 - 5 min read",
        content:
          "Nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.",
      },
      {
        id: "2",
        url: "/images/blogs/blog3.jpg",
        title: "Lorem ipsum dolor ",
        date: "April 24, 2022 - 5 min read",
        content:
          "Nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.",
      },
      {
        id: "3",
        url: "/images/blogs/blog3.jpg",
        title: "Lorem ipsum dolor ",
        date: "April 24, 2022 - 5 min read",
        content:
          "Nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.",
      },
    ],
  },
  {
    id: "podcasts",
    title: "Podcasts",
    subsections: [
      {
        id: "1",
        url: "/images/blogs/blog4.jpg",
        title: "Lorem ipsum dolor ",
        date: "April 24, 2022 - 5 min read",
        content:
          "Nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.",
      },
      {
        id: "2",
        url: "/images/blogs/blog4.jpg",
        title: "Lorem ipsum dolor ",
        date: "April 24, 2022 - 5 min read",
        content:
          "Nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.",
      },
      {
        id: "3",
        url: "/images/blogs/blog4.jpg",
        title: "Lorem ipsum dolor ",
        date: "April 24, 2022 - 5 min read",
        content:
          "Nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.",
      },
    ],
  },
];

const page = () => {
  return (
    <main className="w-[90%] max-w-[1440px] mx-auto">
      <section className="flex flex-col items-center mx-auto pb-[24px] md:pb-[40px] text-center h-[300px] max-w-[967px]">
        <h1>Tech Insights Unleashed</h1>
        <p>
          Welcome to our tech-centric universe! Dive into a collection of
          thought-provoking articles, tips, and insights curated just for you
        </p>
      </section>
      <section>
        {blogsdata
          .filter((dat) => dat.id === "trending")
          .map((data) => (
            <article id={data.id} className="flex flex-col gap-[32px]">
              <h3 className="text-center md:text-left">{data.title}</h3>
              <div className="grid pl-[16px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                {
                  data.subsections.map((dat) => (
                    <div className="rounded-[20px] max-w-[369px] mx-auto w-full">
                      <img src={dat.url} alt="" />
                      <div className="flex flex-col bg-[#364187] justify-center items-center p-[16px] rounded-b-[20px]">
                        <h4 className="text-[#fff]">
                          {dat.title}
                        </h4>
                        <p className="text-[#9CA3AF] pt-[8px]">
                          {dat.date}
                        </p>
                        <p className="pt-[16px] text-[#fff] text-center">
                          {dat.content}
                        </p>
                      </div>
                    </div>
                  ))
                }
                
              </div>
            </article>
          ))}
      </section>
      <section className="pt-[24px] md:pt-[40px]">
        {blogsdata
          .filter((dat) => dat.id === "latestposts")
          .map((data) => (
            <article id={data.id} className="flex flex-col gap-[32px]">
              <h3 className="text-center md:text-left">{data.title}</h3>
              <div className="grid pl-[16px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                {
                  data.subsections.map((dat) => (
                    <div className="rounded-[20px] max-w-[369px] mx-auto w-full">
                      <img src={dat.url} alt="" />
                      <div className="flex flex-col bg-[#364187] justify-center items-center p-[16px] rounded-b-[20px]">
                        <h4 className="text-[#fff]">
                          {dat.title}
                        </h4>
                        <p className="text-[#9CA3AF] pt-[8px]">
                          {dat.date}
                        </p>
                        <p className="pt-[16px] text-[#fff] text-center">
                          {dat.content}
                        </p>
                      </div>
                    </div>
                  ))
                }
                
              </div>
            </article>
          ))}
      </section>
      <section className="pt-[24px] md:pt-[64px]">
        {blogsdata
          .filter((dat) => dat.id === "podcasts")
          .map((data) => (
            <article id={data.id} className="flex flex-col gap-[32px]">
              <h3 className="text-center md:text-left">{data.title}</h3>
              <div className="grid pl-[16px] place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                {
                  data.subsections.map((dat) => (
                    <div className="rounded-[20px] max-w-[369px] mx-auto w-full">
                      <img src={dat.url} alt="s" className="object-cover w-full" />
                      <div className="flex flex-col bg-[#1976D2] justify-center items-center p-[16px] rounded-b-[20px]">
                        <h4 className="text-[#fff]">
                          {dat.title}
                        </h4>
                        <p className="text-[#9CA3AF] pt-[8px]">
                          {dat.date}
                        </p>
                        <p className="pt-[16px] text-[#fff] text-center">
                          {dat.content}
                        </p>
                      </div>
                    </div>
                  ))
                }
                
              </div>
            </article>
          ))}
      </section>
    </main>
  );
};

export default page;
