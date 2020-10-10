import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import path from 'path';
import {promises as fs} from 'fs';
import mkdirp from 'mkdirp';
import fsExtra from 'fs-extra';

async function copyDirectory(from: string, to: string): Promise<void> {
  await fsExtra.copy(from, to);
}

async function ensureDirectoriesAndWriteFile(filepath: string, contents: string) {
  await mkdirp(path.dirname(filepath));
  await fs.writeFile(filepath, contents);
}

/** Defines a page to be rendered by the _build_ function. */
export interface Page<T> {

  /** The path at which this page is to be located. */
  path: string;

  /** Additional data for the page. */
  metadata?: T;

  /** A function that returns JSX defining the content of this page. */
  content: () => JSX.Element;
}

/** Render a set of page definitions into a static site. */
export async function build(params: {
  
  /** The path to which to render the pages. */
  to: string,

  /** The pages to render. */
  pages: Page<any>[],

  /** Optional: After rendering pages, copy in the contents of this directory. */
  copyAssetsFrom?: string,

}){
  await fs.rmdir(params.to, { recursive: true });

  await Promise.all(params.pages.map(async page => {
    let Content = page.content;
    await ensureDirectoriesAndWriteFile(path.join(params.to, page.path), renderToStaticMarkup(<Content/>));      
  }));

  if (params.copyAssetsFrom) {
    await copyDirectory(params.copyAssetsFrom, params.to);
  }
}