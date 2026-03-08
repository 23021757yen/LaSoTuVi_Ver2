import Image from "next/image";

export function Footer() {
  return (
    <footer id="lien-he" className="bg-[#DA251D] text-white">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-5 md:pt-16 md:pb-5">
        <div className="grid gap-10 md:grid-cols-[3fr_1fr_1fr]">
          <div>
            <div className="text-2xl leading-none font-black">LÁ SỐ TỬ VI</div>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/90">
              Khám phá vận mệnh và tìm hiểu bản thân qua lá số tử vi cổ truyền. Chúng
              tôi cung cấp dịch vụ xem lá số chính xác, chi tiết và dễ hiểu để giúp bạn
              định hướng cuộc sống tốt hơn. chủ
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20"
                aria-label="Facebook"
              >
                <Image src="/facebook.png" alt="" width={18} height={18} />
              </a>
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20"
                aria-label="TikTok"
              >
                <Image src="/tiktok.png" alt="" width={18} height={18} />
              </a>
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20"
                aria-label="YouTube"
              >
                <Image src="/youtube.png" alt="" width={18} height={18} />
              </a>
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold">Liên kết nhanh</div>
            <div className="mt-4 grid gap-2.5 text-sm text-white/90">
              <a className="hover:text-white" href="#top">Trang chủ</a>
              <a className="hover:text-white" href="#tinh-nang">Tính năng</a>
              <a className="hover:text-white" href="#dien-dan">Diễn đàn</a>
              <a className="hover:text-white" href="#ve-chung-toi">Về chúng tôi</a>
              <a className="hover:text-white" href="#lien-he">Liên hệ</a>
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold">Hỗ trợ</div>
            <div className="mt-4 grid gap-2.5 text-sm text-white/90">
              <a className="hover:text-white" href="#">Chính sách bảo mật</a>
              <a className="hover:text-white" href="#">Điều khoản sử dụng</a>
              <a className="hover:text-white" href="#">Trợ giúp</a>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-white/90">
          © 2026 Lá Số Tử Vi. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
