import { get, isFunction } from 'lodash';

export const isBrowser =
  (typeof process !== 'undefined' && get(process, 'browser', false)) || typeof window !== 'undefined';

export const isEnvDev =
  typeof process !== 'undefined' && get(process, 'env.NODE_ENV', 'development') === 'development';

export const getComponentName = component =>
  get(component, 'displayName', isFunction(component) ? component.name : '');

export const generateRandomString = () =>
  Math.random()
    .toString(36)
    .substring(2, 15);
