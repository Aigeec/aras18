/* eslint-disable-next-line no-unused-vars */
import { h } from 'preact'
import { Tweet } from '../../tweet/tweet'
import { Transition } from 'react-transition-group'
import './home.scss'

const transitionStyles = {
  entering: 'hide',
  entered: 'show',
  exiting: 'hide',
  exited: 'hide'
}

export const Home = ({ in: inProp, tweet }) => {
  return (
    <Transition in={inProp} timeout={300}>
      {state => {
        const mode = transitionStyles[state]
        return (
          <div class={`home fade ${mode}`}>
            <h1 class='home__title'>#ARAS18</h1>
            <div class='home__tweet'>
              <Tweet tweet={tweet} />
            </div>
          </div>
        )
      }}
    </Transition>
  )
}
