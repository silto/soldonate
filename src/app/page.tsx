"use client";
import { DefaultCopyField } from "@/components/ui/CopyField";
import {
  Box,
  Button,
  Card,
  Divider,
  FormControlLabel,
  InputAdornment,
  Modal,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { ChangeEvent, useMemo, useState } from "react";
// import Image from "next/image";

const Home = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [to, setTo] = useState<string>(
    "G9xk78Sc5Q8Hxr8pGgNri1puYeJFnznqKhHPdqQfKddf"
  );
  const [amount1, setAmount1] = useState<string>("0.1");
  const [amount2, setAmount2] = useState<string>("1");
  const [amount3, setAmount3] = useState<string>("10");
  const [amount1Enabled, setAmount1Enabled] = useState<boolean>(true);
  const [amount2Enabled, setAmount2Enabled] = useState<boolean>(true);
  const [amount3Enabled, setAmount3Enabled] = useState<boolean>(false);
  const [freeAmountEnabled, setFreeAmountEnabled] = useState<boolean>(true);
  const [fee, setFee] = useState<string>("0.1");
  const [feeEnabled, setFeeEnabled] = useState<boolean>(true);
  const [redirect, setRedirect] = useState<string>("");

  const actionUrl = useMemo(() => {
    return `${process.env
      .NEXT_PUBLIC_API_URL!}/actions/donate?${new URLSearchParams({
      to,
      amount1: amount1Enabled ? amount1 : "",
      amount2: amount2Enabled ? amount1 : "",
      amount3: amount3Enabled ? amount1 : "",
      freeAmountEnabled: freeAmountEnabled ? "1" : "0",
      fee: feeEnabled ? fee : "0",
      redirect: redirect ? encodeURIComponent(redirect) : "",
    }).toString()}`;
  }, [
    to,
    amount1,
    amount2,
    amount3,
    amount1Enabled,
    amount2Enabled,
    amount3Enabled,
    freeAmountEnabled,
    fee,
    feeEnabled,
    redirect,
  ]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100dvh",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "transparent",
          width: {
            xs: "100%",
            sm: "516px",
          },
          margin: {
            xs: 2,
            sm: 0,
          },
        }}
      >
        <Card
          variant="outlined"
          sx={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Stack spacing={2}>
            <TextField
              fullWidth
              id="to"
              label={"Destination Solana address"}
              variant="outlined"
              type="text"
              value={to}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTo(e.target.value)
              }
            />
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <TextField
                fullWidth
                id="amount1"
                label={"Amount 1"}
                variant="outlined"
                inputProps={{ inputMode: "numeric" }}
                value={amount1}
                disabled={!amount1Enabled}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const re = /^[0-9]*\.?[0-9]*$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                    setAmount1(e.target.value);
                  }
                }}
              />
              <Switch
                checked={amount1Enabled}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAmount1Enabled(e.target.checked)
                }
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <TextField
                fullWidth
                id="amount2"
                label={"Amount 2"}
                variant="outlined"
                inputProps={{ inputMode: "numeric" }}
                value={amount2}
                disabled={!amount2Enabled}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const re = /^[0-9]*\.?[0-9]*$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                    setAmount2(e.target.value);
                  }
                }}
              />
              <Switch
                checked={amount2Enabled}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAmount2Enabled(e.target.checked)
                }
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <TextField
                fullWidth
                id="amount3"
                label={"Amount 3"}
                variant="outlined"
                inputProps={{ inputMode: "numeric" }}
                value={amount3}
                disabled={!amount3Enabled}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const re = /^[0-9]*\.?[0-9]*$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                    setAmount3(e.target.value);
                  }
                }}
              />
              <Switch
                checked={amount3Enabled}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAmount3Enabled(e.target.checked)
                }
              />
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={freeAmountEnabled}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFreeAmountEnabled(e.target.checked)
                    }
                  />
                }
                label="Add free amount input"
              />
            </Box>
            <Divider />
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <TextField
                fullWidth
                id="fee"
                label={"SolDonate fee"}
                variant="outlined"
                inputProps={{ inputMode: "numeric" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                value={fee}
                disabled={!feeEnabled}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const re = /^[0-9]*\.?[0-9]*$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                    setFee(e.target.value);
                  }
                }}
              />
              <Switch
                checked={feeEnabled}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFeeEnabled(e.target.checked)
                }
              />
            </Box>
            <Divider />
            <TextField
              fullWidth
              id="redirect"
              label={"Redirect link"}
              variant="outlined"
              type="text"
              value={redirect}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRedirect(e.target.value)
              }
            />
            <Divider />
            <Button
              fullWidth
              type="button"
              variant="contained"
              size="large"
              onClick={() => setOpenModal(true)}
            >
              {"Create Blink"}
            </Button>
          </Stack>
        </Card>
      </Box>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 600,
            width: "90%",
            maxHeight: "80%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Stack spacing={2}>
            <DefaultCopyField
              fullWidth
              id="redirect"
              label={"Action URL"}
              variant="outlined"
              type="text"
              value={actionUrl}
            />
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;
