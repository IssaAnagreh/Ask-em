import { LOGGED_IN } from './actionTypes';

export const loggedIn = (username) => {
    return {
        type: LOGGED_IN,
        username: username
    };
}