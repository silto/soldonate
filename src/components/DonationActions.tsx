"use client";

import { Box, Button, Stack, TextField } from "@mui/material";
import { ActionPostResponse, LinkedAction } from "@solana/actions";
import {
  WalletSendTransactionError,
  WalletSignTransactionError,
} from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Transaction } from "@solana/web3.js";
import { ChangeEvent, useState } from "react";

const DonationActions = ({ actions }: { actions: LinkedAction[] }) => {
  const [freeAmount, setFreeAmount] = useState<string>("");
  const [error, setError] = useState<null | string>(null);
  const { publicKey, signTransaction, sendTransaction, wallet } = useWallet();
  const { connection } = useConnection();
  const { setVisible: setWalletModalVisible } = useWalletModal();
  const groupingFirstButtons =
    actions[0] &&
    !actions[0].parameters &&
    actions[1] &&
    !actions[1].parameters;
  const actionsList = groupingFirstButtons ? actions.slice(2) : actions;

  const callActionURL = async (url: string) => {
    if (!publicKey) {
      setWalletModalVisible(true);
      return;
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          account: publicKey?.toString(),
        }),
      });

      if (res.status !== 200) {
        const error: { message: string } = await res.json();
        setError(error?.message ?? "An unknown error occurred");
        return;
      }
      const payload: ActionPostResponse = await res.json();
      const tx = Transaction.from(Buffer.from(payload.transaction, "base64"));
      console.log(tx);
      const signature = await sendTransaction(tx, connection);
      // TODO
      // open snackbar to signal tx submitted
      // fetch /api/rpc/getTxStatus with {signature} body
      // until we either get an error or a confirmation
      // type SignatureStatus = {
      //     /** when the transaction was processed */
      //     slot: number;
      //     /** the number of blocks that have been confirmed and voted on in the fork containing `slot` */
      //     confirmations: number | null;
      //     /** transaction error, if any */
      //     err: TransactionError | null;
      //     /** cluster confirmation status, if data available. Possible responses: `processed`, `confirmed`, `finalized` */
      //     confirmationStatus?: TransactionConfirmationStatus;
      // };
      // then display snackbar for failure or success
    } catch (error) {
      console.log(error);
      if (
        error instanceof WalletSignTransactionError ||
        error instanceof WalletSendTransactionError
      ) {
        setError(error.message);
      }
      setError("An unknown error occurred");
    }
  };

  const runAction = (action: LinkedAction) => {
    setError(null);
    if (action.parameters) {
      if (!freeAmount || freeAmount === "0") {
        setError("Please set an amount to donate");
        return;
      }
      callActionURL(action.href.replace("{amount}", freeAmount));
      return;
    }
    callActionURL(action.href);
  };

  return (
    <Stack spacing={2}>
      {groupingFirstButtons ? (
        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            type="button"
            variant="contained"
            size="large"
            onClick={() => runAction(actions[0])}
          >
            {actions[0].label}
          </Button>
          <Button
            fullWidth
            type="button"
            variant="contained"
            size="large"
            onClick={() => runAction(actions[1])}
          >
            {actions[1].label}
          </Button>
        </Stack>
      ) : null}
      {actionsList.map((actionItem, i) => {
        if (actionItem.parameters) {
          return (
            <Box key={i}>
              <TextField
                fullWidth
                id="freeAmount"
                label={actionItem.parameters[0].label}
                variant="outlined"
                inputProps={{ inputMode: "numeric" }}
                value={freeAmount}
                // error={error?.field === "amount3"}
                // disabled={!amount3Enabled}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const re = /^[0-9]*\.?[0-9]*$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                    setFreeAmount(e.target.value);
                  }
                }}
              />
            </Box>
          );
        }
        return (
          <Button
            key={i}
            fullWidth
            type="button"
            variant="contained"
            size="large"
            onClick={() => runAction(actionItem)}
          >
            {actionItem.label}
          </Button>
        );
      })}
    </Stack>
  );
};

export default DonationActions;
