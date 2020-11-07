// Run this with `ts-node`

import * as React from 'react';
import {build, Page} from '../lib/index';

build({
  to: 'out',
  pages: [
    {
      path: 'index.html',
      metadata: {},
      content: () => <html>
        <head>
          <title>Page title</title>
        </head>
        <body>
          Hello
        </body>
      </html>
    }
  ]
});