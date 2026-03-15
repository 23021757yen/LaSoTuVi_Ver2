"use client";

import Image from "next/image";
import * as React from "react";
import { toPng } from "html-to-image";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { TuViChart, type TuViResponse } from "./components/TuViChart";

type Gender = "nam" | "nu";
type CalendarType = "" | "duong" | "am";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const years = Array.from(
  { length: 120 },
  (_, i) => new Date().getFullYear() - i,
);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const API_BASE_URL =
  process.env.NEXT_PUBLIC_TUVI_API_BASE_URL ?? "https://lasotuvi-be.onrender.com";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 text-sm font-semibold text-[#000000]">
      {children}
    </div>
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-8 w-full rounded border border-zinc-300 bg-white px-2 text-sm text-zinc-700 outline-none",
        "focus:border-[#DA251D] focus:ring-1 focus:ring-[#DA251D]/10",
        props.className,
      )}
    />
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-8 w-full rounded border border-zinc-300 bg-white px-2 text-sm text-zinc-700 outline-none",
        "placeholder:text-zinc-400 focus:border-[#DA251D] focus:ring-1 focus:ring-[#DA251D]/10",
        props.className,
      )}
    />
  );
}

function OptionPill<T extends string>(props: {
  name: string;
  value: T;
  checked: boolean;
  onChange: (v: T) => void;
  label: string;
}) {
  const id = `${props.name}-${props.value}`;
  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm transition ",
        props.checked
          ? "border-[#DA251D] bg-[#FCE6D5] text-[#000000]"
          : "border-zinc-300 bg-white text-zinc-600",
      )}
    >
      <input
        id={id}
        type="radio"
        name={props.name}
        value={props.value}
        checked={props.checked}
        onChange={() => props.onChange(props.value)}
        className="sr-only"
      />
      <span
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-full border ",
          props.checked ? "border-[#DA251D]" : "border-zinc-400",
        )}
      >
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full transition-all duration-200",
            props.checked ? "bg-[#DA251D]" : "bg-transparent",
          )}
        />
      </span>
      {props.label}
    </label>
  );
}

export default function Home() {
  const [name, setName] = React.useState("");
  const [gender, setGender] = React.useState<Gender>("nu");
  const [calendarType, setCalendarType] = React.useState<CalendarType>("");
  const [year, setYear] = React.useState<number>(years[0]);
  const [viewYear, setViewYear] = React.useState<number>(
    new Date().getFullYear(),
  );
  const [month, setMonth] = React.useState<number>(months[0]);
  const [day, setDay] = React.useState<number>(days[0]);
  const [hour, setHour] = React.useState<number>(0);
  const [minute, setMinute] = React.useState<number>(0);
  const [dst, setDst] = React.useState<"co" | "khong">("co");

  const [loading, setLoading] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const [generatingChartImage, setGeneratingChartImage] = React.useState(false);
  const [chartImageDataUrl, setChartImageDataUrl] = React.useState<string>("");
  const [apiError, setApiError] = React.useState<string>("");
  const [laSoData, setLaSoData] = React.useState<TuViResponse | null>(null);
  const chartCaptureRef = React.useRef<HTMLDivElement | null>(null);

  const generateChartImage = React.useCallback(async () => {
    if (!chartCaptureRef.current || !laSoData) {
      return "";
    }

    const dataUrl = await toPng(chartCaptureRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    return dataUrl;
  }, [laSoData]);

  React.useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!laSoData || !chartCaptureRef.current) {
        setChartImageDataUrl("");
        return;
      }

      setGeneratingChartImage(true);

      try {
        if (typeof document !== "undefined" && "fonts" in document) {
          await document.fonts.ready;
        }

        await new Promise((resolve) => requestAnimationFrame(resolve));
        const dataUrl = await generateChartImage();

        if (!cancelled) {
          setChartImageDataUrl(dataUrl);
        }
      } catch {
        if (!cancelled) {
          setChartImageDataUrl("");
        }
      } finally {
        if (!cancelled) {
          setGeneratingChartImage(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [generateChartImage, laSoData]);

  const handleDownloadChart = React.useCallback(async () => {
    if (!chartCaptureRef.current || !laSoData) {
      return;
    }

    setApiError("");
    setDownloading(true);

    try {
      const dataUrl = chartImageDataUrl || (await generateChartImage());

      const fileSafeName = laSoData.ho_ten
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");

      const link = document.createElement("a");
      link.download = `la-so-tu-vi-${fileSafeName || "user"}-${laSoData.nam_xem_han}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setApiError("Không thể tải lá số. Vui lòng thử lại.");
    } finally {
      setDownloading(false);
    }
  }, [chartImageDataUrl, generateChartImage, laSoData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!calendarType) {
      setApiError("Vui lòng chọn loại lịch.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tu-vi/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ho_ten: name.trim(),
          gioi_tinh: gender === "nam" ? "Nam" : "Nữ",
          ngay_sinh: day,
          thang_sinh: month,
          nam_sinh: year,
          nam_xem_han: viewYear,
          gio_sinh: hour,
          phut_sinh: minute,
          loai_lich: calendarType,
        }),
      });

      const payload = (await response.json()) as
        | TuViResponse
        | { detail?: string; error?: string };

      if (!response.ok) {
        const message =
          ("detail" in payload &&
            typeof payload.detail === "string" &&
            payload.detail) ||
          ("error" in payload &&
            typeof payload.error === "string" &&
            payload.error) ||
          "Không thể tạo lá số tử vi. Vui lòng thử lại.";
        throw new Error(message);
      }

      setLaSoData(payload as TuViResponse);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Lỗi kết nối tới backend API.";
      setApiError(message);
      setLaSoData(null);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Nhập Thông Tin",
      desc: "Điền đầy đủ họ tên, ngày tháng năm sinh và giờ sinh của bạn vào biểu mẫu",
      icon: "/pen.png",
    },
    {
      title: "Tính Toán Lá Số",
      desc: "Hệ thống sẽ tự động tính toán và phân tích lá số tử vi dựa trên thông tin của bạn",
      icon: "/sync.png",
    },
    {
      title: "Xem Kết Quả",
      desc: "Nhận được lá số tử vi chi tiết với 12 cung, các sao chủ đạo và lời giải đáp",
      icon: "/docs.png",
    },
    {
      title: "Hiểu Vận Mệnh",
      desc: "Tìm hiểu về tính cách, sự nghiệp, tài lộc và các khía cạnh khác trong cuộc đời",
      icon: "/idea.png",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="tinh-nang" className="bg-white pt-3 md:pt-5">
        <div>
          <div className="font-bold text-2xl md:text-3xl text-[#000000]">
            LÁ SỐ TỬ VI
          </div>
          <div className="mx-auto max-w-7xl px-4 grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div>
              <div className="mx-auto mt-10 max-w-6xl border-8 border-double border-[#DA251D] p-2 mb-12 bg-[#FEF1D9]">
                <section id="xem-la-so" className="px-6 md:px-10 py-10">
                  <div className="text-center">
                    <h2 className="font-thuphap text-[24px] font-extrabold leading-none text-[#DA251D] md:text-[32px]">
                      Lập Lá Số Tử Vi
                    </h2>
                  </div>

                  <form onSubmit={onSubmit} className="mt-10 space-y-1">
                    <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                      <div>
                        <FieldLabel>
                          Họ và tên <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Tử Vi Bát Nhã"
                          required
                        />
                      </div>

                      <div>
                        <FieldLabel>
                          Giới tính <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="mt-0.5 flex gap-2 ">
                          <OptionPill
                            name="gender"
                            value="nu"
                            checked={gender === "nu"}
                            onChange={setGender}
                            label="Nữ"
                          />
                          <OptionPill
                            name="gender"
                            value="nam"
                            checked={gender === "nam"}
                            onChange={setGender}
                            label="Nam"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <FieldLabel>
                        Loại lịch <span className="text-red-500 ">*</span>
                      </FieldLabel>
                      <div className="mt-0.5 flex gap-2">
                        <OptionPill
                          name="calendarType"
                          value="duong"
                          checked={calendarType === "duong"}
                          onChange={setCalendarType}
                          label="Dương lịch"
                        />
                        <OptionPill
                          name="calendarType"
                          value="am"
                          checked={calendarType === "am"}
                          onChange={setCalendarType}
                          label="Âm lịch"
                        />
                      </div>
                    </div>

                    <div className="max-w-75 space-y-4">
                      <div>
                        <FieldLabel>
                          Năm <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select
                          value={year}
                          onChange={(e) => setYear(Number(e.target.value))}
                        >
                          <option value={years[0]}>Năm</option>
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <FieldLabel>
                          Tháng <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select
                          value={month}
                          onChange={(e) => setMonth(Number(e.target.value))}
                        >
                          <option value={months[0]}>Tháng</option>
                          {months.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <FieldLabel>
                          Ngày <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select
                          value={day}
                          onChange={(e) => setDay(Number(e.target.value))}
                        >
                          <option value={days[0]}>Ngày</option>
                          {days.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FieldLabel>
                            Giờ <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select
                            value={hour}
                            onChange={(e) => setHour(Number(e.target.value))}
                          >
                            <option value={0}>Giờ</option>
                            {hours.map((h) => (
                              <option key={h} value={h}>
                                {String(h).padStart(2, "0")}
                              </option>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <FieldLabel>
                            Phút <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select
                            value={minute}
                            onChange={(e) => setMinute(Number(e.target.value))}
                          >
                            <option value={0}>Phút</option>
                            {minutes.map((m) => (
                              <option key={m} value={m}>
                                {String(m).padStart(2, "0")}
                              </option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div>
                        <FieldLabel>
                          Xem năm hạn <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select
                          value={viewYear}
                          onChange={(e) => setViewYear(Number(e.target.value))}
                        >
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Cảnh báo múi giờ</FieldLabel>
                      <div className="mt-0.5 flex flex-wrap gap-2">
                        <OptionPill
                          name="dst"
                          value="co"
                          checked={dst === "co"}
                          onChange={setDst}
                          label="Có cảnh báo"
                        />
                        <OptionPill
                          name="dst"
                          value="khong"
                          checked={dst === "khong"}
                          onChange={setDst}
                          label="Không cảnh báo"
                        />
                      </div>
                    </div>

                    {apiError ? (
                      <p className="text-sm font-medium text-red-600">
                        {apiError}
                      </p>
                    ) : null}

                    <div className="pt-5 text-center">
                      <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                          "inline-flex h-10 min-w-62.5 items-center justify-center gap-2 rounded-md bg-[#DA251D] px-7 text-base font-semibold text-white",
                          "disabled:cursor-not-allowed disabled:opacity-70",
                        )}
                      >
                        {loading ? "Đang xử lý..." : "Lập lá số tử vi"}
                        <Image src="/sync.png" alt="" width={14} height={14} />
                      </button>
                    </div>
                  </form>

                  {laSoData ? (
                    <div className="mx-auto mt-7 max-w-6xl">
                      <div className="mb-3 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={handleDownloadChart}
                          disabled={downloading}
                          className={cn(
                            "inline-flex h-9 items-center justify-center rounded-md bg-[#0004ff] px-4 text-sm font-semibold text-white",
                            "disabled:cursor-not-allowed disabled:opacity-70 ",
                          )}
                        >
                          {downloading ? "Đang tải..." : "Tải lá số"}
                        </button>
                      </div>

                      <div
                        aria-hidden="true"
                        className="pointer-events-none fixed-left-[10000px] top-0 z-[-1] h-0 w-0 overflow-hidden opacity-0"
                      >
                        <div ref={chartCaptureRef} className="inline-block bg-white p-2">
                          <div className="w-160 md:w-170">
                            <TuViChart data={laSoData} />
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 rounded-md border border-zinc-200 bg-white">
                        {generatingChartImage ? (
                          <p className="text-center text-sm text-zinc-500">Đang tạo ảnh...</p>
                        ) : chartImageDataUrl ? (
                          <div className="flex justify-center">
                            <img
                              src={chartImageDataUrl}
                              alt="Ảnh lá số tử vi"
                              className="mx-auto block h-auto w-full rounded-sm border border-zinc-100"
                            />
                          </div>
                        ) : (
                          <p className="text-center text-sm text-zinc-500">
                            Chưa tạo được ảnh lá số. Vui lòng thử lại.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : null}
                </section>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div>
              <div className="mx-auto mt-10 max-w-6xl border-8 border-double border-[#F59E0B] p-2 mb-12 bg-[#FDEBCC]">
                <div className="font-thuphap text-[24px] font-extrabold leading-none text-[#DA251D] md:text-[32px] text-center">
                  Kiến thức tử vi
                </div>

                <div className="mt-6 space-y-4">
                  {/* CARD */}
                  <div className="bg-[#ffffff] rounded-xl p-5 shadow-sm hover:shadow-md transition">
                    <h2 className="text-14px md:text-18px font-bold text-black">
                      SAO THIÊN TƯỚNG / Ý NGHĨA SAO THIÊN TƯỚNG TẠI 12 CUNG
                    </h2>
                    <div className="mt-2 text-sm text-gray-500">
                      Từ: <span className="font-medium">tuvibatnha.vn</span>
                      <span className="mx-3">Ngày: 03/03/2026</span>
                    </div>
                    <p className="mt-4 text-black leading-relaxed text-[14px]">
                      Sao Thiên Tướng: là một trong ngũ đại chính tinh của khoa
                      tử vi, thuộc chòm sao Bắc Đẩu Tinh với hành Thủy, mang
                      tính chất quyền tinh.
                    </p>
                  </div>

                  {/* CARD */}
                  <div className="bg-[#ffffff] rounded-xl p-5 shadow-sm hover:shadow-md transition">
                    <h2 className="text-14px md:text-18px font-bold text-black">
                      SAO TỬ VI / Ý NGHĨA SAO TỬ VI TẠI 12 CUNG
                    </h2>
                    <div className="mt-2 text-sm text-gray-500">
                      Từ: <span className="font-medium">tuvibatnha.vn</span>
                      <span className="mx-3">Ngày: 02/07/2025</span>
                    </div>
                    <p className="mt-4 text-black leading-relaxed text-[14px]">
                      Sao Tử Vi: là sao đứng đầu trong hệ thống chính tinh của
                      khoa Tử Vi, được xem như &quot;đế tinh&quot;, tượng trưng cho quyền
                      lực, uy nghi và khả năng lãnh đạo.
                    </p>
                  </div>

                  {/* CARD */}
                  <div className="bg-[#ffffff] rounded-xl p-5 shadow-sm hover:shadow-md transition">
                    <h2 className="text-14px md:text-18px font-bold text-black">
                      SAO THIÊN PHỦ / Ý NGHĨA SAO THIÊN PHỦ TẠI 12 CUNG
                    </h2>
                    <div className="mt-2 text-sm text-gray-500">
                      Từ: <span className="font-medium">tuvibatnha.vn</span>
                      <span className="mx-3">Ngày: 01/06/2026</span>
                    </div>
                    <p className="mt-4 text-text-[14px] leading-relaxed text-[14px]">
                      Sao Thiên Phủ: là một chính tinh thuộc hành Thổ trong khoa
                      Tử Vi, mang tính chất kho tàng và tài phúc. Sao này tượng
                      trưng cho sự ổn định, phúc hậu, khả năng quản lý tài sản
                      và tích lũy của cải.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div id="dien-dan" className="hidden" />
      <div id="ve-chung-toi" className="hidden" />

      <Footer />
    </div>
  );
}
