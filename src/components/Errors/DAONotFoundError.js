import React from 'react'
import { useRouter } from 'next/router'
import { Button, GU, textStyle, useTheme } from '@1hive/1hive-ui'
import { getNetworkName } from '../../utils/web3-utils'

function DAONotFoundError({ chainId, daoId }) {
  const theme = useTheme()
  const router = useRouter()

  return (
    <React.Fragment>
      <h1
        css={`
          color: ${theme.surfaceContent};
          ${textStyle('title2')};
          margin-bottom: ${1.5 * GU}px;
          text-align: center;
        `}
      >
        Garden not found
      </h1>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
          text-align: center;
          color: ${theme.surfaceContentSecondary};
          ${textStyle('body2')};
        `}
      >
        It looks like there’s no garden associated with{' '}
        {<span css="font-weight: bold;">“{daoId}”</span>} on the{' '}
        {getNetworkName(chainId)} network
      </div>
      <Button
        mode="strong"
        onClick={() => router.push('/home')}
        wide
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        Go back
      </Button>
    </React.Fragment>
  )
}

export default DAONotFoundError
