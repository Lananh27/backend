"use client";

import Container from "./Container";
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

type FooterProps = {
  footerLogo?: string;
  footerMailingText?: string;
  footerContactText?: string;
  footerSocialText?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Footer({
  footerLogo,
  footerMailingText,
  footerContactText,
  footerSocialText,
}: FooterProps) {
  const imgUrl = (url?: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  return (
    <footer
      className="py-10 text-white"
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1.2fr_1fr]">
          <div className="lg:pl-8">
            <div className="flex items-start gap-5">
              {footerLogo ? (
                <img
                  src={imgUrl(footerLogo)}
                  alt="Footer logo"
                  className="max-h-[110px] w-auto shrink-0 object-contain"
                />
              ) : (
                <div className="h-[110px] w-[110px] shrink-0 border border-gray-600" />
              )}

              <div className="text-[28px] leading-9 text-white">
                <p className="whitespace-pre-line">
                  {footerMailingText || "LCLUC is a NASA program."}
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <span className="text-[20px] font-semibold text-white">
                Follow us:
              </span>
              <FaFacebookF className="text-[34px] text-white transition hover:text-lime-400" />
              <FaXTwitter className="text-[34px] text-white transition hover:text-lime-400" />
              <FaLinkedinIn className="text-[34px] text-white transition hover:text-lime-400" />
            </div>
          </div>

          <div className="flex items-start justify-center gap-12 text-[18px] font-semibold text-white">
            <span className="whitespace-nowrap">Privacy</span>
            <span className="whitespace-nowrap">Security</span>
            <span className="whitespace-nowrap">Disclaimer</span>
            <span className="whitespace-nowrap">Accessibility</span>
          </div>

          <div className="lg:pl-10">
            <p className="text-[20px] text-lime-400">
              {footerMailingText || "Join our Mailing List"}
            </p>

            <div className="mt-8">
              <p className="text-[20px] font-semibold text-white">Contact us:</p>
              <p className="mt-2 whitespace-pre-line text-[18px] text-lime-400">
                {footerContactText || "lcluc-support@umd.edu"}
              </p>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-3 text-[20px] font-semibold text-white">
                <span>We are on:</span>
                <FaFacebookF className="text-[28px] text-white transition hover:text-lime-400" />
                <FaXTwitter className="text-[28px] text-white transition hover:text-lime-400" />
                <FaLinkedinIn className="text-[28px] text-white transition hover:text-lime-400" />
              </div>
              <p className="mt-2 whitespace-pre-line text-[18px] text-white">
                {footerSocialText || ""}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}