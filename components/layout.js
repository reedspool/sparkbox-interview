import React from 'react';

export default function Layout({ children, home }) {
  return (
    <div className="bg-gradient-to-b from-red-200 to-gray-100 flex flex-col items-center">
      <main className="flex-1 max-w-screen-md">{children}</main>
    </div>);
}
