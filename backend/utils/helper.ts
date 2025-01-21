import { account, contract, web3 } from "./blockchain";

export const formatTaskArray = (data: any) => {
    return data.map((item: any) => {
        const task = {
            id: item?.id,
            title: item?.title,
            description: item?.description,
            status: item?.status,
            priority: item?.priority,
            deadline: item?.deadline,
            createdBy: item?.createdBy,
        }
        return task;
    })
}

export const formatTaskObj = (data: any) => {
    return {
        id: data?.id,
        title: data?.title,
        description: data?.description,
        status: data?.status,
        priority: data?.priority,
        deadline: data?.deadline,
        createdBy: data?.createdBy,
    }
}

export const sanitizeReceipt = (data: any) => {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

export const signTransaction = async (tx: any) => {
    try {
        // Estimate gas
        const gas = await tx.estimateGas({ from: account.address });

        // Fetch the current gas price
        const gasPrice = await web3.eth.getGasPrice();

        // Encode the transaction data
        const data = tx.encodeABI();

        // Sign the transaction
        const signedTx = await web3.eth.accounts.signTransaction(
            {
                to: contract.options.address,
                data,
                gas,
                gasPrice,
                from: account.address,
            },
            account.privateKey
        );

        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    } catch (err) {
        console.log(err);
        throw new Error('Failed to sign transaction!');
    }
}