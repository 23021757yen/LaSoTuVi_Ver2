import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export enum Chi {
  Ty = 0,
  Suu = 1,
  Dan = 2,
  Mao = 3,
  Thin = 4,
  Ti = 5,
  Ngo = 6,
  Mui = 7,
  Than = 8,
  Dau = 9,
  Tuat = 10,
  Hoi = 11,
}

export enum Can {
  Giap = 0,
  At = 1,
  Binh = 2,
  Dinh = 3,
  Mau = 4,
  Ky = 5,
  Canh = 6,
  Tan = 7,
  Nham = 8,
  Quy = 9,
}

export interface Cung {
  name: string;
  chi: Chi;
  can: Can;
  stars: string[];
}

export type StarInfo = {
  ten: string;
  loai: "chinh_tinh" | "sao_phu" | string;
  tu_hoa?: string;
};

export type CungInfo = {
  vi_tri: number;
  dia_chi: string;
  thu_tu: number;
  thien_can?: string;
  cac_sao: StarInfo[];
};

export type TuViResponse = {
  ho_ten: string;
  gioi_tinh: string;
  ngay_sinh_duong_lich: string;
  gio_sinh: number;
  phut_sinh: number;
  loai_lich_nhap: string;
  nam_xem_han: number;
  can_chi_nam_xem_han: string;
  am_duong_menh: string;
  am_lich: {
    ngay_am: number;
    thang_am: number;
    nam_am: number;
    thang_nhuan: boolean;
  };
  can_chi: {
    nam: { can_chi: string };
    thang: { can_chi: string };
    ngay: { can_chi: string };
    gio: { can_chi: string };
    ngu_hanh_ban_menh?: {
      hanh: string;
    };
  };
  cung_menh_idx: number;
  cung_than_idx: number;
  cac_cung: Record<string, CungInfo>;
  can_12_cung: Record<string, { can: string; can_idx: number }>;
  cuc_menh: {
    so_cuc: number;
    ten_cuc: string;
  };
  dai_van?: {
    huong: string;
    so_ra_van: number;
    cac_dai_van?: Array<{
      van_thu: number;
      can_chi: string;
      tuoi_bat_dau: number;
      tuoi_ket_thuc: number;
    }>;
  };
  chu_menh: string;
  chu_than: string;
  sao_theo_cung: Record<string, StarInfo[]>;
  cac_sao?: {
    tu_hoa?: Record<string, string>;
  };
};

type PalaceCell = {
  idx: number;
  row: number;
  col: number;
};

type Point = {
  x: number;
  y: number;
};

type KhongVongEdgeLabel = {
  ten: "Tuần" | "Triệt";
  xPct: number;
  yPct: number;
  huong: "doc" | "ngang" | "fallback" | "goc-duoi" | "goc-tren";
};

const THIEN_CAN_VN = [
  "Giáp",
  "Ất",
  "Bính",
  "Đinh",
  "Mậu",
  "Kỷ",
  "Canh",
  "Tân",
  "Nhâm",
  "Quý",
];
const DIA_CHI_VN = [
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tỵ",
  "Ngọ",
  "Mùi",
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
];

const NAP_AM_BY_CAN_CHI_NAM: Record<string, string> = {
  "Giáp Tý": "Hải Trung Kim",
  "Ất Sửu": "Hải Trung Kim",
  "Bính Dần": "Lư Trung Hỏa",
  "Đinh Mão": "Lư Trung Hỏa",
  "Mậu Thìn": "Đại Lâm Mộc",
  "Kỷ Tỵ": "Đại Lâm Mộc",
  "Canh Ngọ": "Lộ Bàng Thổ",
  "Tân Mùi": "Lộ Bàng Thổ",
  "Nhâm Thân": "Kiếm Phong Kim",
  "Quý Dậu": "Kiếm Phong Kim",
  "Giáp Tuất": "Sơn Đầu Hỏa",
  "Ất Hợi": "Sơn Đầu Hỏa",
  "Bính Tý": "Giản Hạ Thủy",
  "Đinh Sửu": "Giản Hạ Thủy",
  "Mậu Dần": "Thành Đầu Thổ",
  "Kỷ Mão": "Thành Đầu Thổ",
  "Canh Thìn": "Bạch Lạp Kim",
  "Tân Tỵ": "Bạch Lạp Kim",
  "Nhâm Ngọ": "Dương Liễu Mộc",
  "Quý Mùi": "Dương Liễu Mộc",
  "Giáp Thân": "Tuyền Trung Thủy",
  "Ất Dậu": "Tuyền Trung Thủy",
  "Bính Tuất": "Ốc Thượng Thổ",
  "Đinh Hợi": "Ốc Thượng Thổ",
  "Mậu Tý": "Tích Lịch Hỏa",
  "Kỷ Sửu": "Tích Lịch Hỏa",
  "Canh Dần": "Tùng Bách Mộc",
  "Tân Mão": "Tùng Bách Mộc",
  "Nhâm Thìn": "Trường Lưu Thủy",
  "Quý Tỵ": "Trường Lưu Thủy",
  "Giáp Ngọ": "Sa Trung Kim",
  "Ất Mùi": "Sa Trung Kim",
  "Bính Thân": "Sơn Hạ Hỏa",
  "Đinh Dậu": "Sơn Hạ Hỏa",
  "Mậu Tuất": "Bình Địa Mộc",
  "Kỷ Hợi": "Bình Địa Mộc",
  "Canh Tý": "Bích Thượng Thổ",
  "Tân Sửu": "Bích Thượng Thổ",
  "Nhâm Dần": "Kim Bạch Kim",
  "Quý Mão": "Kim Bạch Kim",
  "Giáp Thìn": "Phú Đăng Hỏa",
  "Ất Tỵ": "Phú Đăng Hỏa",
  "Bính Ngọ": "Thiên Hà Thủy",
  "Đinh Mùi": "Thiên Hà Thủy",
  "Mậu Thân": "Đại Trạch Thổ",
  "Kỷ Dậu": "Đại Trạch Thổ",
  "Canh Tuất": "Thoa Xuyến Kim",
  "Tân Hợi": "Thoa Xuyến Kim",
  "Nhâm Tý": "Tang Đố Mộc",
  "Quý Sửu": "Tang Đố Mộc",
  "Giáp Dần": "Đại Khê Thủy",
  "Ất Mão": "Đại Khê Thủy",
  "Bính Thìn": "Sa Trung Thổ",
  "Đinh Tỵ": "Sa Trung Thổ",
  "Mậu Ngọ": "Thiên Thượng Hỏa",
  "Kỷ Mùi": "Thiên Thượng Hỏa",
  "Canh Thân": "Thạch Lựu Mộc",
  "Tân Dậu": "Thạch Lựu Mộc",
  "Nhâm Tuất": "Đại Hải Thủy",
  "Quý Hợi": "Đại Hải Thủy",
};

const NGU_HANH_CAN_CHI: Record<string, NguHanh> = {
  Tý: "thuy",
  Sửu: "tho",
  Dần: "moc",
  Mão: "moc",
  Thìn: "tho",
  Tỵ: "hoa",
  Ngọ: "hoa",
  Mùi: "tho",
  Thân: "kim",
  Dậu: "kim",
  Tuất: "tho",
  Hợi: "thuy",
};

const PALACE_LAYOUT: PalaceCell[] = [
  { idx: 5, row: 1, col: 1 },
  { idx: 6, row: 1, col: 2 },
  { idx: 7, row: 1, col: 3 },
  { idx: 8, row: 1, col: 4 },
  { idx: 4, row: 2, col: 1 },
  { idx: 9, row: 2, col: 4 },
  { idx: 3, row: 3, col: 1 },
  { idx: 10, row: 3, col: 4 },
  { idx: 2, row: 4, col: 1 },
  { idx: 1, row: 4, col: 2 },
  { idx: 0, row: 4, col: 3 },
  { idx: 11, row: 4, col: 4 },
];

type NguHanh = "hoa" | "moc" | "kim" | "thuy" | "tho";

const STAR_ELEMENT_MAP: Record<string, NguHanh> = {
  // Hanh Kim
  "Vũ Khúc": "kim",
  "Thất Sát": "kim",
  "Kình Dương": "kim",
  "Đà La": "kim",
  "Bạch Hổ": "kim",
  "Thiên Khốc": "kim",
  "Địa Võng": "kim",
  "Lưu niên Văn Tinh": "kim",
  "LN Văn Tinh": "kim",
  "Tấu Thư": "kim",
  "Thai Phụ": "kim",
  "Thiên La": "kim",
  "Hoa Cái": "kim",
  "Văn Xương": "kim",

  // Hanh Thuy
  "Thiên Đồng": "thuy",
  "Thái Âm": "thuy",
  "Tham Lang": "thuy",
  "Cự Môn": "thuy",
  "Thiên Tướng": "thuy",
  "Phá Quân": "thuy",
  "Hồng Loan": "thuy",
  "Hóa Kỵ": "thuy",
  "Lưu Hà": "thuy",
  "Văn Khúc": "thuy",
  "Tam Thai": "thuy",
  "Thiên Diêu": "thuy",
  "Hữu Bật": "thuy",
  "Long Trì": "thuy",
  "Thiên Hỷ": "thuy",
  "Thiên Sứ": "thuy",
  "Thiên Hư": "thuy",
  "Bác sĩ": "thuy",
  "Bác sỹ": "thuy",
  "Long Đức": "thuy",
  "Thanh Long": "thuy",
  "Thiếu Âm": "thuy",
  "Thiên Y": "thuy",

  // Hanh Hoa
  "Thái Dương": "hoa",
  "Liêm Trinh": "hoa",
  "Thiên Đức": "hoa",
  "Địa Không": "hoa",
  "Địa Kiếp": "hoa",
  "Tiểu Hao": "hoa",
  "Kiếp Sát": "hoa",
  "Thiên Giải": "hoa",
  "Điếu Khách": "hoa",
  "Thiên Việt": "hoa",
  "Thiên Quan": "hoa",
  "Thiên Hình": "hoa",
  "Trực Phù": "hoa",
  "Hỏa Tinh": "hoa",
  "Phi Liêm": "hoa",
  "Thái Tuế": "hoa",
  "Hỷ Thần": "hoa",
  "Thiếu Dương": "hoa",
  "Thiên Không": "hoa",
  "Phá Toái": "hoa",
  "Đại Hao": "hoa",
  "Phục Binh": "hoa",
  "Quan Phù": "hoa",
  "Thiên Khôi": "hoa",
  "Nguyệt Đức": "hoa",
  "Quan Phủ": "hoa",
  "Tử Phù": "hoa",
  "Thiên Mã": "hoa",
  "Tuế Phá": "hoa",
  "Lực Sỹ": "hoa",
  "Đẩu Quân": "hoa",
  "Linh Tinh": "hoa",

  // Hanh Tho
  "Thiên Phủ": "tho",
  "Tử Vi": "tho",
  "Địa Giải": "tho",
  "Thiên Trù": "tho",
  "Phúc Đức": "tho",
  "Quả Tú": "tho",
  "Phong Cáo": "tho",
  "Thiên Phúc": "tho",
  "Quốc Ấn": "tho",
  "Bệnh Phù": "tho",
  "Cô Thần": "tho",
  "Thiên Thương": "tho",
  "Lộc Tồn": "tho",
  "Tả Phù": "tho",
  "Thiên Tài": "tho",
  "Thiên Thọ": "tho",
  "Thiên Quý": "tho",

  // Hanh Moc
  "Thiên Cơ": "moc",
  "Thiên Lương": "moc",
  "Hóa Khoa": "moc",
  "Tướng Quân": "moc",
  "Đường Phù": "moc",
  "Đào Hoa": "moc",
  "Tang Môn": "moc",
  "Ân Quang": "moc",
  "Hóa Lộc": "moc",
  "Giải Thần": "moc",
  "Phượng Các": "moc",
  "Bát Tọa": "moc",
  "Hóa Quyền": "moc",
};

const NGU_HANH_CLASS: Record<NguHanh, string> = {
  hoa: "text-[#ff0000]",
  moc: "text-green-700",
  kim: "text-zinc-400",
  thuy: "text-black",
  tho: "text-amber-600",
};

const STAR_SHORT_NAME: Record<string, string> = {
  "Quan Lộc": "Quan",
  "Thiên Di": "Di",
  "Phúc Đức": "Phúc",
  "Phu Thê": "Thê",
  "Tài Bạch": "Tài",
};

const MAIN_STAR_PAIR_ORDER: Array<[string, string]> = [
  ["Tử Vi", "Thiên Phủ"],
  ["Tử Vi", "Tham Lang"],
  ["Tử Vi", "Thiên Tướng"],
  ["Tử Vi", "Thất Sát"],
  ["Tử Vi", "Phá Quân"],
  ["Liêm Trinh", "Thiên Phủ"],
  ["Vũ Khúc", "Thiên Phủ"],
  ["Vũ Khúc", "Tham Lang"],
  ["Thái Dương", "Cự Môn"],
  ["Thái Dương", "Thiên Lương"],
  ["Thái Dương", "Thái Âm"],
  ["Thiên Cơ", "Thái Âm"],
  ["Thiên Cơ", "Cự Môn"],
  ["Thiên Cơ", "Thiên Lương"],
  ["Vũ Khúc", "Thiên Tướng"],
  ["Vũ Khúc", "Thất Sát"],
  ["Vũ Khúc", "Phá Quân"],
  ["Thiên Đồng", "Thiên Lương"],
  ["Thiên Đồng", "Thái Âm"],
  ["Thiên Đồng", "Cự Môn"],
  ["Liêm Trinh", "Phá Quân"],
  ["Liêm Trinh", "Tham Lang"],
  ["Liêm Trinh", "Thiên Tướng"],
  ["Liêm Trinh", "Thất Sát"],
];

const MAIN_STAR_PAIR_LOOKUP = new Map(
  MAIN_STAR_PAIR_ORDER.map((pair) => [
    pair
      .slice()
      .sort((a, b) => a.localeCompare(b))
      .join("|"),
    pair,
  ]),
);

const CAT_TINH_PRIORITY: string[] = [
  "Tả Phù",
  "Hữu Bật",
  "Văn Xương",
  "Văn Khúc",
  "Thiên Khôi",
  "Thiên Việt",
  "Hóa Lộc",
  "Hóa Quyền",
  "Hóa Khoa",
  "Thiên Đức",
  "Phúc Đức",
  "Long Đức",
  "Nguyệt Đức",
  "Thiên Quan",
  "Thiên Phúc",
  "Thiên Quý",
  "Ân Quang",
  "Giải Thần",
  "Thiên Giải",
  "Địa Giải",
  "Lộc Tồn",
  "Thiên Lộc",
  "Thai Phụ",
  "Phong Cáo",
  "Quốc Ấn",
  "Tam Thai",
  "Bát Tọa",
  "Hồng Loan",
  "Thiên Hỷ",
  "Đào Hoa",
  "Thiên Trù",
  "Thanh Long",
  "Phượng Các",
  "Long Trì",
  "Thiên Mã",
  "Thiên Y",
];

const SAT_TINH_PRIORITY: string[] = [
  "Kình Dương",
  "Đà La",
  "Hỏa Tinh",
  "Linh Tinh",
  "Địa Không",
  "Địa Kiếp",
  "Hóa Kỵ",
  "Thiên Hình",
  "Thiên Không",
  "Thiên Khốc",
  "Thiên Hư",
  "Tang Môn",
  "Bạch Hổ",
  "Điếu Khách",
  "Bệnh Phù",
  "Tử Phù",
  "Cô Thần",
  "Quả Tú",
  "Thiên La",
  "Địa Võng",
  "Kiếp Sát",
  "Phá Toái",
  "Đại Hao",
  "Tiểu Hao",
  "Thiên Diêu",
  "Thiên Riêu",
  "Thiên Sát",
  "Thái Tuế",
  "Tướng Quân",
  "Tuế Phá",
  "Trực Phù",
  "Phi Liêm",
  "Lưu Hà",
  "Thiên Thương",
  "Quan Phù",
  "Phục Binh",
  "Quan Phủ",
  "Thiên Sứ",
  "Đẩu Quân",
];

const CAT_TINH_RANK = new Map(
  CAT_TINH_PRIORITY.map((name, idx) => [name, idx]),
);
const SAT_TINH_RANK = new Map(
  SAT_TINH_PRIORITY.map((name, idx) => [name, idx]),
);

const STAR_ALIAS_MAP: Record<string, string> = {
  "Thiên Diêu": "Thiên Riêu",
  "Thiên Y": "Thiên Yêu",
};

function tachTenSaoVaTrangThai(rawName: string) {
  const match = rawName.trim().match(/^(.*?)(?:\s*\(([MVBĐH])\))?$/u);
  return {
    tenSao: (match?.[1] ?? rawName).trim(),
    trangThai: match?.[2] as "M" | "V" | "B" | "Đ" | "H" | undefined,
  };
}

function layTenSaoDePhanLoai(rawName: string): string {
  const { tenSao } = tachTenSaoVaTrangThai(rawName);
  const boLuu = tenSao.replace(/^L\.\s*/u, "").trim();
  const saoChinh = boLuu.split(",")[0].trim();
  return STAR_ALIAS_MAP[saoChinh] ?? saoChinh;
}

function layNguHanhTheoSao(tenSao: string): NguHanh | undefined {
  const boLuu = tenSao.replace(/^L\.\s*/u, "").trim();
  const saoChinh = boLuu.split(",")[0].trim();
  return STAR_ELEMENT_MAP[saoChinh] ?? STAR_ELEMENT_MAP[saoChinh.toLowerCase()];
}

function laSaoLuu(rawName: string): boolean {
  const ten = rawName.trim();
  return /^L\.\s*/u.test(ten) || /^LN\s+/u.test(ten) || /^Lưu\s+/u.test(ten);
}

function taoMapTrangThaiSaoGoc(stars: StarInfo[]): Map<string, "M" | "V" | "B" | "Đ" | "H"> {
  const map = new Map<string, "M" | "V" | "B" | "Đ" | "H">();

  stars.forEach((star) => {
    if (laSaoLuu(star.ten)) {
      return;
    }

    const key = layTenSaoDePhanLoai(star.ten);
    const { trangThai } = tachTenSaoVaTrangThai(star.ten);
    if (key && trangThai && !map.has(key)) {
      map.set(key, trangThai);
    }
  });

  return map;
}

function timTenSaoGocTuSaoLuu(rawName: string): string {
  const { tenSao } = tachTenSaoVaTrangThai(rawName);
  const boTienToLuu = tenSao.replace(/^(?:L\.\s*|LN\s+|Lưu\s+)/u, "").trim();
  const saoChinh = boTienToLuu.split(",")[0].trim();
  return STAR_ALIAS_MAP[saoChinh] ?? saoChinh;
}

function renderTenSaoCoTrangThaiKeThua(
  star: StarInfo,
  trangThaiSaoGoc: Map<string, "M" | "V" | "B" | "Đ" | "H">,
) {
  const { tenSao, trangThai } = tachTenSaoVaTrangThai(star.ten);
  const key = layTenSaoDePhanLoai(star.ten);
  const keySaoGoc = laSaoLuu(star.ten) ? timTenSaoGocTuSaoLuu(star.ten) : undefined;
  const trangThaiHienThi =
    trangThai ??
    (laSaoLuu(star.ten)
      ? trangThaiSaoGoc.get(key) ?? (keySaoGoc ? trangThaiSaoGoc.get(keySaoGoc) : undefined)
      : undefined);

  return (
    <>
      {tenSao}
      {trangThaiHienThi ? `(${trangThaiHienThi})` : ""}
    </>
  );
}

function tachNhieuSao(stars: StarInfo[]): StarInfo[] {
  return stars.flatMap((star) => {
    const danhSachSao = star.ten
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

    if (danhSachSao.length <= 1) {
      return [star];
    }

    return danhSachSao.map((ten) => ({
      ...star,
      ten,
    }));
  });
}

function normalizeByIndex(data: TuViResponse) {
  const byIndex: Array<
    (CungInfo & { ten_cung: string; core_model: Cung }) | undefined
  > = Array.from({ length: 12 }).map(() => undefined);

  Object.entries(data.cac_cung).forEach(([tenCung, value]) => {
    const canIdx = data.can_12_cung[String(value.vi_tri)]?.can_idx ?? 0;
    byIndex[value.vi_tri] = {
      ...value,
      ten_cung: tenCung,
      core_model: {
        name: tenCung,
        chi: value.vi_tri as Chi,
        can: canIdx as Can,
        stars: (
          data.sao_theo_cung[String(value.vi_tri)] ??
          value.cac_sao ??
          []
        ).map((item) => item.ten),
      },
    };
  });

  return byIndex;
}

function starTextClass(star: StarInfo) {
  const { tenSao } = tachTenSaoVaTrangThai(star.ten);
  const nguHanh = layNguHanhTheoSao(tenSao);

  if (star.loai === "khong_vong") {
    return "text-zinc-500 font-bold";
  }

  if (nguHanh) {
    return `${NGU_HANH_CLASS[nguHanh]} font-bold`;
  }

  return "text-[#1f5d2e] font-bold";
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function chuanHoaIndex12(value: number): number {
  return ((value % 12) + 12) % 12;
}

function doiGioDuongSangChiThuTu(gioDuong: number): number {
  // 23h-1h: Ty (1), 1h-3h: Suu (2), ... 21h-23h: Hoi (12)
  if (gioDuong === 23) {
    return 1;
  }
  return Math.floor((gioDuong + 1) / 2) + 1;
}

function laGioiTinhNam(gioiTinh: string): boolean {
  return gioiTinh.trim().toLowerCase().includes("nam");
}

function tachChiIdxTuCanChi(canChiText: string): number | undefined {
  return parseCanChi(canChiText)?.chiIdx;
}

function timCungKhoiTieuVanTheoNamSinhChi(namSinhChiIdx: number): number {
  // Thân-Tý-Thìn -> Tuất; Tỵ-Dậu-Sửu -> Mùi; Dần-Ngọ-Tuất -> Thìn; Hợi-Mão-Mùi -> Sửu
  if ([8, 0, 4].includes(namSinhChiIdx)) {
    return 10;
  }
  if ([5, 9, 1].includes(namSinhChiIdx)) {
    return 7;
  }
  if ([2, 6, 10].includes(namSinhChiIdx)) {
    return 4;
  }
  return 1;
}

function taoDuLieuTieuVanTheoCung(data: TuViResponse): {
  chiTieuVanTheoCung: Record<number, string>;
  tieuVanIdx: number;
} {
  const chiTieuVanTheoCung: Record<number, string> = {};
  const namSinhChiIdx = tachChiIdxTuCanChi(data.can_chi.nam.can_chi);
  const namXemChiIdx = tachChiIdxTuCanChi(data.can_chi_nam_xem_han);

  if (namSinhChiIdx === undefined || namXemChiIdx === undefined) {
    return {
      chiTieuVanTheoCung,
      tieuVanIdx: data.cung_menh_idx,
    };
  }

  const cungKhoi = timCungKhoiTieuVanTheoNamSinhChi(namSinhChiIdx);
  const huong = laGioiTinhNam(data.gioi_tinh) ? 1 : -1;
  let tieuVanIdx = cungKhoi;

  for (let buoc = 0; buoc < 12; buoc += 1) {
    const cungIdx = chuanHoaIndex12(cungKhoi + huong * buoc);
    const chiIdx = (namSinhChiIdx + buoc) % 12;
    chiTieuVanTheoCung[cungIdx] = DIA_CHI_VN[chiIdx];

    if (chiIdx === namXemChiIdx) {
      tieuVanIdx = cungIdx;
    }
  }

  return {
    chiTieuVanTheoCung,
    tieuVanIdx,
  };
}

function taoMapVanThangTheoCung(
  data: TuViResponse,
  tieuVanIdx: number,
): Record<number, number> {
  const map: Record<number, number> = {};

  // Thang 1: bat dau tai cung Tieu Van nam xem,
  // lui theo thang sinh am, sau do tien theo gio sinh (dia chi).
  const buocLuiThangSinh = Math.max(1, data.am_lich.thang_am) - 1;
  const buocTienGioSinh = doiGioDuongSangChiThuTu(data.gio_sinh) - 1;
  const cungThangMot = chuanHoaIndex12(
    tieuVanIdx - buocLuiThangSinh + buocTienGioSinh,
  );

  for (let thang = 1; thang <= 12; thang += 1) {
    // Sau khi co cung Thang 1, cac thang con lai an thuan theo chieu kim dong ho.
    const vanThangIdx = chuanHoaIndex12(cungThangMot + thang - 1);
    map[vanThangIdx] = thang;
  }

  return map;
}

function tachNgayThangNamDuong(ngayDuongLich: string) {
  const match = ngayDuongLich.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/u);
  if (!match) {
    return { ngay: 0, thang: 0, nam: 0 };
  }
  return {
    ngay: Number(match[1]),
    thang: Number(match[2]),
    nam: Number(match[3]),
  };
}

function timViTriCungTheoTen(
  data: TuViResponse,
  tenCung: string,
): number | undefined {
  return data.cac_cung[tenCung]?.vi_tri;
}

function timDiemNeoCungTrenLayout(cungIdx: number): Point | undefined {
  const cell = PALACE_LAYOUT.find((item) => item.idx === cungIdx);
  if (!cell) {
    return undefined;
  }

  const x0 = ((cell.col - 1) / 4) * 100;
  const x1 = (cell.col / 4) * 100;
  const y0 = ((cell.row - 1) / 4) * 100;
  const y1 = (cell.row / 4) * 100;
  const xMid = (x0 + x1) / 2;
  const yMid = (y0 + y1) / 2;

  // Quy tắc neo đỉnh tam giác theo vị trí cung trên khung lá số.
  // - Cạnh trên: lấy trung điểm cạnh dưới
  // - Cạnh dưới: lấy trung điểm cạnh trên
  // - Cạnh phải: lấy trung điểm cạnh trái
  // - Cạnh trái: lấy trung điểm cạnh phải
  // - Góc: lấy góc ngược lại của cung
  const isTop = cell.row === 1;
  const isBottom = cell.row === 4;
  const isLeft = cell.col === 1;
  const isRight = cell.col === 4;

  const isCorner = (isTop || isBottom) && (isLeft || isRight);
  if (isCorner) {
    if (isTop && isLeft) {
      return { x: x1, y: y1 }; // top-left -> bottom-right
    }
    if (isTop && isRight) {
      return { x: x0, y: y1 }; // top-right -> bottom-left
    }
    if (isBottom && isLeft) {
      return { x: x1, y: y0 }; // bottom-left -> top-right
    }
    return { x: x0, y: y0 }; // bottom-right -> top-left
  }

  if (isTop) {
    return { x: xMid, y: y1 };
  }
  if (isBottom) {
    return { x: xMid, y: y0 };
  }
  if (isRight) {
    return { x: x0, y: yMid };
  }
  if (isLeft) {
    return { x: x1, y: yMid };
  }

  // Fallback an toàn trong trường hợp layout thay đổi.
  return { x: xMid, y: yMid };
}

function taoChuoiPoints(points: [Point, Point, Point]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

function quyDoiSangKhungTrungTam(
  points: [Point, Point, Point],
): [Point, Point, Point] {
  // O trung tam nam trong vung x:[25..75], y:[25..75] cua toan bo la so.
  return points.map((p) => ({
    x: (p.x - 25) * 2,
    y: (p.y - 25) * 2,
  })) as [Point, Point, Point];
}

function parseCanChi(
  canChiText: string,
): { canIdx: number; chiIdx: number } | undefined {
  const parts = canChiText.trim().split(/\s+/u);
  if (parts.length < 2) {
    return undefined;
  }
  const canIdx = THIEN_CAN_VN.indexOf(parts[0]);
  const chiIdx = DIA_CHI_VN.indexOf(parts[parts.length - 1]);
  if (canIdx < 0 || chiIdx < 0) {
    return undefined;
  }
  return { canIdx, chiIdx };
}

function layBanMenhTrungTam(data: TuViResponse): string {
  const canChiNam = data.can_chi.nam.can_chi?.trim();
  if (canChiNam && NAP_AM_BY_CAN_CHI_NAM[canChiNam]) {
    return NAP_AM_BY_CAN_CHI_NAM[canChiNam];
  }

  return data.can_chi.ngu_hanh_ban_menh?.hanh ?? "--";
}

function laMenhThuan(amDuongMenh: string): boolean {
  return amDuongMenh.includes("Dương Nam") || amDuongMenh.includes("Âm Nữ");
}

function layClassNguHanhTheoDiaChi(diaChi: string): string {
  const hanh = NGU_HANH_CAN_CHI[diaChi.trim()];
  return hanh ? NGU_HANH_CLASS[hanh] : "text-[#8f6800]";
}

function sapXepChinhTinhTheoCap(stars: StarInfo[]): StarInfo[] {
  if (stars.length !== 2) {
    return stars;
  }

  const tenSao = stars.map((star) => tachTenSaoVaTrangThai(star.ten).tenSao);
  const key = tenSao
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .join("|");
  const pair = MAIN_STAR_PAIR_LOOKUP.get(key);
  if (!pair) {
    return stars;
  }

  const rank = new Map<string, number>([
    [pair[0], 0],
    [pair[1], 1],
  ]);

  return [...stars].sort((a, b) => {
    const tenA = tachTenSaoVaTrangThai(a.ten).tenSao;
    const tenB = tachTenSaoVaTrangThai(b.ten).tenSao;
    return (rank.get(tenA) ?? 99) - (rank.get(tenB) ?? 99);
  });
}

function vietTatCan(tenCan: string): string {
  if (!tenCan) {
    return "";
  }
  if (tenCan.startsWith("Nh")) {
    return "N";
  }
  return tenCan[0]?.toUpperCase() ?? "";
}

function taoMapDaiHanTheoCung(data: TuViResponse): Record<number, string> {
  const map: Record<number, string> = {};
  const cuc = data.cuc_menh?.so_cuc;
  if (!Number.isFinite(cuc)) {
    return map;
  }

  const thuan = laMenhThuan(data.am_duong_menh);
  const huong = thuan ? 1 : -1;

  for (let i = 0; i < 12; i += 1) {
    const cungIdx = (data.cung_menh_idx + huong * i + 120) % 12;
    const tuoiBatDau = Number(cuc) + i * 10;
    map[cungIdx] = `${tuoiBatDau}`;
  }

  return map;
}

function timCacCungCoSao(
  data: TuViResponse,
  tenSao: "Tuần" | "Triệt",
): number[] {
  const kq: number[] = [];

  Object.entries(data.sao_theo_cung).forEach(([idxText, stars]) => {
    const idx = Number(idxText);
    if (!Number.isInteger(idx)) {
      return;
    }

    const coSao = stars.some((star) => {
      const ten = layTenSaoDePhanLoai(star.ten);
      return ten === tenSao;
    });

    if (coSao) {
      kq.push(idx);
    }
  });

  return kq.sort((a, b) => a - b);
}

function tinhNhanKhongVongTheoCanh(
  data: TuViResponse,
  tenSao: "Tuần" | "Triệt",
): KhongVongEdgeLabel | undefined {
  const dsCung = timCacCungCoSao(data, tenSao);
  if (dsCung.length < 2) {
    return undefined;
  }

  const a = PALACE_LAYOUT.find((item) => item.idx === dsCung[0]);
  const b = PALACE_LAYOUT.find((item) => item.idx === dsCung[1]);
  if (!a || !b) {
    return undefined;
  }

  const laGoc = (cell: PalaceCell) =>
    (cell.row === 1 || cell.row === 4) && (cell.col === 1 || cell.col === 4);
  const khongCoCungNaoOGoc = !laGoc(a) && !laGoc(b);

  // Hai cung chung cùng hàng -> cạnh dọc giữa 2 ô.
  if (a.row === b.row && Math.abs(a.col - b.col) === 1) {
    const xBoundary = Math.max(a.col, b.col) - 1;

    // Trường hợp đặc biệt theo yêu cầu:
    // - Cặp cung ở cạnh trên (không có cung góc): đặt nhãn tại góc dưới của cạnh giao.
    // - Cặp cung ở cạnh dưới (không có cung góc): đặt nhãn tại góc trên của cạnh giao.
    if (khongCoCungNaoOGoc && a.row === 1) {
      return {
        ten: tenSao,
        xPct: xBoundary * 25,
        yPct: 25,
        huong: "goc-duoi",
      };
    }

    if (khongCoCungNaoOGoc && a.row === 4) {
      return {
        ten: tenSao,
        xPct: xBoundary * 25,
        yPct: 75,
        huong: "goc-tren",
      };
    }

    return {
      ten: tenSao,
      xPct: xBoundary * 25,
      // Các trường hợp còn lại: trung điểm cạnh giao giữa hai cung.
      yPct: (a.row - 0.5) * 25,
      huong: "doc",
    };
  }

  // Hai cung chung cùng cột -> cạnh ngang giữa 2 ô.
  if (a.col === b.col && Math.abs(a.row - b.row) === 1) {
    const yBoundary = Math.max(a.row, b.row) - 1;
    return {
      ten: tenSao,
      // Các trường hợp còn lại: trung điểm cạnh giao giữa hai cung.
      xPct: (a.col - 0.5) * 25,
      yPct: yBoundary * 25,
      huong: "ngang",
    };
  }

  // Fallback: lấy trung điểm tâm 2 ô.
  const ax = (a.col - 0.5) * 25;
  const ay = (a.row - 0.5) * 25;
  const bx = (b.col - 0.5) * 25;
  const by = (b.row - 0.5) * 25;

  return {
    ten: tenSao,
    xPct: (ax + bx) / 2,
    yPct: (ay + by) / 2,
    huong: "fallback",
  };
}

function PalaceBox({
  topLeft,
  topRight,
  title,
  bottomLeft,
  diaChi,
  bottomHint,
  stars,
  isMenh,
  isThan,
  isTieuVan,
}: {
  topLeft: string;
  topRight?: string;
  title: string;
  bottomLeft?: string;
  diaChi: string;
  bottomHint?: string;
  stars: StarInfo[];
  isMenh: boolean;
  isThan: boolean;
  isTieuVan: boolean;
}) {
  const normalizedStars = React.useMemo(() => tachNhieuSao(stars), [stars]);
  const mainStars = normalizedStars.filter(
    (star) => star.loai === "chinh_tinh",
  );
  const trangSinhStars = normalizedStars.filter(
    (star) => star.loai === "vong_trang_sinh",
  );
  const subStars = normalizedStars.filter(
    (star) =>
      star.loai !== "chinh_tinh" &&
      star.loai !== "vong_trang_sinh" &&
      star.loai !== "khong_vong",
  );
  const subStarsWithMeta = subStars.map((star, idx) => {
    const key = layTenSaoDePhanLoai(star.ten);
    return { star, idx, key };
  });

  const catStars = subStarsWithMeta
    .filter((item) => CAT_TINH_RANK.has(item.key))
    .sort((a, b) => {
      const ra = CAT_TINH_RANK.get(a.key) ?? 999;
      const rb = CAT_TINH_RANK.get(b.key) ?? 999;
      return ra - rb || a.idx - b.idx;
    })
    .map((item) => item.star);

  const satStars = subStarsWithMeta
    .filter((item) => SAT_TINH_RANK.has(item.key))
    .sort((a, b) => {
      const ra = SAT_TINH_RANK.get(a.key) ?? 999;
      const rb = SAT_TINH_RANK.get(b.key) ?? 999;
      return ra - rb || a.idx - b.idx;
    })
    .map((item) => item.star);

  const neutralStars = subStarsWithMeta
    .filter(
      (item) => !CAT_TINH_RANK.has(item.key) && !SAT_TINH_RANK.has(item.key),
    )
    .map((item) => item.star);

  const leftColumnStarsBase = [...catStars, ...neutralStars];
  const leftColumnStars = [
    ...leftColumnStarsBase.filter((star) => !laSaoLuu(star.ten)),
    ...leftColumnStarsBase.filter((star) => laSaoLuu(star.ten)),
  ];
  const rightColumnStars = [
    ...satStars.filter((star) => !laSaoLuu(star.ten)),
    ...satStars.filter((star) => laSaoLuu(star.ten)),
  ];
  const mainStarsHienThi = sapXepChinhTinhTheoCap(mainStars);
  const trangThaiSaoGoc = React.useMemo(
    () => taoMapTrangThaiSaoGoc(normalizedStars),
    [normalizedStars],
  );
  const tenCungChoThan = isThan ? (STAR_SHORT_NAME[title] ?? title) : title;
  const palaceTitle = isThan
    ? `${tenCungChoThan.toUpperCase()} <THÂN>`
    : title.toUpperCase();
  const topLeftClass = layClassNguHanhTheoDiaChi(diaChi);

  return (
    <div className="flex h-full flex-col border-[0.1px] border-zinc-950 bg-[#e8e7e2] px-1 py-3">
      <div className="relative min-h-3 leading-3">
        <div
          className={cn(
            "absolute left-0 top-0 text-[11px] font-bold",
            topLeftClass,
          )}
        >
          {topLeft}
        </div>
        <div className="absolute right-0 top-0 text-right text-[11px] font-bold text-[#0f4c81]">
          {topRight ?? ""}
        </div>
        <div className="px-8 text-center text-[12px] leading-3 font-bold text-black white-space-nowrap">
          <span className="inline-block max-w-full wrap-break-word">
            {palaceTitle}
          </span>
        </div>
      </div>

      <div className="mt-1.5 min-h-10 text-center text-[14px] leading-4 font-bold text-black">
        {mainStarsHienThi.map((star) => (
          <div key={star.ten} className={starTextClass(star)}>
            {renderTenSaoCoTrangThaiKeThua(star, trangThaiSaoGoc)}
          </div>
        ))}
      </div>

      <div className="mt-0.5 grow overflow-auto text-[12px] leading-3.25">
        {subStars.length ? (
          <div className="grid grid-cols-2 gap-x-0 gap-y-0">
            <div className="space-y-0">
              {leftColumnStars.map((star, idx) => (
                <div
                  key={`cat-${star.ten}-${idx}`}
                  className={starTextClass(star)}
                >
                  {renderTenSaoCoTrangThaiKeThua(star, trangThaiSaoGoc)}
                </div>
              ))}
            </div>
            <div className="space-y-0">
              {rightColumnStars.map((star, idx) => (
                <div
                  key={`sat-${star.ten}-${idx}`}
                  className={starTextClass(star)}
                >
                  {renderTenSaoCoTrangThaiKeThua(star, trangThaiSaoGoc)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-zinc-400"> </div>
        )}
      </div>
      <div className="mt-1 grid grid-cols-3 items-center text-[11px] font-semibold text-black">
        <span
          className={cn(
            "justify-self-start text-[11px]",
            isTieuVan
              ? "rounded bg-[#FF0000] px-1 py-px font-bold text-white"
              : "text-[#0f4c81]",
          )}
        >
          {bottomLeft ?? diaChi}
        </span>
        <span className="justify-self-center text-center text-[11px] font-bold text-zinc-800">
          {trangSinhStars.length
            ? (() => {
                const { tenSao } = tachTenSaoVaTrangThai(trangSinhStars[0].ten);
                return tenSao;
              })()
            : ""}
        </span>
        <span className="justify-self-end">{bottomHint ?? ""}</span>
      </div>
    </div>
  );
}

export function TuViChart({ data }: { data: TuViResponse }) {
  const byIndex = React.useMemo(() => normalizeByIndex(data), [data]);
  const ngayThangNamDuong = React.useMemo(
    () => tachNgayThangNamDuong(data.ngay_sinh_duong_lich),
    [data.ngay_sinh_duong_lich],
  );
  const tuoi =
    ngayThangNamDuong.nam > 0
      ? Math.max(0, data.nam_xem_han - ngayThangNamDuong.nam + 1)
      : undefined;

  const quanLocIdx = React.useMemo(
    () => timViTriCungTheoTen(data, "Quan Lộc"),
    [data],
  );
  const taiBachIdx = React.useMemo(
    () => timViTriCungTheoTen(data, "Tài Bạch"),
    [data],
  );

  const diemMenh = React.useMemo(
    () => timDiemNeoCungTrenLayout(data.cung_menh_idx),
    [data.cung_menh_idx],
  );
  const diemQuanLoc = React.useMemo(
    () =>
      quanLocIdx !== undefined
        ? timDiemNeoCungTrenLayout(quanLocIdx)
        : undefined,
    [quanLocIdx],
  );
  const diemTaiBach = React.useMemo(
    () =>
      taiBachIdx !== undefined
        ? timDiemNeoCungTrenLayout(taiBachIdx)
        : undefined,
    [taiBachIdx],
  );

  const tamGiacNeoDungCung = React.useMemo(() => {
    if (!diemMenh || !diemQuanLoc || !diemTaiBach) {
      return undefined;
    }

    // Giữ nguyên 3 đỉnh đúng tại điểm neo của các cung.
    return [diemMenh, diemQuanLoc, diemTaiBach] as [Point, Point, Point];
  }, [diemMenh, diemQuanLoc, diemTaiBach]);

  const pointsTamGiac = React.useMemo(
    () => (tamGiacNeoDungCung ? taoChuoiPoints(tamGiacNeoDungCung) : ""),
    [tamGiacNeoDungCung],
  );
  const pointsTamGiacTrungTam = React.useMemo(() => {
    if (!tamGiacNeoDungCung) {
      return "";
    }
    return taoChuoiPoints(quyDoiSangKhungTrungTam(tamGiacNeoDungCung));
  }, [tamGiacNeoDungCung]);

  const daiHanTheoCung = React.useMemo(
    () => taoMapDaiHanTheoCung(data),
    [data],
  );
  const duLieuTieuVan = React.useMemo(
    () => taoDuLieuTieuVanTheoCung(data),
    [data],
  );
  const { chiTieuVanTheoCung, tieuVanIdx } = duLieuTieuVan;
  const vanThangTheoCung = React.useMemo(
    () => taoMapVanThangTheoCung(data, tieuVanIdx),
    [data, tieuVanIdx],
  );
  const nhanTuan = React.useMemo(
    () => tinhNhanKhongVongTheoCanh(data, "Tuần"),
    [data],
  );
  const nhanTriet = React.useMemo(
    () => tinhNhanKhongVongTheoCanh(data, "Triệt"),
    [data],
  );
  const nhanKhongVong = [nhanTuan, nhanTriet].filter(
    Boolean,
  ) as KhongVongEdgeLabel[];
  const banMenhTrungTam = React.useMemo(() => layBanMenhTrungTam(data), [data]);

  return (
    <div className="w-full bg-[#000000]">
      <div className="relative grid aspect-3/4 w-full grid-cols-4 grid-rows-4 border-[0.1px] border-zinc-950">
        {PALACE_LAYOUT.map((item) => {
          const palace = byIndex[item.idx];
          const stars =
            data.sao_theo_cung[String(item.idx)] ?? palace?.cac_sao ?? [];
          const canCung =
            palace?.thien_can ?? data.can_12_cung[String(item.idx)]?.can ?? "";
          const chiCung = palace?.dia_chi ?? "";
          const topLeft = `${vietTatCan(canCung)}.${chiCung}`;
          const thangVan = vanThangTheoCung[item.idx];
          const bottomRight = Number.isFinite(thangVan)
            ? `t.${thangVan}`
            : "";

          return (
            <div
              key={item.idx}
              className="relative z-10"
              style={{ gridColumnStart: item.col, gridRowStart: item.row }}
            >
              <PalaceBox
                title={palace?.ten_cung ?? `Cung ${item.idx}`}
                diaChi={palace?.dia_chi ?? ""}
                topLeft={topLeft}
                topRight={daiHanTheoCung[item.idx]}
                bottomLeft={chiTieuVanTheoCung[item.idx] ?? ""}
                bottomHint={bottomRight}
                stars={stars}
                isMenh={item.idx === data.cung_menh_idx}
                isThan={item.idx === data.cung_than_idx}
                isTieuVan={item.idx === tieuVanIdx}
              />
            </div>
          );
        })}

        {nhanKhongVong.length > 0 ? (
          <div className="pointer-events-none absolute inset-0 z-50">
            {nhanKhongVong.map((label) => (
              <div
                key={label.ten}
                className="absolute -translate-x-1/2 -translate-y-1/2 bg-black px-2 py-px text-[12px] font-semibold text-white"
                style={{
                  left: `${label.xPct}%`,
                  top: `${label.yPct}%`,
                  // transform:
                  //   label.huong === "goc-duoi"
                  //     ? "translate(-50%, -100%)"
                  //     : label.huong === "goc-tren"
                  //       ? "translate(-50%, 0%)"
                  //       : label.huong === "doc"
                  //       ? "translate(-50%, -50%)"
                  //       : label.huong === "ngang"
                  //         ? "translate(-50%, -50%)"
                  //         : "translate(-50%, -50%)",
                }}
              >
                {label.ten}
              </div>
            ))}
          </div>
        ) : null}

        <div className="relative z-40 col-start-2 row-start-2 col-span-2 row-span-2 flex h-full flex-col overflow-hidden border-[0.1px] border-zinc-950 bg-[#e7e8e2] px-10 py-4 sm:px-10 sm:py-4 lg:px-10 lg:py-4">
          <div
            className="m-auto h-[70%] item-center justify-item-center pointer-events-none absolute inset-0 z-0 bg-center bg-no-repeat bg-contain opacity-5"
            style={{ backgroundImage: "url('/lasotuvi.png')" }}
            aria-hidden="true"
          />

          {tamGiacNeoDungCung ? (
            <div className="pointer-events-none absolute inset-0 z-10">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon
                  points={pointsTamGiacTrungTam}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="0.2"
                  strokeOpacity="0.9"
                  strokeLinejoin="round"
                  style={{ filter: "blur(0.1px)" }}
                />
              </svg>
            </div>
          ) : null}

          <div className="relative z-10 flex h-full flex-col">
            <h3 className="mb-0 text-center text-[18px] font-bold text-[#ff0c0c] sm:text-[18px] lg:text-[18px]">
              TỬ VI BÁT NHÃ
            </h3>
            <span className="text-center text-[13px] font-bold text-green-900 sm:text-[13px] lg:text-[13px]">https://tuvibatnha.vn</span>
            {/* <h3 className = "text-center text-[14px] text-[#000000] mb-1 font-bold"></h3> */}
            <div className="flex items-center">
              <div className="grow border-b border-blue-700"></div>
              <div className="grow border-b border-blue-700"></div>
            </div>

            <h3 className="mt-3 text-center text-[17px] font-bold text-[#0004ff] uppercase sm:mt-3 sm:text-[17px] lg:mt-3 lg:text-[17px]">
              Lá Số Tử Vi
            </h3>
            <div className="mt-3 flex flex-1 items-center sm:mt-3 lg:mt-3">
              <div className="mx-4 w-full max-w-240 space-y-1 text-[13px] leading-4 sm:space-y-1 sm:text-[13px] sm:leading-4 lg:text-[13px] lg:leading-4">
                <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 sm:gap-x-3 lg:gap-x-3">
                  <div className="grid grid-cols-[60px_1fr] items-center gap-x-6 sm:grid-cols-[60px_1fr] sm:gap-x-6 lg:grid-cols-[60px_1fr] lg:gap-x-6">
                    <span className="font-semibold text-[#000000]">
                      Họ tên:
                    </span>
                    <span className="text-[#0004ff]">
                      {data.ho_ten}
                    </span>
                  </div>
                  <span />
                </div>

                <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 sm:gap-x-3 lg:gap-x-3">
                  <div className="grid grid-cols-[60px_1fr] items-center gap-x-6 tabular-nums sm:grid-cols-[60px_1fr] sm:gap-x-6 lg:grid-cols-[60px_1fr] lg:gap-x-6">
                    <span className="font-semibold text-[#000000]">Năm:</span>
                    <span className="text-[#0004ff]">
                      {ngayThangNamDuong.nam || "--"}
                    </span>
                  </div>
                  <span className="w-10 justify-self-start whitespace-nowrap text-left text-[#0004ff] sm:w-13 lg:w-13">
                    {data.can_chi.nam.can_chi}
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 sm:gap-x-3 lg:gap-x-3">
                  <div className="grid grid-cols-[60px_1fr] items-center gap-x-6 tabular-nums sm:grid-cols-[60px_1fr] sm:gap-x-6 lg:grid-cols-[60px_1fr] lg:gap-x-6">
                    <span className="font-semibold text-[#000000]">Tháng:</span>
                    <span className="text-[#0004ff]">
                      {pad2(ngayThangNamDuong.thang)} (
                      {pad2(data.am_lich.thang_am)})
                    </span>
                  </div>
                  <span className="w-10 justify-self-start whitespace-nowrap text-left text-[#0004ff] sm:w-12 lg:w-13">
                    {data.can_chi.thang.can_chi}
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 sm:gap-x-3 lg:gap-x-3">
                  <div className="grid grid-cols-[60px_1fr] items-center gap-x-6 tabular-nums sm:grid-cols-[60px_1fr] sm:gap-x-6 lg:grid-cols-[60px_1fr] lg:gap-x-6">
                    <span className="font-semibold text-[#000000]">Ngày:</span>
                    <span className="text-[#0004ff]">
                      {pad2(ngayThangNamDuong.ngay)} (
                      {pad2(data.am_lich.ngay_am)})
                    </span>
                  </div>
                  <span className="w-10 justify-self-start whitespace-nowrap text-left text-[#0004ff] sm:w-12 lg:w-13">
                    {data.can_chi.ngay.can_chi}
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 sm:gap-x-3 lg:gap-x-3">
                  <div className="grid grid-cols-[60px_1fr] items-center gap-x-6 tabular-nums sm:grid-cols-[60px_1fr] sm:gap-x-6 lg:grid-cols-[60px_1fr] lg:gap-x-6">
                    <span className="font-semibold text-[#000000]">Giờ:</span>
                    <span className="text-[#0004ff]">
                      {pad2(data.gio_sinh)} giờ {pad2(data.phut_sinh)} phút
                    </span>
                  </div>
                  <span className="w-10 justify-self-start whitespace-nowrap text-left text-[#0004ff] sm:w-12 lg:w-13">
                    {data.can_chi.gio.can_chi}
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 sm:gap-x-3 lg:gap-x-3">
                  <div className="grid grid-cols-[60px_1fr] items-center gap-x-6 tabular-nums sm:grid-cols-[60px_1fr] sm:gap-x-6 lg:grid-cols-[60px_1fr] lg:gap-x-6">
                    <span className="font-semibold text-[#000000]">Năm xem:</span>
                    <span className="text-[#0004ff]">
                      {data.nam_xem_han}
                    </span>
                  </div>
                  <span className="w-10 justify-self-start whitespace-nowrap text-left text-[#0004ff] sm:w-12 lg:w-13">
                    {data.can_chi_nam_xem_han}
                  </span>
                </div>

                <div className="grid grid-cols-[60px_1fr] items-center gap-x-6 sm:grid-cols-[60px_1fr] sm:gap-x-6 lg:grid-cols-[60px_1fr] lg:gap-x-6">
                  <span className="font-semibold">Tuổi:</span>
                  <span className="text-[#0004ff]">
                    {tuoi ?? "--"} tuổi
                  </span>
                </div>

                <div className="grid grid-cols-[60px_1fr] items-center gap-x-6 pt-1.5 sm:grid-cols-[60px_1fr] sm:gap-x-6 sm:pt-2 lg:grid-cols-[60px_1fr] lg:gap-x-6 lg:pt-3">
                  <span className="font-semibold whitespace-nowrap">
                    Âm Dương:
                  </span>
                  <span className="text-[#0004ff]">
                    {data.am_duong_menh}
                  </span>
                </div>

                <div className="grid grid-cols-[60px_1fr] items-center gap-x-6 sm:grid-cols-[60px_1fr] sm:gap-x-6 lg:grid-cols-[60px_1fr] lg:gap-x-6">
                  <span className="font-semibold">Mệnh:</span>
                  <span className="text-[#0004ff]">
                    {banMenhTrungTam}
                  </span>
                </div>

                <div className="grid grid-cols-[60px_1fr] items-center gap-x-6 sm:grid-cols-[60px_1fr] sm:gap-x-6 lg:grid-cols-[60px_1fr] lg:gap-x-6">
                  <span className="font-semibold text-[#000000]">Cục:</span>
                  <span className="text-[#0004ff]">
                    {data.cuc_menh.ten_cuc}
                  </span>
                </div>

                <div className="grid grid-cols-[60px_1fr] items-center gap-x-6 pt-1.5 sm:grid-cols-[60px_1fr] sm:gap-x-6 sm:pt-2 lg:grid-cols-[60px_1fr] lg:gap-x-6 lg:pt-3">
                  <span className="font-semibold text-[#000000]"></span>
                  <span className="text-[#0004ff]">
                    {data.cuc_menh.ten_cuc}
                  </span>
                </div>

                <div className="grid grid-cols-[60px_1fr] items-center gap-x-6 sm:grid-cols-[60px_1fr] sm:gap-x-6 lg:grid-cols-[60px_1fr] lg:gap-x-6">
                  <span className="font-semibold text-[#000000]"></span>
                  <span className="text-[#0004ff]">
                    {data.cuc_menh.ten_cuc}
                  </span>
                </div>

                <div className="grid grid-cols-[60px_1fr] items-center gap-x-6 sm:grid-cols-[60px_1fr] sm:gap-x-6 lg:grid-cols-[60px_1fr] lg:gap-x-6">
                  <span className="font-semibold text-[#000000]"></span>
                  <span className="text-[#0004ff]">
                    {data.cuc_menh.ten_cuc}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-auto pt-1 text-center text-[12px] font-bold text-[#ff0000] sm:pt-1.5 sm:text-[12px] lg:pt-2 lg:text-[12px]">
              <span>Sđt và Zalo duy nhất: 0922.62.0000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
