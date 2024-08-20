import React, { useState } from 'react'
import { create, hide, muiDialog, useModal } from '@ebay/nice-modal-react'
import { Modal } from 'antd'

type Props = {
    onClick: () => void
}

const BalanceModal = create<Props>(({ ...props }) => {
    const [balanceValue, setBalanceValue] = useState<number | null>()
    const balance = localStorage.getItem('balance') || 0
    const modal = useModal()
    const handleAdd = () => {
        if (balanceValue) {
            localStorage.setItem('balance', String(+balance + balanceValue))
            hide(BalanceModal)
            setBalanceValue(null)
        }
    }

    return (
        <Modal
            {...muiDialog(modal)}
            onCancel={() => hide(BalanceModal)}
            onOk={handleAdd}
            {...props}
        >
            <h2>Set balance</h2>
            <input
                type="number"
                onChange={(e) => setBalanceValue(+e.target.value)}
            />
        </Modal>
    )
})

export default BalanceModal
