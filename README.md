# Aave Defi Implementation

This repository contains an implementation of the Aave Defi protocol. The code allows users to interact with the Aave protocol to deposit collateral, borrow assets, and repay debts.

## Code Overview

The main functionality is implemented in the `main` function. Here's an overview of what the code does:

1. Deposit Collateral:
   - The code first deposits collateral (WETH - Wrapped Ether) using the `getWeth` function.
   - It then approves the lending pool to spend the deposited WETH using the `approveErc20` function.
   - Finally, it deposits the approved WETH into the lending pool using the `lendingPool.deposit` function.

2. Borrow Assets:
   - The code calculates the amount of DAI (a stablecoin) that can be borrowed based on the available borrowing power in ETH and the DAI/ETH price.
   - It then approves the lending pool to spend DAI on behalf of the user using the `approveErc20` function.
   - Next, it borrows the calculated amount of DAI from the lending pool using the `borrowDai` function.

3. Repay Debts:
   - The code repays the borrowed DAI using the `repay` function. It approves the lending pool to spend DAI and then repays the specified amount of DAI.

4. Helper Functions:
   - The code includes helper functions to get the DAI/ETH price (`getDaiPrice`) and user account data from the lending pool (`getBorrowUserData`).

## Contracts

The `contracts` folder contains two interfaces (`IWeth` and `IERC20`) representing the WETH (Wrapped Ether) token and ERC20 tokens, respectively. These interfaces define the required functions to interact with these tokens.

Please note that the provided code snippets are written in Solidity version 0.4.19 and 0.6.6 for the interfaces. The code assumes that the required dependencies and network configurations are set up correctly.

## Project Structure

The project is organized as follows:

- `contracts/`: Contains the Solidity smart contract files.
- `scripts/`: Contains JavaScript scripts to deploy and interact with the smart contracts.
- `hardhat.config.js`: Configuration file for Hardhat setup.
- `README.md`: This file.

## Getting Started

1. Clone the repository:

   ```node
   git clone https://github.com/chidubesteve/Aave-Defi.git
   ```

2. Install the dependencies:

   ```node
   cd your-repository
   npm install
   ```

3. Configure your development environment:

   - Install Hardhat globally:

     ```node
     npm install  hardhat
     ```

   - Set up your Ethereum network provider and accounts in the `hardhat.config.js` file.

4. Compile the smart contracts:

   ```node
   npx hardhat compile
   ```
5. Deploy the smart contracts:

No need to deploy

6. Interact with the compiled contract using the provided JavaScript scripts in the `scripts/` directory.



## Running the Code

To run the code, ensure you have the necessary dependencies installed and network configurations set up. Then, execute the `main` function to interact with the Aave protocol.

Please exercise caution while using this code and ensure that you understand the implications of depositing collateral, borrowing assets, and repaying debts in the Aave protocol.

For further questions or issues, feel free to reach out to ME!

Happy coding!
