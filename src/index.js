import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { assignWith, isUndefined } from 'lodash';
import { isBrowser, isEnvDev, getComponentName, generateRandomString } from './util';

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
  displayFrom ? MEDIA_QUERY_BREAKPOINTS[displayFrom] : null,
  displayTo ? MEDIA_QUERY_BREAKPOINTS[displayTo] - 1 : null,
];

const getInverseMediaQuery = (minWidth, maxWidth) => {
  const queries = [];
  if (minWidth) queries.push(`(max-width: ${minWidth - 1}px)`);
  if (maxWidth) queries.push(`(min-width: ${maxWidth + 1}px)`);
  const mediaQuery = queries.join(' and ');
  return mediaQuery;
};

const getMediaQueryCss = (minWidth, maxWidth) => {
  if (!minWidth && !maxWidth) return '';
  return css`
    @media ${getInverseMediaQuery(minWidth, maxWidth)} {
      display: none !important;
    }
  `;
};

const matchesMediaQuery = query => window.matchMedia(query).matches;

const MediaQuery = styled(({ Component, minWidth, maxWidth, ...props }) => <Component {...props} />)`
  ${({ minWidth, maxWidth }) => getMediaQueryCss(minWidth, maxWidth)}
`;

const mergeProps = (props, defaultProps = {}) =>
  assignWith({}, defaultProps, props, (a, b) => (isUndefined(b) ? a : b));

export default function withResponsive(WrappedComponent, defaultProps = {}) {
  function ResponsiveWrapper(props) {
    const { displayFrom, displayTo, className, ...componentProps } = mergeProps(props, defaultProps);

    // re-render at window resize
    const [, setWindowSize] = useState(isBrowser ? [window.innerWidth, window.innerHeight] : [0, 0]);
    // force re-hydrate and differentiate components with a random string
    const [componentIdentifier, setComponentIdentifier] = useState(generateRandomString());
    useEffect(() => {
      setComponentIdentifier(generateRandomString());
      if (!isBrowser) return null;
      const handleResize = () => setWindowSize([window.innerWidth, window.innerHeight]);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const componentName = useMemo(() => getComponentName(WrappedComponent), []);
    const classes = useMemo(() => classNames(className, componentIdentifier), [className]);
    const [minWidth, maxWidth] = useMemo(() => getDisplayWidth(displayFrom, displayTo), [
      displayFrom,
      displayTo,
    ]);

    if (!minWidth && !maxWidth) {
      if (isEnvDev) {
        console.warn(
          'Warning: Not optimal to use "withResponsive" without display boundaries',
          componentName ? `on "${componentName}"` : ''
        );
      }
      return <WrappedComponent {...componentProps} className={classes} />;
    }

    const WCMQ = (
      <MediaQuery
        Component={WrappedComponent}
        minWidth={minWidth}
        maxWidth={maxWidth}
        {...componentProps}
        className={classes}
      />
    );

    if (isBrowser) return !matchesMediaQuery(getInverseMediaQuery(minWidth, maxWidth)) && WCMQ;
    return WCMQ; // SSR
  }

  ResponsiveWrapper.propTypes = {
    displayFrom: PropTypes.oneOf(Object.keys(MEDIA_QUERY_BREAKPOINTS)),
    displayTo: PropTypes.oneOf(Object.keys(MEDIA_QUERY_BREAKPOINTS)),
  };

  ResponsiveWrapper.defaultProps = {
    displayFrom: undefined,
    displayTo: undefined,
  };

  return ResponsiveWrapper;
}
