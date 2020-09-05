import { omit } from 'lodash';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { StateType } from '../reducer';
import * as storageShim from '../../shims/storage';
import { isShortName } from '../../components/emoji/lib';
import { useBoundActions } from '../../util/hooks';

// State

export type ItemsStateType = {
  readonly [key: string]: any;
};

// Actions

type ItemPutAction = {
  type: 'items/PUT';
  payload: null;
};

type ItemPutExternalAction = {
  type: 'items/PUT_EXTERNAL';
  payload: {
    key: string;
    value: any;
  };
};

type ItemRemoveAction = {
  type: 'items/REMOVE';
  payload: null;
};

type ItemRemoveExternalAction = {
  type: 'items/REMOVE_EXTERNAL';
  payload: string;
};

type ItemsResetAction = {
  type: 'items/RESET';
};

export type ItemsActionType =
  | ItemPutAction
  | ItemPutExternalAction
  | ItemRemoveAction
  | ItemRemoveExternalAction
  | ItemsResetAction;

// Action Creators

export const actions = {
  putItem,
  putItemExternal,
  removeItem,
  removeItemExternal,
  resetItems,
};

export const useActions = () => useBoundActions(actions);

function putItem(key: string, value: any): ItemPutAction {
  storageShim.put(key, value);

  return {
    type: 'items/PUT',
    payload: null,
  };
}

function putItemExternal(key: string, value: any): ItemPutExternalAction {
  return {
    type: 'items/PUT_EXTERNAL',
    payload: {
      key,
      value,
    },
  };
}

function removeItem(key: string): ItemRemoveAction {
  // tslint:disable-next-line no-floating-promises
  storageShim.remove(key);

  return {
    type: 'items/REMOVE',
    payload: null,
  };
}

function removeItemExternal(key: string): ItemRemoveExternalAction {
  return {
    type: 'items/REMOVE_EXTERNAL',
    payload: key,
  };
}

function resetItems(): ItemsResetAction {
  return { type: 'items/RESET' };
}

// Reducer

function getEmptyState(): ItemsStateType {
  return {};
}

export function reducer(
  state: ItemsStateType = getEmptyState(),
  action: ItemsActionType
): ItemsStateType {
  if (action.type === 'items/PUT_EXTERNAL') {
    const { payload } = action;

    return {
      ...state,
      [payload.key]: payload.value,
    };
  }

  if (action.type === 'items/REMOVE_EXTERNAL') {
    const { payload } = action;

    return omit(state, payload);
  }

  if (action.type === 'items/RESET') {
    return getEmptyState();
  }

  return state;
}

// Selectors

const selectRecentEmojis = createSelector(
  ({ emojis }: StateType) => emojis.recents,
  recents => recents.filter(isShortName)
);

export const useRecentEmojis = () => useSelector(selectRecentEmojis);
