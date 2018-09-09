/* eslint-disable-next-line no-unused-vars */
import { h } from 'preact'
import { Tweet } from '../../tweet/tweet'
import { CSSTransition } from 'react-transition-group'
import './home.scss'

export const Home = ({ in: inProp, tweet }) => {
  return (
    <CSSTransition in={inProp} timeout={1000} classNames='fade'>
      <div class={`home`}>
        <h1 class='home__title'>#ARAS18</h1>
        <div class='home__tweet'>
          <Tweet tweet={tweet} />
        </div>
      </div>
    </CSSTransition>
  )
}
