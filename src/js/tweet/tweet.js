/* eslint-disable-next-line no-unused-vars */
import { h } from 'preact'

import { sanitize } from 'dompurify'
import timeago from 'timeago.js'
import { Transition } from 'react-transition-group'
import './tweet.scss'

function getTweetContent (tweet) {
  return { __html: sanitize(tweet) }
}

export const Tweet = ({ tweet }) => {
  if (!tweet) {
    return (
      <div id='content'>
        <p>Coming soon to analyse tweets on the upcoming Irish Presidential Election 2018.</p>
        <p>(If there is one)</p>
      </div>)
  }
  return (
    <Transition in timeout={50}>
      <div class='tweet'>
        <div class='tweet__background' />
        <div class='tweet__author__image'><img src={tweet.userProfilePic} /></div>
        <div class='tweet__body'>
          <div class='tweet__header'>
            <span class='author'>
              <a href={`https://twitter.com/${tweet.username}`}>{tweet.displayName}</a>
            </span>
            <span class='created-at' title={tweet.created_at}>{timeago().format(tweet.created_at)}</span>
          </div>
          <div class='tweet__content' dangerouslySetInnerHTML={getTweetContent(tweet.text)} />
          <div class='sentiment'>{tweet.sentiment}</div>
        </div>
      </div>
    </Transition>
  )
}
