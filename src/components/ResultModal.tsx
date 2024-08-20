import React from 'react'
import { create, hide, muiDialog, useModal } from '@ebay/nice-modal-react'
import { Modal } from 'antd'
import Confetti from 'react-confetti'
import CountUp from 'react-countup'

import styles from './Styles.module.scss'
import { text } from 'node:stream/consumers'

type Props = {
    currentPairPrice: string
    resultInProcess: string
}

const ResultModal = create<Props>(
    ({ currentPairPrice, resultInProcess, ...props }) => {
        const modal = useModal()
        const betPrice = localStorage.getItem('bet_price') || 1
        const balance = localStorage.getItem('balance') || 0
        const betRate = localStorage.getItem('bet_rate')
        const fixedPrice = localStorage.getItem('fixed_price') || 0
        const result = +betPrice * 2

        const onOk = () => {
            localStorage.removeItem('bet_rate')
            localStorage.removeItem('result_in_process')
            localStorage.removeItem('bet_price')
            localStorage.removeItem('fixed_price')
            hide(ResultModal)
        }

        const isUp = fixedPrice <= currentPairPrice && betRate == 'up'
        const isDown = fixedPrice >= currentPairPrice && betRate == 'down'

        const onFinish = () => {
            localStorage.setItem('balance', String(+balance + result))
        }

        const textData = [
            { title: 'You chose: ', value: betRate },
            { title: 'Fixed pair price: ', value: fixedPrice },
            { title: 'Current pair price: ', value: currentPairPrice },
        ]

        const checkForIsWonOrLoose = () => {
            if (isDown || isUp) {
                return (
                    <div className={styles.result__content}>
                        <Confetti />
                        {textData.map((el, index) => (
                            <p
                                key={index}
                                className={styles.result__content__text}
                            >
                                {el.title}
                                <span
                                    className={
                                        styles.result__content__text__value
                                    }
                                >
                                    {el.value}
                                </span>
                            </p>
                        ))}
                        <p className={styles.result__content__final}>
                            You won:&nbsp;
                            <CountUp
                                onEnd={onFinish}
                                className={styles.result__content__count}
                                end={result}
                                duration={10}
                            />
                        </p>
                    </div>
                )
            } else {
                return (
                    <div className={styles.result__content}>
                        {textData.map((el, index) => (
                            <p
                                key={index}
                                className={styles.result__content__text}
                            >
                                {el.title}
                                <span
                                    className={
                                        styles.result__content__text__value
                                    }
                                >
                                    {el.value}
                                </span>
                            </p>
                        ))}
                        <p className={styles.result__content__final}>
                            You lose!
                        </p>
                    </div>
                )
            }
        }

        return (
            <Modal
                closable={false}
                className={styles.result}
                {...muiDialog(modal)}
                onCancel={() => hide(ResultModal)}
                onOk={onOk}
                {...props}
            >
                {currentPairPrice && checkForIsWonOrLoose()}
            </Modal>
        )
    }
)

export default ResultModal
