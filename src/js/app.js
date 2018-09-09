/* eslint-disable-next-line no-unused-vars */
import { h, Component } from 'preact'
import { Router } from 'preact-router'
import { Link } from 'preact-router/match'
import { TransitionGroup } from 'react-transition-group'

import './app.scss'
import { Home } from './pages/home/home'
import { PreviousTweets } from './pages/previous-tweets/previous-tweets'
import { TopTenMentions } from './pages/top-ten-mentions/top-ten-mentions'

let wsUrl = 'ws://WEB_SOCKET_URL'
if (window.location.protocol === 'https:') {
  wsUrl = wsUrl.replace('ws://', 'wss://')
}

const HOME = '/'
const RECENT_TWEETS = '/recent-tweets'
const TOP_TEN_MENTIONS = '/top-ten-mentions'

export default class App extends Component {
  constructor () {
    super()
    this.state = { tweets: [], show: false }
  }

  connect () {
    var socket = new WebSocket(wsUrl)

    socket.onmessage = event => {
      const tweet = JSON.parse(event.data)
      if (!tweet.retweeted) {
        this.setState(
          Object.assign({}, this.state, {
            tweets: [tweet].concat(this.state.tweets).slice(0, 20)
          })
        )
      }
    }

    socket.onclose = e => {
      console.log(
        'Socket is closed. Reconnect will be attempted in 1 second.',
        e.reason
      )
      setTimeout(this.connect, 1000)
    }

    socket.onerror = err => {
      console.error('Socket encountered error: ', err.message, 'Closing socket')
      socket.close()
    }
  }

  getRecentTweets () {
    fetch('/api/recent-tweets')
      .then(response => response.json())
      .then(myJson => {
        this.setState(Object.assign({}, this.state, { tweets: myJson }))
      })
  }

  componentDidMount () {
    this.connect()
    this.getRecentTweets()
    this.setState(Object.assign({}, this.state, { show: true }))
  }

  render (props, { tweets, show }) {
    return (
      <div class='page'>
        <div class='header'>
          <div class='header__background' />
          <div class='nav'>
            <span class='title'>#ARAS 18</span>
            <Link activeClassName='active' class='link' href={HOME}>
              Home
            </Link>
            <Link activeClassName='active' class='link' href={RECENT_TWEETS}>
              Recent Tweets
            </Link>
            <Link activeClassName='active' class='link' href={TOP_TEN_MENTIONS}>
              Top Ten Mentions
            </Link>
          </div>
        </div>
        <div class='content'>
          <TransitionGroup>
            <Router>
              <Home path={HOME} in={show} default tweet={tweets[0]} />
              <PreviousTweets
                path={RECENT_TWEETS}
                in={show}
                tweets={tweets.slice(1)}
              />
              <TopTenMentions path={TOP_TEN_MENTIONS} in={show} />
            </Router>
          </TransitionGroup>
        </div>
      </div>
    )
  }
}
