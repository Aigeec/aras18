/* eslint-disable-next-line no-unused-vars */
import { h } from 'preact'
import { Tweet } from '../tweet/tweet'
import './tweet-list.scss'

export const TweetList = ({ tweets }) => {
  const _tweets = tweets.map((tweet) => {
    return <Tweet tweet={tweet} />
  })
  return (
    <div className='tweetList__wrapper'><div>{_tweets}</div></div>
  )
}
