/* eslint-disable-next-line no-unused-vars */
import { h } from 'preact'
import { TweetList } from '../../tweet-list/tweet-list'
import { CSSTransition } from 'react-transition-group'

import './previous-tweets.scss'

export const PreviousTweets = ({ in: inProp, tweets }) => {
  return (
    <CSSTransition in={inProp} timeout={1000} classNames='fade'>
      <div class='previous-tweets'>
        <h1 class='previous-tweets__title'>Recent Tweets</h1>
        <div class='previous-tweets__list'>
          <TweetList tweets={tweets} />
        </div>
      </div>
    </CSSTransition>
  )
}
