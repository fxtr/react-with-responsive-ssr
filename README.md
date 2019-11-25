# react-with-responsive-ssr

Higher Order Component to display based on viewport breakpoints.<br>
Makes use of CSS media queries to let the browser decide what to display.

## Install

```
npm i -S react-with-responsive-ssr
```

## Usage

```
import withResponsive from 'react-with-responsive-ssr';

const ResponsiveComponent = withResponsive(MyComponent);

<ResponsiveComponent displayFrom="sm">Display from small screens</ResponsiveComponent>
<ResponsiveComponent displaTo="lg">Display up to large screens</ResponsiveComponent>
<ResponsiveComponent displayFrom="md" displaTo="xl">
  Display from medium up to extra large screens
</ResponsiveComponent>
```

It can also be used with `props` as second parameter for HOC

```
const FromSM = withResponsive(TestComponent, { displayFrom: 'sm' });
const ToLG = withResponsive(TestComponent, { displayTo: 'lg' });
const FromMDToXL = withResponsive(TestComponent, { displayFrom: 'md', displayTo: 'xl' });

<FromSM>Display from small screens</FromSM>
<ToLG>Display up to large screens</ToLG>
<FromMDToXL>Display from medium up to extra large screens</FromMDToXL>
```

## Media query breakpoints

### Default breakpoints
```
{
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
}
```

### Custom breakpoints

Use `setMediaQueryBreakpoints()` to set your own breakpoints.

Example for NextJS in `pages/_app.js`:
```
import React from 'react';
import App from 'next/app';
import { setMediaQueryBreakpoints } from 'react-with-responsive-ssr';

setMediaQueryBreakpoints({
  mobile: 0,
  tablet: 1024,
  desktop: 1440,
});

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}
```
