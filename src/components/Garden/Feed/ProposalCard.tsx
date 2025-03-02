import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { GU, useTheme, useViewport } from '@1hive/1hive-ui'

import { ProposalTypes } from '@/types'
import { ProposalType } from '@/types/app'
import { useProposalWithThreshold } from '@/hooks/useProposals'

import ProposalInfo from './ProposalInfo'
import ProposalFooter from './ProposalFooter'
import ProposalHeader from './ProposalHeader'

type CardProps = {
  loading?: boolean
  proposal: ProposalType
}

function ProposalCard({ proposal, ...props }: CardProps) {
  return proposal.type === ProposalTypes.Decision ? (
    <Card proposal={proposal} {...props} />
  ) : (
    <ConvictionProposalCard proposal={proposal} {...props} />
  )
}

function ConvictionProposalCard({ proposal, ...props }: CardProps) {
  const [proposalWithThreshold, loading] = useProposalWithThreshold(proposal)
  return <Card proposal={proposalWithThreshold} loading={loading} {...props} />
}

function Card({ loading = false, proposal }: CardProps) {
  const theme = useTheme()
  const router = useRouter()
  const query = router.query
  const { below } = useViewport()

  const handleSelectProposal = useCallback(() => {
    const entityPath =
      proposal.type === ProposalTypes.Decision ? 'vote' : 'proposal'

    router.push(
      `/${query.networkType}/garden/${query.gardenAddress}/${entityPath}/${proposal.number}`
    )
  }, [router, proposal.number, proposal.type])

  const handleViewProfile = useCallback(
    (proposalCreator) => {
      router.push(`/profile?account=${proposalCreator}`)
    },
    [router]
  )

  return (
    <div
      css={`
        border: 1px solid ${theme.border};
        background: ${theme.surface};
        margin-bottom: ${2 * GU}px;
        padding: ${3 * GU}px;
        border-radius: ${2 * GU}px;

        ${below('medium') &&
        `
          padding-left: ${2 * GU}px;
          padding-right: ${2 * GU}px;
          border-left: 0;
          border-right: 0;
          border-radius: 0;
        `}
      `}
    >
      <ProposalHeader
        proposal={proposal}
        onSelectProposal={handleSelectProposal}
        onViewProfile={handleViewProfile}
      />
      <ProposalInfo
        loading={loading}
        proposal={proposal}
        onSelectProposal={handleSelectProposal}
      />
      <ProposalFooter
        proposal={proposal}
        onSelectProposal={handleSelectProposal}
      />
    </div>
  )
}

export default React.memo(ProposalCard)
