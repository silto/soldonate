"use client";

import { Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import { ActionPostResponse, LinkedAction } from "@solana/actions";
import {
  WalletSendTransactionError,
  WalletSignTransactionError,
} from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SignatureStatus, Transaction } from "@solana/web3.js";
import { ChangeEvent, useEffect, useState } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";

const DonationActions = ({ actions }: { actions: LinkedAction[] }) => {
  const [freeAmount, setFreeAmount] = useState<string>("");
  const [signatureWaitingConfirmation, setSignatureWaitingConfirmation] =
    useState<string | null>(null);
  const { publicKey, signTransaction, sendTransaction, wallet } = useWallet();
  const { connection } = useConnection();
  const { setVisible: setWalletModalVisible } = useWalletModal();
  const { enqueueSnackbar } = useSnackbar();
  const groupingFirstButtons =
    actions[0] &&
    !actions[0].parameters &&
    actions[1] &&
    !actions[1].parameters;
  const actionsList = groupingFirstButtons ? actions.slice(2) : actions;

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (signatureWaitingConfirmation) {
      intervalId = setInterval(() => {
        fetch("/api/rpc/getTxStatus", {
          method: "POST",
          body: JSON.stringify({
            signature: signatureWaitingConfirmation,
          }),
        })
          .then((res) => res.json())
          .then((signatureStatus) => {
            if ((signatureStatus as SignatureStatus).err) {
              enqueueSnackbar("The transaction failed", { variant: "error" });
              setSignatureWaitingConfirmation(null);
              clearInterval(intervalId);
            } else if (
              (signatureStatus as SignatureStatus).confirmationStatus ===
                "confirmed" ||
              (signatureStatus as SignatureStatus).confirmationStatus ===
                "finalized"
            ) {
              enqueueSnackbar("Transaction successful !", {
                variant: "success",
              });
              setSignatureWaitingConfirmation(null);
              clearInterval(intervalId);
            }
          })
          .catch(() => {
            enqueueSnackbar("An unknown error occured", { variant: "error" });
          });
      }, 2000);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [signatureWaitingConfirmation]);

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
        enqueueSnackbar(error?.message ?? "An unknown error occurred", {
          variant: "error",
        });
        return;
      }
      const payload: ActionPostResponse = await res.json();
      const tx = Transaction.from(Buffer.from(payload.transaction, "base64"));
      console.log(tx);
      const signature = await sendTransaction(tx, connection);
      setSignatureWaitingConfirmation(signature);
      enqueueSnackbar("Transaction submitted !", {
        variant: "info",
      });
    } catch (error) {
      console.log(error);
      if (
        error instanceof WalletSignTransactionError ||
        error instanceof WalletSendTransactionError
      ) {
        enqueueSnackbar(error.message, {
          variant: "error",
        });
        return;
      }
      enqueueSnackbar("An unknown error occurred", {
        variant: "error",
      });
    }
  };

  const runAction = (action: LinkedAction) => {
    if (action.parameters) {
      if (!freeAmount || freeAmount === "0") {
        enqueueSnackbar("Please set an amount to donate", {
          variant: "warning",
        });
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
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
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
                InputProps={{
                  endAdornment: (
                    <Button
                      key={i}
                      type="button"
                      variant="contained"
                      disabled={!freeAmount}
                      // size="large"
                      onClick={() => runAction(actionItem)}
                    >
                      {actionItem.label}
                    </Button>
                  ),
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

const DonationActionsWithSnack = ({ actions }: { actions: LinkedAction[] }) => {
  return (
    <SnackbarProvider maxSnack={3}>
      <DonationActions actions={actions} />
    </SnackbarProvider>
  );
};

export default DonationActionsWithSnack;
