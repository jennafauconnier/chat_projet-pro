export const initialState = {
  token: undefined,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TOKEN': 
      return {
        ...state,
        token: action.payload.token,
      };
    default:
      return state;
  }
}

export default reducer;

// Je viens récuperer le state et je le modifie