"use client"

import MapComponent from '../libs/googleMap';
import './styles/globals.css';

export default function Home() {

  return (
    <>
      <main className="main">
        <MapComponent />
      </main>
    </>
  );
}
