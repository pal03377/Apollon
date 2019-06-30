import { IUMLElementPort } from 'src/services/uml-element/uml-element-port';
import { AsyncAction } from '../../../utils/actions/actions';
import { Connection } from '../connection';
import { IUMLRelationship } from '../uml-relationship';
import {
  ReconnectableActionTypes,
  ReconnectAction,
  ReconnectEndAction,
  ReconnectStartAction,
} from './reconnectable-types';

export const Reconnectable = {
  startReconnecting: (endpoint: 'source' | 'target', id?: string | string[]): AsyncAction => (dispatch, getState) => {
    const ids = id ? (Array.isArray(id) ? id : [id]) : getState().selected;
    if (!ids.length) {
      return;
    }

    dispatch<ReconnectStartAction>({
      type: ReconnectableActionTypes.START,
      payload: { ids, endpoint },
    });
  },

  reconnect: (target: IUMLElementPort): AsyncAction => (dispatch, getState) => {
    const { reconnecting, elements } = getState();
    const connections = Object.keys(reconnecting).map(id => {
      const relationship = elements[id] as IUMLRelationship;
      const endpoint1: 'source' | 'target' = reconnecting[id];
      const endpoint2: 'source' | 'target' = endpoint1 === 'source' ? 'target' : 'source';
      const connection = {
        [endpoint1]: relationship[endpoint1],
        [endpoint2]: { ...relationship[endpoint2], ...target },
      };
      return { id, ...connection } as { id: string } & Connection;
    });

    if (!connections.length) {
      return;
    }

    dispatch<ReconnectAction>({
      type: ReconnectableActionTypes.RECONNECT,
      payload: { connections },
    });
  },

  endReconnecting: (id?: string | string[]): AsyncAction => (dispatch, getState) => {
    const ids = id ? (Array.isArray(id) ? id : [id]) : Object.keys(getState().reconnecting);
    if (!ids.length) {
      return;
    }

    dispatch<ReconnectEndAction>({
      type: ReconnectableActionTypes.END,
      payload: { ids },
    });
  },
};
