import React from 'react'
import Head from 'next/head'
import { Main } from '@1hive/1hive-ui'
import { withRouter } from 'next/router'

import { AppProps } from 'next/app'

import { UserProvider } from '@/providers/User'
import { WalletProvider } from '@/providers/Wallet'
import { GardensProvider } from '@/providers/Gardens'
import { ProfileProvider } from '@/providers/Profile'

import GlobalErrorHandler from '@/GlobalErrorHandler'

import MainView from '@/components/MainView'
import WelcomeLoader from '@/components/Welcome/WelcomeLoader'

import { GlobalFontStyles } from '@/utils/global-styles'

const GardensApp = (props: AppProps): JSX.Element => {
  const { Component, pageProps } = props

  return (
    <>
      <Head>
        <title>Gardens</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <GlobalFontStyles />

      <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false}>
        <WalletProvider>
          <GlobalErrorHandler>
            <ProfileProvider>
              <UserProvider>
                <GardensProvider>
                  <WelcomeLoader />
                  <MainView>
                    <Component {...pageProps} />
                  </MainView>
                </GardensProvider>
              </UserProvider>
            </ProfileProvider>
          </GlobalErrorHandler>
        </WalletProvider>
      </Main>
    </>
  )
}

export default withRouter(GardensApp)
