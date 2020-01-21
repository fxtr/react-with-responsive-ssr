import { get, isFunction } from 'lodash';

export const isEnvDev =
  typeof process !== 'undefined' && get(process, 'env.NODE_ENV', 'development') === 'development';

export const getComponentName = component =>
  get(component, 'displayName', isFunction(component) ? component.name : '');
