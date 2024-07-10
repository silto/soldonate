import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  LinkedAction,
} from "@solana/actions";
import validatedQueryParams from "./validateQueryParams";
import * as cheerio from "cheerio";
import { Metadata } from "next";
import { metadata as defaultMetadata } from "../app/layout";
import { Twitter } from "next/dist/lib/metadata/types/twitter-types";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
const getMetadataFromSearchParams = async (
  searchParams: URLSearchParams
): Promise<Metadata> => {
  const metadata = {
    ...defaultMetadata,
  };
  try {
    const { redirect } = validatedQueryParams(searchParams);
    if (redirect) {
      try {
        const response = await fetch(redirect, {
          next: { revalidate: 3600 * 24 },
        });
        const html = await response.text();
        const $ = cheerio.load(html);
        const pageTitle = $("title").contents().first().text();
        const pageDescription = $('meta[name="description"]').attr("content");
        const twitter: Record<string, unknown> = {};
        if (pageTitle) {
          metadata.title = pageTitle;
        }
        if (pageDescription) {
          metadata.description = pageDescription;
        }
        const twitterTitle = $('meta[name="twitter:title"]').attr("content");
        if (twitterTitle) {
          twitter.title = twitterTitle;
        }
        const twitterDescription = $('meta[name="twitter:description"]').attr(
          "content"
        );
        if (twitterDescription) {
          twitter.description = twitterDescription;
        }
        const twitterCard = $('meta[name="twitter:card"]').attr("content");
        if (twitterCard) {
          twitter.card = twitterCard;
        }
        const twitterSite = $('meta[name="twitter:site"]').attr("content");
        if (twitterSite) {
          twitter.site = twitterSite;
        }
        const twitterSiteId = $('meta[name="twitter:site:id"]').attr("content");
        if (twitterSiteId) {
          twitter.siteId = twitterSiteId;
        }
        const twitterCreator = $('meta[name="twitter:creator"]').attr(
          "content"
        );
        if (twitterCreator) {
          twitter.creator = twitterCreator;
        }
        const twitterCreatorId = $('meta[name="twitter:creator:id"]').attr(
          "content"
        );
        if (twitterCreatorId) {
          twitter.creatorId = twitterCreatorId;
        }
        const twitterImage = $('meta[name="twitter:image"]').attr("content");
        if (twitterImage) {
          twitter.images = [twitterImage];
        }
        const twitterPlayer = $('meta[name="twitter:player"]').attr("content");
        const twitterPlayerStream = $(
          'meta[name="twitter:player:stream"]'
        ).attr("content");
        if (twitterPlayer || twitterPlayerStream) {
          const twitterPlayerWidth = $(
            'meta[name="twitter:player:width"]'
          ).attr("content");
          const twitterPlayHeight = $(
            'meta[name="twitter:player:height"]'
          ).attr("content");
          twitter.players = [
            {
              playerUrl: twitterPlayer,
              streamUrl: twitterPlayerStream,
              width: twitterPlayerWidth,
              height: twitterPlayHeight,
            },
          ];
        }
        if (Object.keys(twitter).length > 0) {
          metadata.twitter = twitter;
        }
        const og: Record<string, unknown> = {};
        const ogTitle = $('meta[property="og:title"]').attr("content");
        if (ogTitle) {
          og.title = ogTitle;
        }
        const ogDescription = $('meta[property="og:description"]').attr(
          "content"
        );
        if (ogDescription) {
          og.description = ogDescription;
        }
        const ogURL = $('meta[property="og:url"]').attr("content");
        if (ogURL) {
          og.url = ogURL;
        }
        const ogImage = $('meta[property="og:image"]').attr("content");
        if (ogImage) {
          og.images = [
            {
              url: ogImage,
            },
          ];
        }
        const ogType = $('meta[property="og:type"]').attr("content");
        if (ogType) {
          og.type = ogType;
        }
        const ogLocale = $('meta[property="og:locale"]').attr("content");
        if (ogLocale) {
          og.locale = ogLocale;
        }
        const ogDeterminer = $('meta[property="og:determiner"]').attr(
          "content"
        );
        if (ogDeterminer) {
          og.determiner = ogDeterminer;
        }
        const ogAudio = $('meta[property="og:audio"]').attr("content");
        if (ogAudio) {
          og.audio = ogAudio;
        }
        const ogVideo = $('meta[property="og:video"]').attr("content");
        if (ogVideo) {
          og.video = ogVideo;
        }
        if (Object.keys(og).length > 0) {
          metadata.openGraph = og;
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (err) {
    console.log(err);
  }
  return metadata;
};

export default getMetadataFromSearchParams;
