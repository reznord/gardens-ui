import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router'
import {
  Button,
  ButtonBase,
  GU,
  Link,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
import AccountModule from '../Account/AccountModule'
import ActivityButton from '../Activity/ActivityButton'
import BalanceModule from '../BalanceModule'
import GlobalPreferencesButton from '../Garden/Preferences/GlobalPreferencesButton'
import Layout from '../Layout'
import { useGardens } from '@providers/Gardens'
import { useWallet } from '@providers/Wallet'
import { useAppTheme } from '@providers/AppTheme'

import { buildGardenPath } from '@utils/routing-utils'
import { getHoneyswapTradeTokenUrl } from '@/endpoints'
import { getNetwork } from '@/networks'

import defaultGardenLogo from '@assets/defaultGardenLogo.png'
import gardensLogo from '@assets/gardensLogoMark.svg'
import gardensLogoType from '@assets/gardensLogoType.svg'
import gardensLogoTypeDark from '@assets/dark-mode/gardensLogoTypeDark.svg'
import darkModeIconLight from '@assets/icon-dark-mode-light.svg'
import darkModeIconDark from '@assets/icon-dark-mode-dark.svg'

function Header({ onOpenPreferences }) {
  const theme = useTheme()
  const { account } = useWallet()
  const { below } = useViewport()
  const layoutSmall = below('medium')
  const network = getNetwork()
  const history = useHistory()
  const { connectedGarden } = useGardens()
  const AppTheme = useAppTheme()

  const { logo, logotype } = useMemo(() => {
    if (!connectedGarden) {
      return {
        logo: gardensLogo,
        logotype:
          AppTheme.appearance === 'light'
            ? gardensLogoType
            : gardensLogoTypeDark,
      }
    }

    return {
      logo: connectedGarden?.logo || defaultGardenLogo,
      logotype: connectedGarden?.logo_type || defaultGardenLogo,
    }
  }, [connectedGarden, AppTheme.appearance])

  const Logo = <img src={logo} height={layoutSmall ? 40 : 60} alt="" />
  const logoLink = `#${
    connectedGarden ? buildGardenPath(history.location, '') : '/home'
  }`

  const toggleDarkMode = useCallback(() => {
    AppTheme.toggleAppearance()
  }, [AppTheme])

  const showBalance = connectedGarden && account && !layoutSmall

  return (
    <header
      css={`
        position: relative;
        z-index: 1;
        background: ${theme.surface};
        box-shadow: rgba(0, 0, 0, 0.05) 0 2px 3px;
      `}
    >
      <Layout paddingBottom={0}>
        <div
          css={`
            height: ${8 * GU}px;
            margin: 0 ${3 * GU}px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <Link
              href={logoLink}
              external={false}
              css={`
                display: flex;
              `}
            >
              {layoutSmall ? (
                Logo
              ) : (
                <img src={logotype} height={connectedGarden ? 40 : 38} alt="" />
              )}
            </Link>
            {!below('medium') && (
              <nav
                css={`
                  display: flex;
                  align-items: center;
                  height: 100%;
                  margin-left: ${6.5 * GU}px;
                `}
              >
                {connectedGarden && <GardenNavItems garden={connectedGarden} />}
                {!connectedGarden && (
                  <Link
                    href={network.celesteUrl}
                    css={`
                      text-decoration: none;
                      color: ${theme.contentSecondary};
                    `}
                  >
                    Become a Keeper
                  </Link>
                )}
              </nav>
            )}
          </div>

          <div
            css={`
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              min-width: ${showBalance
                ? 42.5 * GU
                : layoutSmall
                ? 10 * GU
                : 29 * GU}px;
            `}
          >
            <AccountModule compact={layoutSmall} />

            {showBalance && (
              <>
                <div
                  css={`
                    width: 0.5px;
                    height: ${3.5 * GU}px;
                    border-left: 0.5px solid ${theme.border};
                  `}
                />
                <BalanceModule />
              </>
            )}
            <ButtonBase
              css={`
                width: ${3 * GU}px;
                height: ${3 * GU}px;
              `}
              onClick={toggleDarkMode}
            >
              <img
                css="width: 100%;"
                src={
                  AppTheme.appearance === 'light'
                    ? darkModeIconLight
                    : darkModeIconDark
                }
              />
            </ButtonBase>
            {connectedGarden && (
              <div
                css={`
                  display: flex;
                  height: 100%;
                  margin-left: ${2 * GU}px;
                `}
              >
                <GlobalPreferencesButton onOpen={onOpenPreferences} />
              </div>
            )}
            {account && (
              <div
                css={`
                  display: flex;
                  height: 100%;
                `}
              >
                <ActivityButton />
              </div>
            )}
          </div>
        </div>
      </Layout>
    </header>
  )
}

function GardenNavItems({ garden }) {
  const theme = useTheme()
  const history = useHistory()
  const token = garden.wrappableToken || garden.token
  const { connectedGarden } = useGardens()
  const forumURL = connectedGarden.forumURL

  const handleOnGoToCovenant = useCallback(() => {
    const path = buildGardenPath(history.location, 'covenant')
    history.push(path)
  }, [history])

  return (
    <>
      <Button label="Covenant" onClick={handleOnGoToCovenant} mode="strong" />
      <Link
        href={forumURL}
        css={`
          text-decoration: none;
          color: ${theme.contentSecondary};
          margin-left: ${4 * GU}px;
        `}
      >
        Forum
      </Link>
      <Link
        href={getHoneyswapTradeTokenUrl(token.id)}
        css={`
          text-decoration: none;
          color: ${theme.contentSecondary};
          margin-left: ${4 * GU}px;
        `}
      >
        Get {token.symbol}
      </Link>
      {garden?.wiki && (
        <Link
          href={garden.wiki}
          css={`
            text-decoration: none;
            color: ${theme.contentSecondary};
            margin-left: ${4 * GU}px;
          `}
        >
          Wiki
        </Link>
      )}
      <Link
        href="https://1hive.gitbook.io/gardens"
        css={`
          text-decoration: none;
          color: ${theme.contentSecondary};
          margin-left: ${4 * GU}px;
        `}
      >
        Gardens docs
      </Link>
    </>
  )
}

export default Header
