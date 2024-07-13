"use client";
import { DefaultCopyField } from "@/components/ui/CopyField";
import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Modal,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import logo from "../../public/logo.svg";
import { ChangeEvent, useState } from "react";

const Home = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openHelpModal, setOpenHelpModal] = useState<boolean>(false);
  const [to, setTo] = useState<string>(process.env.NEXT_PUBLIC_DEFAULT_TO!);
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
  const [error, setError] = useState<null | { field: string; message: string }>(
    null
  );

  const actionParams = new URLSearchParams({
    to,
    amount1: amount1Enabled ? amount1 : "",
    amount2: amount2Enabled ? amount2 : "",
    amount3: amount3Enabled ? amount3 : "",
    freeAmountEnabled: freeAmountEnabled ? "1" : "0",
    fee: feeEnabled ? fee : "0",
    redirect: redirect ? encodeURIComponent(redirect) : "",
  }).toString();

  const actionUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/actions/donate?${actionParams}`;

  const blinkUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/donate?${actionParams}`;

  const validateAndOpenModal = () => {
    if (to === process.env.NEXT_PUBLIC_DEFAULT_TO) {
      setError({
        field: "to",
        message: "Set your own address to receive donations",
      });
      return;
    }
    if (amount1Enabled && !amount1) {
      setError({
        field: "amount1",
        message: "Amount can't be 0 if enabled",
      });
      return;
    }
    if (amount2Enabled && !amount2) {
      setError({
        field: "amount2",
        message: "Amount can't be 0 if enabled",
      });
      return;
    }
    if (amount3Enabled && !amount3) {
      setError({
        field: "amount3",
        message: "Amount can't be 0 if enabled",
      });
      return;
    }
    if (amount2Enabled && amount1 === amount2) {
      setError({
        field: "amount2",
        message: "Amounts can't be equal",
      });
      return;
    }
    if (amount3Enabled && (amount1 === amount3 || amount2 === amount3)) {
      setError({
        field: "amount3",
        message: "Amounts can't be equal",
      });
      return;
    }
    if (fee && parseFloat(fee) > 1) {
      setError({
        field: "fee",
        message:
          "Don't set a fee > 1%. That's very nice of you, but your donators would probably not like it.",
      });
      return;
    }
    setError(null);
    setOpenModal(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100dvh",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: { xs: "45px", md: "60px" },
          height: { xs: "45px", md: "60px" },
          position: { xs: "relative", md: "absolute" },
          left: { xs: "unset", md: "20px" },
          marginTop: "20px",
          top: { xs: "unset", md: "0px" },
        }}
      >
        <Image src={logo} alt="Soldonate" priority fill />
      </Box>
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
          px: {
            xs: 1,
            sm: 0,
          },
          mb: 2,
        }}
      >
        <Card
          variant="outlined"
          sx={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.default",
            gap: 2,
            mt: 2,
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
              error={error?.field === "to"}
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
                error={error?.field === "amount1"}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setAmount1Enabled(e.target.checked);
                  if (!e.target.checked) {
                    setAmount2Enabled(false);
                    setAmount3Enabled(false);
                  }
                }}
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
                error={error?.field === "amount2"}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setAmount2Enabled(e.target.checked);
                  if (e.target.checked) {
                    setAmount1Enabled(true);
                  } else {
                    setAmount3Enabled(false);
                  }
                }}
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
                error={error?.field === "amount3"}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setAmount3Enabled(e.target.checked);
                  if (e.target.checked) {
                    setAmount1Enabled(true);
                    setAmount2Enabled(true);
                  }
                }}
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
                error={error?.field === "fee"}
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
            {error ? (
              <Alert variant="standard" color="error">
                {error.message}
              </Alert>
            ) : null}
            <Button
              fullWidth
              type="button"
              variant="contained"
              size="large"
              onClick={() => validateAndOpenModal()}
            >
              {"Create Blink"}
            </Button>
          </Stack>
        </Card>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Typography
            sx={{
              textTransform: "uppercase",
              fontWeight: 400,
              fontSize: 12,
              cursor: "pointer",
              color: "grey.400",
              textDecoration: "underline",
              "&:hover": {
                color: "grey.300",
              },
            }}
            onClick={() => setOpenHelpModal(true)}
          >
            {"How does this work?"}
          </Typography>
        </Box>
      </Box>
      <Dialog
        onClose={() => setOpenModal(false)}
        aria-labelledby="customized-dialog-title"
        open={openModal}
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            boxShadow: 24,
            backgroundImage: "none",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {"Your Blink is ready !"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpenModal(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Stack spacing={2}>
            <DefaultCopyField
              fullWidth
              id="redirect"
              label={"Blink URL"}
              variant="outlined"
              type="text"
              value={blinkUrl}
            />
            <Typography gutterBottom>
              {`Post this link to social medias to accept donations. Users that have a Solana wallet that supports Blinks will see your content's preview with donation buttons appearing on their feed.`}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => window.open(blinkUrl, "_blank")}>
            Open Blink
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={() => setOpenHelpModal(false)}
        aria-labelledby="customized-dialog-title"
        open={openHelpModal}
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            boxShadow: 24,
            backgroundImage: "none",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {"How does this work ?"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpenModal(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            {`SolDonate allows you to easily create a donation `}
            <Link
              href="https://solana.com/solutions/actions"
              target="_blank"
              rel="noopener"
            >
              {"Blink"}
            </Link>
            {"."}
          </Typography>
          <Typography gutterBottom>
            {`First, enter the Solana address where you want to receive donations in the "Destination Solana address" field.`}
          </Typography>
          <Typography gutterBottom>
            {`Then, configure the donation buttons you want to show. You can show up to 3 buttons, with different SOL amounts.`}
          </Typography>
          <Typography gutterBottom>
            {`You can also choose to show or hide a "free amount" field, where the user can enter any amount he wants to donate.`}
          </Typography>
          <Typography gutterBottom>
            {`The "SolDonate fee" field allows you to set the fee you want to share with us on each donation. This helps us cover server expenses and maintain this service. You can disable it entirely if you want to.`}
          </Typography>
          <Typography gutterBottom>
            {`Finally, you can set a "Redirect URL" that the donation page will point to. When shared on social medias, the preview will show the informations of this destination site, effectively "wrapping" your content in a donation Blink. The donation page will also show your site's informations and allow the user to browse to it.`}
          </Typography>
          <Typography gutterBottom>
            {`Once you're done, click the "Create blink" button, and copy the link to share it wherever you want !`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpenHelpModal(false)}>
            Got it !
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
