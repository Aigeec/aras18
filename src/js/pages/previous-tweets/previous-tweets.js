/* eslint-disable-next-line no-unused-vars */
import { h } from 'preact'
import { TweetList } from '../../tweet-list/tweet-list'
import { Transition } from 'react-transition-group'

import './previous-tweets.scss'

const transitionStyles = {
  entering: 'hide',
  entered: 'show',
  exiting: 'hide',
  exited: 'hide'
}

export const PreviousTweets = ({ in: inProp, tweets }) => {
  return (
    <Transition in={inProp} timeout={300}>
      {state => {
        const mode = transitionStyles[state]
        return (
          <div class={`previous-tweets fade ${mode}`}>
            <h1 class='previous-tweets__title'>Recent Tweets</h1>
            <div class='previous-tweets__list'>
              <TweetList tweets={tweets} />
            </div>
          </div>
        )
      }}
    </Transition>
  )
}
