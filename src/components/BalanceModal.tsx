import React, { useState } from 'react'
import { create, hide, muiDialog, useModal } from '@ebay/nice-modal-react'
import { Modal } from 'antd'

type Props = {
    onClick: () => void
    isSimpleModal?: boolean
    description?: string
    confirmBtnTitle?: string
}

const CustomModal = create<Props>(({ onClick, isSimpleModal, ...props }) => {
    const [balanceValue, setBalanceValue] = useState<string | null>()
    const modal = useModal()
    const handleAdd = () => {
        if (balanceValue) {
            localStorage.setItem('balance', balanceValue)
            hide(CustomModal)
            setBalanceValue(null)
        }
    }

    return (
        <Modal
            {...muiDialog(modal)}
            onCancel={() => hide(CustomModal)}
            onOk={handleAdd}
            {...props}
        >
            <h2>Your current balance</h2>
            <input
                type="number"
                onChange={(e) => setBalanceValue(e.target.value)}
            />
        </Modal>
    )
})

export default CustomModal
