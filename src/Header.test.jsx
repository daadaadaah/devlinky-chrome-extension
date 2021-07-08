import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { screen, render, fireEvent } from '@testing-library/react';

import useCurrentUser from './hooks/useCurrentUser';

import { setToggleMenu, resetToggleMenu } from './redux/slice';

import { currentUser, toggleMenu } from '../fixtures';

import Header from './Header';

jest.mock('./hooks/useCurrentUser');
jest.mock('react-redux');

describe('<Header />', () => {
  context('inital render', () => {
    useCurrentUser.mockImplementation(() => ({
      currentUser: null,
    }));

    it('shows logo', () => {
      render(<Header />);
      const logo = screen.getByAltText('devlinky-logo');
      expect(logo).toHaveAttribute('src', '../assets/images/logo-small.png');
    });
  });

  context('with currentUser', () => {
    useCurrentUser.mockImplementation(() => ({
      currentUser,
    }));

    it('shows user profile', () => {
      render(<Header />);

      const userProfile = screen.getByAltText('user-profile');

      expect(userProfile).toHaveAttribute('src', currentUser.githubProfile);
    });
  });

  context('when user click user profile', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        toggleMenu: false,
      }));
    });

    it('change toggleMenu', () => {
      const { getByAltText } = render(<Header />);

      fireEvent.click(getByAltText('user-profile'));

      expect(dispatch).toBeCalledWith(setToggleMenu(true));
    });
  });

  context('when user click logout button', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser,
      }));

      useDispatch.mockImplementation(() => dispatch);

      useSelector.mockImplementation((selector) => selector({
        toggleMenu,
      }));
    });

    it('change currentUser and toggleMenu', () => {
      const { getByText } = render(<Header />);

      fireEvent.click(getByText('Log out'));

      expect(dispatch).toBeCalledWith(resetToggleMenu());
      expect(dispatch).toBeCalledTimes(2);
    });
  });

  context('without currentUser', () => {
    beforeEach(() => {
      useCurrentUser.mockImplementation(() => ({
        currentUser: null,
      }));
    });

    it('do not show user profile', () => {
      render(<Header />);

      expect(screen.findByAltText('user-profile')).toBeDefined();
    });
  });
});
