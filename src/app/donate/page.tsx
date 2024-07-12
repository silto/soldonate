import Image from "next/image";
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
import { Metadata, ResolvingMetadata } from "next";
import getInfosFromURL from "@/lib/getInfosFromURL";
import { cache } from "react";
export const runtime = "edge";

const cachedGetInfosFromURL = cache(getInfosFromURL);

export async function generateMetadata(
  {
    searchParams,
  }: {
    searchParams: Record<string, string | undefined>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { metadata } = await cachedGetInfosFromURL(
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
  return metadata;
}

const DonatePage = async ({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) => {
  const { payload: action, error } = await cachedGetInfosFromURL(
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
              {searchParams.redirect ? (
                <>
                  <Link href={decodeURIComponent(searchParams.redirect)}>
                    <Box
                      sx={{
                        borderRadius: 2,
                        position: "relative",
                        height: "300px",
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                    >
                      {action.icon ===
                      new URL(
                        "/social_image.png",
                        process.env.NEXT_PUBLIC_BASE_URL
                      ).toString() ? (
                        <Image
                          src={"/social_image.png"}
                          alt="Go to the website"
                          fill={true}
                          style={{ objectFit: "contain" }}
                        />
                      ) : (
                        <img
                          src={action.icon}
                          alt="Go to the website"
                          style={{
                            objectFit: "contain",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      )}
                    </Box>
                  </Link>
                  <Link href={decodeURIComponent(searchParams.redirect)}>
                    {decodeURIComponent(searchParams.redirect)}
                  </Link>
                </>
              ) : (
                <Box
                  sx={{
                    borderRadius: 2,
                    position: "relative",
                    height: "300px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <Image
                    src={"/social_image.png"}
                    alt="Go to the website"
                    fill={true}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              )}
              <Typography variant="h5">{action.title}</Typography>
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
