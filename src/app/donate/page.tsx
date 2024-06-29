import Image from "next/image";
import getActionFromURL from "@/lib/getActionFromURL";
import {
  Alert,
  Box,
  Card,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import DonationActions from "@/components/DonationActions";
import WalletButton from "@/components/WalletButton";
export const runtime = "edge";

const DonatePage = async ({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) => {
  const { payload: action, error } = await getActionFromURL(
    new URLSearchParams({
      to: searchParams.to || "",
      amount1: searchParams.amount1 || "",
      amount2: searchParams.amount2 || "",
      amount3: searchParams.amount3 || "",
      freeAmountEnabled: searchParams.freeAmountEnabled || "",
      fee: searchParams.fee || "",
      redirect: searchParams.redirect
        ? decodeURIComponent(searchParams.redirect)
        : "",
    })
  );

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
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 20,
        }}
      >
        <WalletButton />
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
          {error || !action ? (
            <Alert variant="standard" color="error">
              {error ?? "An unknown error occurred"}
            </Alert>
          ) : (
            <Stack spacing={2}>
              <Box
                sx={{
                  borderRadius: 2,
                  position: "relative",
                  height: "300px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={action.icon}
                  alt="Go to the website"
                  fill={true}
                  style={{ objectFit: "contain" }}
                  // blurDataURL="data:..." automatically provided
                  // placeholder="blur" // Optional blur-up while loading
                />
              </Box>
              {searchParams.redirect ? (
                <Link href={decodeURIComponent(searchParams.redirect)}>
                  {decodeURIComponent(searchParams.redirect)}
                </Link>
              ) : null}
              <Typography variant="h4">{action.title}</Typography>
              <Typography>{action.description}</Typography>
              <Divider />
              {action?.links?.actions ? (
                <DonationActions actions={action.links.actions} />
              ) : null}
            </Stack>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default DonatePage;
