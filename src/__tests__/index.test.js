import React from 'react';
import { render } from '@testing-library/react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withResponsive, { setMediaQueryBreakpoints } from '../index';

jest.mock('../util', () => ({
  ...jest.requireActual('../util'),
  generateRandomString: jest.fn().mockReturnValue('randomstring'),
}));

const TestComponent = ({ children, className, ...props }) => (
  <div className={classNames('test-component', className)} {...props}>
    {children}
  </div>
);

TestComponent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

TestComponent.defaultProps = {
  className: '',
};

describe('renders with default breakpoints', () => {
  it('with props', () => {
    const ResponsiveComponent = withResponsive(TestComponent);
    const comps = {
      'from-sm': render(<ResponsiveComponent displayFrom="sm">From sm</ResponsiveComponent>),
      'to-lg': render(<ResponsiveComponent displayTo="lg">To lg</ResponsiveComponent>),
      'from-md-to-xl': render(
        <ResponsiveComponent displayFrom="md" displayTo="xl">
          From md - To xl
        </ResponsiveComponent>
      ),
    };
    Object.keys(comps).forEach(k => {
      const {
        container: { firstChild },
      } = comps[k];
      expect(firstChild).toMatchSnapshot(`default-breakpoints:${k}`);
    });
  });

  it('with inline props', () => {
    const FromSM = withResponsive(TestComponent, { displayFrom: 'sm' });
    const ToLG = withResponsive(TestComponent, { displayTo: 'lg' });
    const FromMDToXL = withResponsive(TestComponent, { displayFrom: 'md', displayTo: 'xl' });
    const comps = {
      'from-sm': render(<FromSM>From sm</FromSM>),
      'to-lg': render(<ToLG>To lg</ToLG>),
      'from-md-to-xl': render(<FromMDToXL>From md - To xl</FromMDToXL>),
    };
    Object.keys(comps).forEach(k => {
      const {
        container: { firstChild },
      } = comps[k];
      expect(firstChild).toMatchSnapshot(`default-breakpoints:${k}`);
    });
  });
});

describe('renders with custom breakpoints', () => {
  beforeAll(() =>
    setMediaQueryBreakpoints({
      mobile: 0,
      tablet: 1024,
      desktop: 1440,
    })
  );

  it('with props', () => {
    const ResponsiveComponent = withResponsive(TestComponent);
    const comps = {
      'from-mobile': render(<ResponsiveComponent displayFrom="mobile">From mobile</ResponsiveComponent>),
      'to-desktop': render(<ResponsiveComponent displayTo="desktop">To desktop</ResponsiveComponent>),
      'from-tablet-to-desktop': render(
        <ResponsiveComponent displayFrom="tablet" displayTo="desktop">
          From tablet - To desktop
        </ResponsiveComponent>
      ),
    };
    Object.keys(comps).forEach(k => {
      const {
        container: { firstChild },
      } = comps[k];
      expect(firstChild).toMatchSnapshot(`custom-breakpoints:${k}`);
    });
  });

  it('with inline props', () => {
    const FromMobile = withResponsive(TestComponent, { displayFrom: 'mobile' });
    const ToDesktop = withResponsive(TestComponent, { displayTo: 'desktop' });
    const FromTabletToDesktop = withResponsive(TestComponent, {
      displayFrom: 'tablet',
      displayTo: 'desktop',
    });
    const comps = {
      'from-mobile': render(<FromMobile>From mobile</FromMobile>),
      'to-desktop': render(<ToDesktop>To desktop</ToDesktop>),
      'from-tablet-to-desktop': render(<FromTabletToDesktop>From tablet - To desktop</FromTabletToDesktop>),
    };
    Object.keys(comps).forEach(k => {
      const {
        container: { firstChild },
      } = comps[k];
      expect(firstChild).toMatchSnapshot(`default-breakpoints:${k}`);
    });
  });
});
