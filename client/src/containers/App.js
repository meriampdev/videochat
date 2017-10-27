/*eslint-disable no-undef*/
import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Peer from 'simple-peer'
import {
  SendMessage,
  VideoChat,
  GetIniatorSignal
} from '../redux/action/chat'

class App extends Component {
  constructor(props) {
    super(props)

    this.StartVideoChat = this.StartVideoChat.bind(this)
    this.StreamVideo = this.StreamVideo.bind(this)
    this.myStream = null
    this.video_source = null
    this.state = {
      videoStreamStarted: false
    }
  }

  componentDidMount() {
    this.StartVideoChat()
  }

  componentWillReceiveProps(nextProps) {
    if (this.video_chatting) {
      // const self = this
      const { peerVidStream } = nextProps.chatty
      console.log('peerVidStream', peerVidStream)
      console.log('myStream', this.myStream)
      if (peerVidStream) {
        this.myStream.signal(peerVidStream)
        // this.myStream.on('signal', function (data) {
        //   peerVidStream.signal(data)
        // })
       
        // peerVidStream.on('signal', function (data) {
        //   this.myStream.signal(data)
        // })

        // this.myStream.on('stream', function (peer_stream) {
        //   // got remote video stream, now let's show it in a video tag 
        //   self.video_source = peer_stream
        //   console.log('streaming')
        //   self.setState({ videoStreamStarted: true })
        // })
        // peerVidStream.on('stream', function (peer_stream) {
        //   // got remote video stream, now let's show it in a video tag 
        //   self.video_source = peer_stream
        //   console.log('streaming')
        //   self.setState({ videoStreamStarted: true })
        // })
      }
    }
  }

  StartVideoChat() {
    const self = this
    if (window.navigator && window.navigator.mediaDevices) {
      window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      }).then((stream)=>{
        self.StreamVideo(stream)
      }).catch(e => console.error('UserMedia Error', e))
      console.log('UserMedia Supported')
    } else {
      console.log('navigator not Supported')
    }
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
      // let video_source = window.URL.createObjectURL(peer_stream)
      var video = document.createElement('video')
      console.log('streaming', video)
      video.src = window.URL.createObjectURL(peer_stream)
      video.play()
      document.getElementById('videohere').appendChild(video)
    })
    // console.log('peer', )
    // var myVidStream = new Peer({ initiator: initiator, stream: stream })
    // var peer2 = new Peer({ stream: stream })
   
    // peer1.on('signal', function (data) {
    //   peer2.signal(data)
    // })
   
    // peer2.on('signal', function (data) {
    //   peer1.signal(data)
    // })

    // if (!initiator) {
    //   peer1.on('stream', function (peer_stream) {
    //     // got remote video stream, now let's show it in a video tag 
    //     self.video_source = peer_stream
    //     console.log('streaming')
    //     self.setState({ videoStreamStarted: true })
    //   })
    // } else {
    //   peer2.on('stream', function (peer_stream) {
    //     // got remote video stream, now let's show it in a video tag 
    //     self.video_source = peer_stream
    //     console.log('streaming')
    //     self.setState({ videoStreamStarted: true })
    //   })
    // }
  }

  render() {
    const { videoStreamStarted } = this.state
    // const { chatty } = this.props
    console.log('videoStreamStarted', videoStreamStarted)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Video Chat</h1>
        </header>
        <p className="App-intro">
          {
            // <button className='btn btn-info' onClick={this.StartVideoChat}>
            //   Start Video Chat
            // </button>
          }
          <div id='videohere'>
          </div>
        </p>
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
  GetIniatorSignal
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
