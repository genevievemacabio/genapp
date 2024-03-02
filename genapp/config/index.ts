import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";

export function getContract(signer: ContractRunner) {
    return new Contract(
        "0x7d3D5d34e95AD272214d1047DC0fd2e0fFC02D09", //contract add
        abi as any,
        signer
    );
}