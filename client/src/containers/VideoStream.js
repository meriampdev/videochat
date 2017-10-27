/*eslint-disable no-undef*/
import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Peer from 'simple-peer'
// import ReactFileReader from 'react-file-reader'
import MediaElement from './MediaElement'
import YouTubeIframe from 'youtube-iframe'
import {
  SendMessage,
  VideoChat,
  GetIniatorSignal,
  SendFile,
  CueVideo,
  VideoStateChange
} from '../redux/action/chat'

// const UNSTARTED = -1
// const ENDED = 0
const PLAYING = 1
const PAUSED = 2
const BUFFERING = 3
// const QUEUED = 4

class App extends Component {
  constructor(props) {
    super(props)

    this.StreamVideo = this.StreamVideo.bind(this)
    this.myStream = null
    this.video_source = null
    this.PlayerStateChange = this.PlayerStateChange.bind(this)
    this.state = {
      videoStreamStarted: false,
      url: '',
      queue: []
    }
    this.player = null
  }

  componentDidMount() {
    // const self = this
    // YouTubeIframe.load(function(YT) {
    //   console.log('api ready')
    //   self.player = new YT.Player('player1', {
    //     width: 600,
    //     height: 400,
    //     playerVars: {
    //       color: 'white'
    //     },
    //     events: {
    //       onStateChange: self.PlayerStateChange
    //     }
    //   })
    // })
  }

  componentWillReceiveProps(nextProps) {
    if (this.video_chatting) {
      // const self = this
      const { peerVidStream } = nextProps.chatty
      if (peerVidStream) {
        this.myStream.signal(peerVidStream)
      }
    }

    const { chatty } = nextProps
    console.log('receive props', chatty)
    console.log(this.player)
    if (chatty.video_state && this.api_ready) {
      switch(chatty.video_state) {
        case PLAYING:
          this.player.playVideo()
          break
        case PAUSED:
          this.player.pauseVideo()
          break
        case BUFFERING:
          this.player.playVideo()
          break
        default:
          break
      }
    }

    if(chatty.URL && !this.initialized) {
      this.initializeYT(chatty.URL)
      this.initialize = false
    }
  }

  initializeYT(url) {
    const self = this
    let videoId = ''
    if (url.includes('v=')) {
      const splitURL = url.split('v=')
      videoId = splitURL[1]
    } else {
      const splitURL = url.split('be/')
      videoId = splitURL[1]
    }
    YouTubeIframe.load(function(YT) {
      console.log('api ready')
      self.api_ready = true
      // self.setState({ player: true })
      self.player = new YT.Player('player1', {
        width: 600,
        height: 400,
        videoId: videoId,
        playerVars: {
          color: 'white'
        },
        events: {
          onStateChange: self.PlayerStateChange
        }
      })
      self.initialized = true
    })
  }

  PlayerStateChange(event) {
    console.log('PlayerStateChange', event)
    const { VideoStateChange } = this.props
    VideoStateChange(event.data)
  }

  StreamVideo(stream) {
    console.log('StreamVideo', stream)
    const { VideoChat, GetIniatorSignal } = this.props
    const initiator =  window.location.hash === '#init'
    console.log('initiator', initiator)
    const peer = new Peer({
      initiator: initiator,
      trickle: false,
      stream: stream,
    })

    this.video_chatting = true
    this.myStream = peer
    if (!initiator) {
      this.GetIniatorSignal = true
      GetIniatorSignal()
    }
    peer.on('signal', function(data) {
      console.log('signal')
      VideoChat({ initiator, signal: data})
    })

    peer.on('stream', function(peer_stream) {
      var video = document.createElement('video')
      console.log('streaming', video)
      video.src = window.URL.createObjectURL(peer_stream)
      video.play()
      document.getElementById('videohere').appendChild(video)
    })

  }

  handleFileChange(file) {
    const { SendFile } = this.props
    console.log(file)
    let reader = new FileReader();
    reader.onload = function(file) {
      // console.log('file loaded', reader.result)
    }
    SendFile(file[0].name)
    reader.readAsDataURL(file[0])
  }

  handleTextChange(e) {
    this.setState({ url: e.target.value })
  }

  cueVideo(e) {
    const { CueVideo } = this.props
    let { url, queue } = this.state
    queue = queue.concat(url)
    this.setState({ queue, url: '' })
    CueVideo(url)
    this.initialize = true
  }

  render() {
    const { url } = this.state
    const { chatty } = this.props
    console.log('videoStreamStarted', chatty)
    const sources = [{ src: chatty.URL, type: 'video/youtube' }]
    const config = {}, tracks = {}
    console.log('PLAYER', this.player)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Video Chat</h1>
        </header>
        <div className="App-intro">
          {
            // <button className='btn btn-info' onClick={this.StartVideoChat}>
            //   Start Video Chat
            // </button>
          }
          {
            // <ReactFileReader handleFiles={this.handleFileChange.bind(this)}>
            //   <button className='btn'>Upload File</button>
            // </ReactFileReader>
          }
          <input
            type='tex'
            className='form-control'
            onChange={this.handleTextChange.bind(this)}
            value={url}
          />
          <button className='btn btn-info' onClick={this.cueVideo.bind(this)}>
            Add Video to Cue
          </button>
          {
            chatty.URL ? 
              <MediaElement
                 id="player1"
                 mediaType="video"
                 preload="none"
                 controls
                 width="640"
                 height="360"
                 poster=""
                 sources={JSON.stringify(sources)}
                 options={JSON.stringify(config)}
                 tracks={JSON.stringify(tracks)}
              />
            : null 
          }
          <div id='videohere'>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  chatty: state.chat
})

const mapDispatchToProps = dispatch => bindActionCreators({
  SendMessage,
  VideoChat,
  GetIniatorSignal,
  SendFile,
  CueVideo,
  VideoStateChange
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
