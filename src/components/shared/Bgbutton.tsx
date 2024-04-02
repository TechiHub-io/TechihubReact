import Link from 'next/link';
import React from 'react';

interface BgbuttonProps {
  link: string;
  text: string;
  btntype: string;
}
function Bgbutton({link, text, btntype}: BgbuttonProps) {
  return (
      <Link href={link} className={btntype === "withborder" ? 'withborder' : 'borderless' }>
        {text}
      </Link>
  );
}

export default Bgbutton;
