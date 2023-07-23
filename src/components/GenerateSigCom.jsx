import React from 'react'
import { useSignTypedData } from 'wagmi'

const GenerateSigCom = ({ domain,
    types,
    value,
    handleSignatureSigned
}) => {
    const { data, isError, isLoading, isSuccess, signTypedData } =
        useSignTypedData({
            domain,
            types,
            value,
            onSuccess(data) {
                handleSignatureSigned(data);
            }
        })
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '400px', heigth: '400px', borderRadius: '20px', border: '1px solid grey', padding: '20px' }}>
            <h1>Confirm action</h1>
            <div onClick={() => {
                console.log(
                    domain,
                    types,
                    value,
                    'Clicking sign confirm'
                );
                signTypedData();
            }} style={{ width: '50px', height: '30px', borderRadius: '5px', cursor: 'pointer', padding: '5px' }}>
                <span>Confirm</span>
            </div>
        </div>
    )
}

export default GenerateSigCom