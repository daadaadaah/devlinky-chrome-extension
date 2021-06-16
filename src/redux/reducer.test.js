import reducer, {
  setCurrentUser,
  setUrl,
  setPreview,
} from './slice';

import { currentUser, devlink } from '../../fixtures';

describe('reducer', () => {
  context('when previous state is undefined', () => {
    const initialState = {
      currentUser: null,
      url: null,
      preview: null,
    };

    it('returns initialState', () => {
      const state = reducer(undefined, { type: 'action' });

      expect(state).toEqual(initialState);
    });
  });

  describe('setCurrentUser', () => {
    it('set currentUser', () => {
      const initialState = {
        currentUser: null,
      };

      const state = reducer(initialState, setCurrentUser(currentUser));

      expect(state.currentUser).toStrictEqual(currentUser);
    });
  });

  describe('setUrl', () => {
    it('set url', () => {
      const initialState = {
        currentUser: null,
        url: null,
      };

      const state = reducer(initialState, setUrl(devlink.url));

      expect(state.url).toStrictEqual(devlink.url);
    });
  });

  describe('setPreview', () => {
    it('set Preview', () => {
      const initialState = {
        currentUser: null,
        url: null,
        preview: null,
      };

      const preview = {
        url: devlink.url,
        title: devlink.title,
        thumbnail: devlink.thumbnail,
      };

      const state = reducer(initialState, setPreview(preview));

      expect(state.preview).toStrictEqual(preview);
    });
  });
});
