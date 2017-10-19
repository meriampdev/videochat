export const SendMessage = (message) => {
  return {
    type: 'server/hello',
    data: message
  }
}

export const VideoChat = (args) => {
  return {
    type: 'server/videochat',
    data: args
  }
}

export const GetIniatorSignal = () => {
  return {
    type: 'server/GetIniatorSignal'
  }
}