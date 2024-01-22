"use client"

import MapComponent from '../libs/googleMap';
import './styles/globals.css';
import Head from 'next/head';

export default function Home() {

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400&display=swap" />
      </Head>
      <main className="main">
        <MapComponent />
      </main>
    </>
  );
}
