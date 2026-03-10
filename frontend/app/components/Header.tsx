"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { IconClose, IconMenu } from "./icons";


const navItems = [
  { label: "Trang chủ", href: "#top" },
  { label: "Lập lá số tử vi", href: "#la-so-tu-vi" },
  { label: "Kiến thức lá số tử vi", href: "#kien-thuc" },
  { label: "Liên hệ", href: "#lien-he" },
];

export function Header() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header id="top" className=" top-0 left-0 z-50 w-full shadow-sm">
      <div className="w-full bg-[#DA251D] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1">
          <div className="hidden items-center gap-5 text-sm md:flex">
            <span>Liên hệ ngay với chúng tôi</span>
            <span className="h-4 w-px bg-white/40" />
            <span className="flex items-center gap-2">
              <Image src="/telephone.png" alt="" width={14} height={14} />
              0922-62-0000
            </span>
            <span className="h-4 w-px bg-white/40" />
            <span className="flex items-center gap-2">
              <Image src="/email.png" alt="" width={14} height={14} />
              tuvibatnha@gmail.com
            </span>
          </div>

          <div className="hidden ml-auto flex items-center gap-3 text-sm font-semibold">
            <button className="px-2 py-1">Đăng nhập</button>
            <button className="rounded-md bg-[#fff] px-4 py-1 text-[#DA251D]">Đăng ký</button>
          </div>
        </div>
      </div>

      {/*CONTENT*/}
      <div className="w-full bg-white">
        <div className="relative w-full h-[180px] md:h-[200px] overflow-hidden">

          {/* Bát quái background */}
          <Image
            src="/logo.png"
            alt="bat quai"
            width={500}
            height={500}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-30 opacity-10"
          />

          {/* Content đè lên */}
          <div className="w-full absolute inset-0 z-10 flex items-center justify-between gap-6 px-4">
            <div className="flex items-center gap-6">
              {/* Logo nhỏ */}
              <Image
                src="/lasotuvi.png"
                alt="logo"
                width={400}
                height={400}
                className=" w-28 md:w-32 lg:w-40 h-auto"
              />

              {/* Text */}
              <div className="flex flex-col">
                <div className="text-[#DA251D] font-bold text-2xl md:text-3xl translate-y-2">
                  DIỄN ĐÀN
                </div>

                <div className=" font-thuphap italic text-2xl md:text-5xl translate-y-6">
                  TỬ VI BÁT NHÃ
                </div>

                <div className="text-red-500 text-sm md:text-base self-end translate-y-9">
                  http://www.tuvibatnha.vn
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main navbar */}
      <div className="w-full bg-[#F6cbcb]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">

          <nav className="hidden w-full items-center justify-between  font-semibold text-zinc-700 md:flex">
            {navItems.map((it) => (
              <a
                key={it.href}
                href={it.href}
                className={it.label === "Lập lá số tử vi" ? "border-b-2 border-[#DA251D] pb-1 text-[#DA251D]" : "pb-1 hover:text-[#DA251D]"}
              >
                {it.label}
              </a>
            ))}
          </nav>

          <button
            className="inline-flex h-7 w-7 items-center justify-center rounded bg-zinc-100 text-zinc-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Đóng menu" : "Mở menu"}
          >
            {open ? <IconClose className="h-4 w-4" /> : <IconMenu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open ? (
          <div className="border-t border-zinc-100 bg-white md:hidden">
            <div className="mx-auto max-w-6xl px-4 py-3">
              <div className="flex flex-col gap-3 text-sm font-semibold text-zinc-700">
                {navItems.map((it) => (
                  <a
                    key={it.href}
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2 hover:bg-zinc-50 hover:text-[#DA251D]"
                  >
                    {it.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
