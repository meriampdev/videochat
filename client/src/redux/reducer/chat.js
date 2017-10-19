let INITIAL_STATE = {
  message: [],
  myVidStream: null,
  peerVidStream: null
}
export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case 'message':
      return { ...state, message: state.message.concat(action.message) }
    case 'start_vidchat':
      return { ...state, myVidStream: action.data.signal }
    case 'GetIniatorSignal':
      return { ...state, peerVidStream: action.data.signal }
    case 'accept_vidchat':
      return { ...state, peerVidStream: action.data.signal }
    default:
      return state;
  }
}