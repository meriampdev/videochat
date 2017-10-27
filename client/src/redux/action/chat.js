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

export const SendFile = (file) => {
  return {
    type: 'server/sendfile',
    data: file
  }
}

export const CueVideo = (url) => {
  return {
    type: 'server/CueVideo',
    data: url
  }
}

export const VideoStateChange = (state) => {
  return {
    type: 'server/VideoStateChange',
    data: state
  }
}