import { IndividualStepTypes } from '../stepper-statuses'
import Divider from './Divider'
import StatusVisual from './StatusVisual'
import { TransactionBadge, textStyle, useTheme, GU } from '@1hive/1hive-ui'
import { getNetwork } from '@/networks'
import { springs } from '@/style/springs'
import { useDisableAnimation } from '@hooks/useDisableAnimation'
import { useWallet } from '@providers/Wallet'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { Transition, animated } from 'react-spring/renderprops.cjs'

const AnimatedSpan = animated.span

function Step({
  title,
  desc,
  status,
  number,
  transactionHash,
  showDivider,
  withoutFirstStep,
  ...props
}) {
  const theme = useTheme()
  const { chainId } = useWallet()
  const network = getNetwork(chainId)
  const [animationDisabled, enableAnimation] = useDisableAnimation()

  const { visualColor, descColor } = useMemo(() => {
    const appearance = {
      [IndividualStepTypes.Waiting]: {
        visualColor: theme.accent,
        descColor: theme.contentSecondary,
      },
      [IndividualStepTypes.Prompting]: {
        visualColor: '#7CE0D6',
        descColor: theme.contentSecondary,
      },
      [IndividualStepTypes.Working]: {
        visualColor: '#FFE862',
        descColor: '#C3A22B',
      },
      [IndividualStepTypes.Success]: {
        visualColor: theme.positive,
        descColor: theme.positive,
      },
      [IndividualStepTypes.Error]: {
        visualColor: theme.negative,
        descColor: theme.negative,
      },
    }

    const { descColor, visualColor } = appearance[status]
    return {
      visualColor: `${visualColor}`,
      descColor: `${descColor}`,
    }
  }, [status, theme])

  return (
    <>
      <div
        css={`
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;

          width: ${31 * GU}px;
        `}
        {...props}
      >
        <StatusVisual
          status={status}
          color={visualColor}
          number={number}
          css={`
            margin-bottom: ${3 * GU}px;
          `}
          withoutFirstStep={withoutFirstStep}
        />
        <h2
          css={`
            ${textStyle('title4')}
            height:${6 * GU}px;
            line-height: 1.2;
            text-align: center;
            margin-bottom: ${1 * GU}px;
          `}
        >
          {status === IndividualStepTypes.Error ? 'Transaction failed' : title}
        </h2>

        <p
          css={`
            width: 100%;
            position: relative;
            text-align: center;
            color: ${theme.contentSecondary};
            line-height: 1.2;
          `}
        >
          <Transition
            config={springs.gentle}
            items={[{ currentDesc: desc, currentColor: descColor }]}
            keys={desc} // Only animate when the description changes
            onStart={enableAnimation}
            immediate={animationDisabled}
            from={{
              opacity: 0,
              transform: `translate3d(0, ${2 * GU}px, 0)`,
            }}
            enter={{
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
            }}
            leave={{
              position: 'absolute',
              opacity: 0,
              transform: `translate3d(0, -${2 * GU}px, 0)`,
            }}
            native
          >
            {(item) =>
              item &&
              ((transitionProps) => (
                <AnimatedSpan
                  css={`
                    display: flex;
                    justify-content: center;
                    left: 0;
                    top: 0;
                    width: 100%;
                    color: ${item.currentColor};
                  `}
                  style={transitionProps}
                >
                  {item.currentDesc}
                </AnimatedSpan>
              ))
            }
          </Transition>
        </p>

        <div
          css={`
            margin-top: ${1.5 * GU}px;
            position: relative;
            width: 100%;
          `}
        >
          <Transition
            config={springs.gentle}
            items={transactionHash}
            immediate={animationDisabled}
            from={{
              opacity: 0,
              transform: `translate3d(0, ${1 * GU}px, 0)`,
            }}
            enter={{
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
            }}
            leave={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              opacity: 0,
            }}
            native
          >
            {(currentHash) => (transitionProps) =>
              currentHash ? (
                <AnimatedSpan
                  style={transitionProps}
                  css={`
                    display: flex;
                    justify-content: center;
                    width: 100%;
                  `}
                >
                  <TransactionBadge
                    transaction={currentHash}
                    networkType={network.type}
                    explorerProvider={network.explorer}
                  />
                </AnimatedSpan>
              ) : null}
          </Transition>
        </div>

        {showDivider && (
          <Divider
            color={visualColor}
            css={`
              position: absolute;
              top: ${6 * GU}px;
              right: 0;

              transform: translateX(50%);
            `}
          />
        )}
      </div>
    </>
  )
}

Step.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  transactionHash: PropTypes.string,
  number: PropTypes.number,
  status: PropTypes.oneOf([
    IndividualStepTypes.Waiting,
    IndividualStepTypes.Prompting,
    IndividualStepTypes.Working,
    IndividualStepTypes.Success,
    IndividualStepTypes.Error,
  ]).isRequired,
  showDivider: PropTypes.bool,
}

export default Step
