"use client";

import '@caldwell619/react-kanban/dist/styles.css';

import React from 'react';


import { NoSsr } from './_components/Nossr';
import Board from './_components/Board';

export default function Page() {

  return (
    <NoSsr>
      <div>
        <header>
          <h1>Kanban do matheuzinho</h1>
        </header>
        <main>
          <div className="wrapper">
            <Board  />
          </div>
        </main>
      </div>
    </NoSsr>
  )
}
