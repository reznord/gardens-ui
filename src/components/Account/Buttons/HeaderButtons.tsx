import React, { useCallback } from 'react'
import {
  Button,
  IconConnect,
  IconCanvas,
  useTheme,
  DropDown,
} from '@1hive/1hive-ui'
import { SUPPORTED_CHAINS, switchNetwork } from '@/networks'

import AccountConnectedButton from './ConnectedButton'
import { useWallet } from '@/providers/Wallet'
import { getNetworkName } from '@/utils/web3-utils'
import styled from 'styled-components'

type WrongNetworkButton = {
  compact: any
  handleNetworkChange: (index: number) => void
}

const WrongNetworkButton = ({
  compact,
  handleNetworkChange,
}: WrongNetworkButton) => {
  const handleWrongNetworkChange = async () => {
    try {
      await switchNetwork(100)
    } catch (error) {
      handleNetworkChange(1)
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        gap: '8px',
      }}
    >
      <Button
        onClick={handleWrongNetworkChange}
        css={`
          overflow: hidden;
          box-shadow: none;
          padding-right: 0;
          padding-left: 0;
        `}
      >
        <div
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            paddingRight: '16px',
            paddingLeft: '16px',
          }}
        >
          <IconCanvas />
          Switch wallet to xDai
        </div>

        {!compact ? (
          <div
            css={`
              background-color: rgb(255, 104, 113);
              border: 1px solid rgb(255, 104, 113);
              color: #fff;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 24px 0 16px;
              width: 100%;
              height: 40px;
            `}
          >
            Wrong Network
          </div>
        ) : null}
      </Button>
    </div>
  )
}

type HeaderButtonProps = {
  screenId: string
  toggle: () => void
  compact: any
  isSupportedNetwork: boolean
}

const ProviderDropdown = styled(DropDown)`
  height: 30px;
  padding-left: 12px;
  border-radius: 6px;

  > svg {
    color: #000;
  }
`

const HeaderButtons = ({
  screenId,
  toggle,
  compact,
  isSupportedNetwork,
}: HeaderButtonProps) => {
  const theme = useTheme()
  const { preferredNetwork, onPreferredNetworkChange, onNetworkSwitch } =
    useWallet()

  const supportedChains = SUPPORTED_CHAINS.map((chain) => getNetworkName(chain))
  const selectedIndex = SUPPORTED_CHAINS.indexOf(preferredNetwork)

  const handleNetworkChange = useCallback(
    (index) => {
      onPreferredNetworkChange(SUPPORTED_CHAINS[index])
      onNetworkSwitch(SUPPORTED_CHAINS[index])
    },
    [onPreferredNetworkChange]
  )

  console.log(`HeaderButtons isSupportedNetwork`, isSupportedNetwork)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {screenId === 'connected' ? (
        <AccountConnectedButton onClick={toggle} />
      ) : isSupportedNetwork === false ? (
        <WrongNetworkButton
          compact={compact}
          handleNetworkChange={handleNetworkChange}
        />
      ) : (
        <Button
          icon={<IconConnect />}
          label="Enable account"
          onClick={toggle}
          display={compact ? 'icon' : 'all'}
        />
      )}

      {isSupportedNetwork ? (
        <ProviderDropdown
          items={supportedChains}
          onChange={handleNetworkChange}
          selected={selectedIndex}
          wide
          style={{
            background: theme.accent,
          }}
        />
      ) : null}
    </div>
  )
}

export default HeaderButtons
