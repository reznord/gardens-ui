import React, { useCallback, useEffect, useState } from 'react'
import { GU } from '@1hive/1hive-ui'
import WelcomeModal from './WelcomeModal'

function WelcomeLoader() {
  const [welcomeClosed, setWelcomeClosed] = useState(false)

  useEffect(() => {
    setWelcomeClosed(localStorage.getItem('welcomeClosed') === 'true')
  }, [])

  const handleOnOpen = useCallback(() => {
    setWelcomeClosed(false)
  }, [])

  const handleOnClose = useCallback(() => {
    localStorage.setItem('welcomeClosed', 'true')
    setWelcomeClosed(true)
  }, [])

  return (
    <React.Fragment>
      <WelcomeModal onClose={handleOnClose} visible={!welcomeClosed} />
      <img
        css={`
          display: flex;
          position: absolute;
          bottom: 0;
          right: 0;
          z-index: 2;
          margin: ${3 * GU}px;
          cursor: pointer;
        `}
        src={'/icons/base/InfoButton.svg'}
        onClick={handleOnOpen}
      />
    </React.Fragment>
  )
}

export default WelcomeLoader
