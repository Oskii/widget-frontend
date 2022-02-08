import { AlertTriangle, ArrowUpCircle, CheckCircle } from 'react-feather'
import { ChainId, Currency } from '@sushiswap/sdk'
import React, { FC } from 'react'
import { Trans, t } from '@lingui/macro'

import Button from '../../components/Button'
import CloseIcon from '../../components/CloseIcon'
import ExternalLink from '../../components/ExternalLink'
import Image from '../../components/Image'
import Lottie from 'lottie-react'
import Modal from '../../components/Modal'
import ModalHeader from '../../components/ModalHeader'
import { RowFixed } from '../../components/Row'
import { getExplorerLink } from '../../functions/explorer'
import loadingRollingCircle from '../../animation/loading-rolling-circle.json'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import useAddTokenToMetaMask from '../../hooks/useAddTokenToMetaMask'
import { useLingui } from '@lingui/react'

interface ConfirmationPendingContentProps {
  onDismiss: () => void
  pendingText: string
  pendingText2: string
}

export const ConfirmationPendingContent: FC<ConfirmationPendingContentProps> = ({
  onDismiss,
  pendingText,
  pendingText2,
}) => {
  const { i18n } = useLingui()
  return (
    <div>
      <div className="flex justify-end">
        <CloseIcon onClick={onDismiss} />
      </div>
      <div className="w-24 pb-4 m-auto">
        <Lottie animationData={loadingRollingCircle} autoplay loop />
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="text-xl font-bold text-high-emphesis">{`Waiting for Confirmation`}</div>
        <div className="font-bold">{pendingText}</div>
        <div className="font-bold">{pendingText2}</div>
        <div className="text-sm font-bold text-secondary">{`Confirm this transaction in your wallet`}</div>
      </div>
    </div>
  )
}

interface TransactionSubmittedContentProps {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
  inline?: boolean // not in modal
}

export const TransactionSubmittedContent: FC<TransactionSubmittedContentProps> = ({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}) => {
  const { i18n } = useLingui()
  const { library } = useActiveWeb3React()
  const { addToken, success } = useAddTokenToMetaMask(currencyToAdd)
  return (
    <div>
      <div className="flex justify-end">
        <CloseIcon onClick={onDismiss} />
      </div>
      <div className="w-24 pb-4 m-auto">
        <ArrowUpCircle strokeWidth={0.5} size={90} className="text-blue" />
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="text-xl font-bold">{`Transaction Submitted`}</div>
        {chainId && hash && (
          <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>
            <div className="font-bold text-blue">View on explorer</div>
          </ExternalLink>
        )}
        {/* <Button color="gradient" onClick={onDismiss} style={{ margin: '20px 0 0 0' }}>
          Close
        </Button> */}
      </div>
    </div>
  )
}

interface ConfirmationModelContentProps {
  title: string
  onDismiss: () => void
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}

export const ConfirmationModalContent: FC<ConfirmationModelContentProps> = ({
  title,
  bottomContent,
  onDismiss,
  topContent,
}) => {
  return (
    <div className="grid gap-4">
      <ModalHeader title={title} onClose={onDismiss} />
      {topContent()}
      {bottomContent()}
    </div>
  )
}

interface TransactionErrorContentProps {
  message: string
  onDismiss: () => void
}

export const TransactionErrorContent: FC<TransactionErrorContentProps> = ({ message, onDismiss }) => {
  const { i18n } = useLingui()

  return <div className="grid gap-6"></div>
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  pendingText2?: string
  currencyToAdd?: Currency | undefined
}

const TransactionConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  content,
  currencyToAdd,
}) => {
  const { chainId } = useActiveWeb3React()

  let pendingText = 'Loading, please wait'
  let pendingText2 = ''

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} pendingText2={pendingText2} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  )
}

export default TransactionConfirmationModal
