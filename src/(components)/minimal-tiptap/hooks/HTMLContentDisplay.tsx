'use client';

import React from 'react';
import parse, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';

interface DynamicHTMLContentProps {
  htmlContent: string;
}

const DynamicHTMLContent: React.FC<DynamicHTMLContentProps> = ({ htmlContent }) => {
  const sanitizedContent = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'span', 'a'],
    ALLOWED_ATTR: ['style', 'class', 'href', 'target'],
  });

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        switch (domNode.name) {
          case 'ul':
            return <ul className="list-disc pl-5 mb-4">{domToReact(domNode.children as Element[], options)}</ul>;
          case 'ol':
            return <ol className="list-decimal pl-5 mb-4">{domToReact(domNode.children as Element[], options)}</ol>;
          case 'li':
            return <li className="mb-1">{domToReact(domNode.children as Element[], options)}</li>;
          case 'a':
            return <a className="text-blue-600 hover:underline" href={domNode.attribs.href} target="_blank" rel="noopener noreferrer">{domToReact(domNode.children as Element[], options)}</a>;
        }
      }
    }
  };

  return <div className="formatted-content space-y-4">{parse(sanitizedContent, options)}</div>;
};

export default DynamicHTMLContent;