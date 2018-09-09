/* eslint-disable-next-line no-unused-vars */
import { h, Component } from 'preact'
import { CSSTransition } from 'react-transition-group'
import './top-ten-mentions.scss'

export class TopTenMentions extends Component {
  constructor () {
    super()
    this.state = { users: [] }
  }

  connect () {
    fetch('/api/top-ten-mentions')
      .then(response => response.json())
      .then(myJson => {
        this.setState(Object.assign({}, this.state, { users: myJson }))
      })
  }

  componentDidMount () {
    this.connect()
  }

  render ({ in: inProp }, { users }) {
    const _users = users.map(user => {
      return (
        <div class='top-ten-mentions__user'>
          <div class='top-ten-mentions__user__name'>
            <a href={`https://twitter.com/${user._id}`}>{user.name}</a>
          </div>
          <div class='top-ten-mentions__user__count'>{user.count}</div>
        </div>
      )
    })
    return (
      <CSSTransition in={inProp} timeout={1000} classNames='fade'>
        <div class='top-ten-mentions'>
          <h1 class='top-ten-mentions__title'>Top 10 Mentions</h1>
          <div class='top-ten-mentions__users'>
            <div class='top-ten-mentions__background' />
            {_users}
          </div>
        </div>
      </CSSTransition>
    )
  }
}
