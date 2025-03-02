import React from 'react'
import PropTypes from 'prop-types'
import { keyframes } from 'styled-components'
import { getProviderFromUseWalletId } from 'use-wallet'
import { GU, useTheme, textStyle, Link } from '@1hive/1hive-ui'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const AccountModuleConnectingScreen = React.memo(function ({
  onCancel,
  providerId,
}) {
  const theme = useTheme()
  const provider = getProviderFromUseWalletId(providerId)
  return (
    <section
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: ${2 * GU}px;
        height: 100%;
      `}
    >
      <div
        css={`
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        `}
      >
        <div
          css={`
            position: relative;
            width: ${10.5 * GU}px;
            height: ${10.5 * GU}px;
          `}
        >
          <div
            css={`
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('/icons/base/loading-ring.svg') no-repeat 0 0;
              animation-duration: 1s;
              animation-iteration-count: infinite;
              animation-timing-function: linear;
              animation-name: ${spin};
              // prevents flickering on Firefox
              backface-visibility: hidden;
            `}
          />
          <div
            css={`
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: 50% 50% / auto ${5 * GU}px no-repeat
                url(${provider.image});
            `}
          />
        </div>
        <h1
          css={`
            padding-top: ${2 * GU}px;
            ${textStyle('body1')};
            font-weight: 600;
          `}
        >
          Connecting to {provider.name}
        </h1>
        <p
          css={`
            width: ${36 * GU}px;
            color: ${theme.surfaceContentSecondary};
          `}
        >
          Log into {provider.name || 'Unknown'}. You may be temporarily
          redirected to a new screen.
        </p>
      </div>
      <div
        css={`
          flex-grow: 0;
        `}
      >
        <Link onClick={onCancel}>Cancel</Link>
      </div>
    </section>
  )
})

AccountModuleConnectingScreen.propTypes = {
  providerId: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
}

export default AccountModuleConnectingScreen
