import { LOGGED_IN } from '../actions/actionTypes';

const initialState = {
	username: ''
};

// in here you can add your function
const reducer = ( state = initialState, action ) => {
	switch (action.type) {
		case LOGGED_IN :
			return {
				...state,
				username: action.username
			};
		default:
			return state;
	}
};

export default reducer;