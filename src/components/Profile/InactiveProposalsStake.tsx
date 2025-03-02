import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Box, GU, textStyle, useTheme, useViewport } from '@1hive/1hive-ui'

import { useWallet } from '@/providers/Wallet'
import { formatTokenAmount } from '@utils/token-utils'
import { getNetworkType } from '@/utils/web3-utils'
import { InactiveStake } from './types'

type InactiveProposalsStakeProps = {
  myInactiveStakes: Array<InactiveStake>
}

function InactiveProposalsStake({
  myInactiveStakes,
}: InactiveProposalsStakeProps) {
  const { below } = useViewport()
  const { preferredNetwork } = useWallet()
  const compact = below('large')
  const router = useRouter()

  const handleSelectProposal = useCallback(
    (gardenId, proposalId) => {
      router.push(
        `/${getNetworkType(
          preferredNetwork
        )}/garden/${gardenId}/proposal/${proposalId}`
      )
    },
    [router]
  )
  return (
    <Box heading="Inactive proposals stake" padding={3 * GU}>
      {myInactiveStakes.map((stake, index) => {
        return (
          <div
            key={index}
            css={`
              display: flex;
              align-items: center;
              margin-bottom: ${1 * GU}px;
            `}
          >
            <ProposalItem
              amount={stake.amount}
              gardenId={stake.proposal.organization.id}
              proposalId={stake.proposal.id}
              proposalName={stake.proposal.metadata}
              compact={compact}
              selectProposal={handleSelectProposal}
            />
          </div>
        )
      })}
    </Box>
  )
}

type ProposalItemProps = {
  amount: any
  gardenId: string
  proposalId: string
  proposalName: string
  compact: any
  selectProposal: (gardenId: string, proposalId: string) => void
}

const ProposalItem = ({
  amount,
  compact,
  gardenId,
  proposalId,
  proposalName,
  selectProposal,
}: ProposalItemProps) => {
  const theme = useTheme()

  return (
    <>
      <div
        css={`
          width: ${1 * GU}px;
          height: ${1 * GU}px;
          border-radius: 50%;
          background: ${theme.disabled};
          margin-right: ${1 * GU}px;
          flex-shrink: 0;
        `}
      />
      <div
        css={`
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          ${textStyle('body2')};
        `}
      >
        <div
          css={`
            background: ${theme.badge};
            border-radius: 3px;
            padding: ${0.5 * GU}px ${1 * GU}px;
            width: ${compact ? '100%' : `${18 * GU}px`};
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;

            ${proposalId &&
            `cursor: pointer; &:hover {
            background: ${theme.badge.alpha(0.7)}
          }`}
          `}
          onClick={() => proposalId && selectProposal(gardenId, proposalId)}
        >
          {proposalName}
        </div>
        <span
          css={`
            margin-left: ${1 * GU}px;
          `}
        >
          {formatTokenAmount(amount, 18)}
        </span>
      </div>
    </>
  )
}

export default InactiveProposalsStake
