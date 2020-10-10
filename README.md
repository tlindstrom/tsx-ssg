# tsx-ssg: Minimalist static site generation with TypeScript and JSX

I made this because I think static site generation should be simple. I don't want to learn some big, bloated framework, I just want to render some frickin' HTML. 🙃 

## How it works

Pages are defined with plain JavaScript objects containing three properties:
- `path`, the path of the HTML file to render to.
- `metadata`, an object containing whatever metadata you want to attach to the page.
- `content`, a function returning the JSX that renders the page.

Since these are just plain objects, you can create them programmatically from data that you can get from anywhere. And in the JSX you can do anything too, like refer to the `path` and `metadata` of other pages, include React components as partials, render markdown, load data from a database or remote server, whatever you might need. And since it's all JSX and TypeScript, your markup will be statically typed and robust. And it builds fast too, yay!

After creating your page definitions, you just pass them to the `build` function, and _voila_, you're done. 👨‍🍳 

For convenience, `build` also takes an optional `copyAssetsFrom` parameter, for copying static assets into your build, in case you don't need a fancy assets pipeline and just want to copy in some plain CSS, JS and such.

```tsx
import * as React from 'react'; // With the new JSX transform in React 17, we should be able to get rid of this import soon
import { build } from "tsx-ssg";

build({
  to: './output',
  copyAssetsFrom: './assets',
  pages: [
    {
      path: '/index.html',
      content: () => <>
        <h1>Hello, world!</h1>
        <p>Lorem ipsum dolor sit hamburger</p>
      </>
    },
    {
      path: '/about.html',
      content: () => <>
        <h1>This is the about page</h1>
        <p>Lorem ipsum dolor sit cauliflower</p>
      </>
    }
  ]
}); 
```

The following example demonstrates how to create pages programmatically from data, and how pages can refer to the `path` and `metadata` of other pages:

```tsx
import * as React from 'react';
import { build } from "tsx-ssg";

let products = [
  { id: '001-fridge', name: 'Fridge', description: 'It freezes your food', image: '/assets/fridge.jpg' },
  { id: '002-oven', name: 'Oven', description: 'It heats up your food', image: '/assets/oven.jpg' },
  { id: '003-tv', name: 'TV', description: 'It shows moving pictures', image: '/assets/tv.jpg' },
];

let Layout = ({children, title}) => <html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <h1>The amazing furniture retailer</h1>
    <nav>
      <a href={homePage.path}>Home</a>
      <a href={productsIndexPage.path}>Products</a>
    </nav>
    <main>
      {children}
    </main>
  </body>
</html>;

let homePage = {
  path: '/index.html',
  content: () => <Layout title="Home">
    <h1>Welcome to our site</h1>
    <p>We sell fridges, ovens and TVs.</p>
  </Layout>
};

let productsIndexPage = {
  path: '/products/index.html',
  content: () => <Layout title="Products">
    <h1>Products</h1>
    <p>These are the products we sell:</p>
    <ul>
      {productPages.map((page,i) => <li key={i}><a href={page.path}>{page.metadata.name}</a></li>)}
    </ul>
  </Layout>
};

let productPages = products.map(product => ({
  path: `/products/${product.id}.html`,
  metadata: product,
  content: () => <Layout title={product.name}>
    <h1>{product.name}</h1>
    <p>{product.description}</p>
    <img src={product.image}/>
  </Layout>
}));

build({
  to: './output',
  pages: [
    homePage,
    productsIndexPage,
    ...productPages
  ]
});

```

## FAQ

### How do I set up the build?
You'll need a `tsconfig.json` with `jsx` set to `react`. I would run my entrypoint with `ts-node --transpile-only` (for speed and ease of use), and serve the output locally with `npx serve`.

### How should I structure my project?
As your project grows, you can put your data, pages and partials into separate files, to keep things nice and tidy. Other than that, just do whatever makes sense for your use case.

### Do I need TypeScript?
No, it works fine with JS/JSX, or just plain `React.createElement` calls. But for sanity's sake you'll probably want to write your templates as JSX, and then, if you're doing transpilation anyway, you might as well go with TypeScript, right? Anyway, Here is a minimal JS example:

```js
let React = require('react');
let {build} = require('tsx-ssg');

build({
  to: 'output',
  pages: [
    {
      path: '/index.html',
      content: () => React.createElement('h1', null, 'Hello world')
    }
  ]
});
```

### Does it hydrate?
No, this is not for isomorphic React applications. If you want React on the client side, I suggest building that into a separate client-side bundle.