async function main() {
    const TodoContract = await ethers.getContractFactory("TodoContract");
    const contract = await TodoContract.deploy();
    await contract.deployed();

    console.log("TodoContract deployed to:", contract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
