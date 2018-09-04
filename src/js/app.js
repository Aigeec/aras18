/* eslint-disable-next-line no-unused-vars */
import { h, Component } from 'preact'
import { Home } from './pages/home/home'
import { PreviousTweets } from './pages/previous-tweets/previous-tweets'
import { Router } from 'preact-router'
import { Link } from 'preact-router/match'
import './app.scss'

let wsUrl = 'ws://WEB_SOCKET_URL'
if (window.location.protocol === 'https:') {
  wsUrl = wsUrl.replace('ws://', 'wss://')
}

const HOME = '/'
const RECENT_TWEETS = '/recent-tweets'

export default class App extends Component {
  constructor () {
    super()
    this.state = { tweets: [], routesState: { home: false, previousTweets: false } }
  }

  connect () {
    var socket = new WebSocket(wsUrl)

    socket.onmessage = (event) => {
      const tweet = JSON.parse(event.data)
      if (!tweet.retweeted) {
        this.setState(Object.assign({}, this.state, { tweets: [JSON.parse(event.data)].concat(this.state.tweets).slice(0, 20) }))
      }
    }

    socket.onclose = (e) => {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason)
      setTimeout(this.connect, 1000)
    }

    socket.onerror = (err) => {
      console.error('Socket encountered error: ', err.message, 'Closing socket')
      socket.close()
    }
  }

  componentDidMount () {
    this.connect()
  }

  handleRoute (e) {
    setTimeout(() => {
      switch (e.url) {
        case RECENT_TWEETS:
          this.setState(Object.assign({}, this.state, { routesState: { home: false, previousTweets: true } }))
          break
        default:
          this.setState(Object.assign({}, this.state, { routesState: { home: true, previousTweets: false } }))
      }
    })
  }

  render (props, { tweets, routesState }) {
    return (
      <div class='page'>
        <div class='header'>
          <div class='header__background' />
          <div class='nav'>
            <span class='title'>#ARAS 18</span>
            <Link activeClassName='active' class='link' href={HOME}>Home</Link>
            <Link activeClassName='active' class='link' href={RECENT_TWEETS}>Recent Tweets</Link>
          </div>
        </div>
        <div class='content'>
          <Router onChange={this.handleRoute.bind(this)}>
            <Home path={HOME} default in={routesState.home} tweet={tweets[0]} />
            <PreviousTweets path={RECENT_TWEETS} in={routesState.previousTweets} tweets={tweets.slice(1)} />
          </Router>
        </div>
      </div>
    )
  };
}
