import React, { Fragment, useMemo } from 'react';
import { isNaN } from 'lodash';
import css from 'styled-jsx/css';
import { isEnvDev, getComponentName } from './util';

const DEFAULT_BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

let MEDIA_QUERY_BREAKPOINTS = { ...DEFAULT_BREAKPOINTS };

// eslint-disable-next-line no-return-assign
export const setMediaQueryBreakpoints = breakpoints => (MEDIA_QUERY_BREAKPOINTS = { ...breakpoints });

const getDisplayWidth = (displayFrom, displayTo) => [
  displayFrom ? MEDIA_QUERY_BREAKPOINTS[displayFrom] : NaN,
  displayTo ? MEDIA_QUERY_BREAKPOINTS[displayTo] - 1 : NaN,
];

const getInverseMediaQuery = (minWidth, maxWidth) => {
  const queries = [];
  if (minWidth) queries.push(`(max-width: ${minWidth - 1}px)`);
  if (maxWidth) queries.push(`(min-width: ${maxWidth + 1}px)`);
  const mediaQuery = queries.join(' and ');
  return mediaQuery;
};

const getMediaQueryCss = (minWidth, maxWidth) => {
  if (!minWidth && !maxWidth) return {};
  return css.resolve`
    @media ${getInverseMediaQuery(minWidth, maxWidth)} {
      display: none !important;
    }
  `;
};

const mergeProps = (props = {}, defaultProps = {}) => ({ ...defaultProps, ...props });

export default function withResponsive(WrappedComponent, defaultProps = {}) {
  function ResponsiveWrapper(props) {
    const { displayFrom, displayTo, className, ...componentProps } = mergeProps(props, defaultProps);

    const componentName = useMemo(() => getComponentName(WrappedComponent), []);
    const [minWidth, maxWidth] = useMemo(() => getDisplayWidth(displayFrom, displayTo), [
      displayFrom,
      displayTo,
    ]);
    const [classes, jsxStyles] = useMemo(() => {
      const { className: jsxClass, styles } = getMediaQueryCss(minWidth, maxWidth);
      return [[className, jsxClass].filter(c => c).join(' '), styles];
    }, [className, minWidth, maxWidth]);

    if (isNaN(minWidth) && isNaN(maxWidth)) {
      if (isEnvDev) {
        console.warn(
          'Warning: Not optimal to use "withResponsive" without display boundaries',
          componentName ? `on "${componentName}"` : ''
        );
      }
      return <WrappedComponent {...componentProps} className={classes} />;
    }

    return (
      <Fragment>
        <WrappedComponent {...componentProps} className={classes} />
        {jsxStyles}
      </Fragment>
    );
  }
  return ResponsiveWrapper;
}
