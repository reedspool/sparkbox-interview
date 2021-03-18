import React from 'react';
import Link from 'next/link'

export default function Layout({ children, home }) {
  return <div>
    {!home && (<Link href="/"><a>Home</a></Link>)}
    <main>{children}</main></div>
}
