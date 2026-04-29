"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type InfoItem = {
  date: string;
  location: string;
};

type AttentionItem = {
  title: string;
  content: string;
  postSlug: string;
};

type HeroSlide = {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

type MapItem = {
  title: string;
  link: string;
  buttonText: string;
  publishedAt: string;
};

const emptySlide = (): HeroSlide => ({
  image: "",
  title: "",
  description: "",
  buttonText: "Know More",
  buttonLink: "#",
});

export default function AdminHomePage() {
  const [loading, setLoading] = useState(false);

  const [siteName, setSiteName] = useState("");
  const [headerLogo, setHeaderLogo] = useState("");
  const [partnerLogos, setPartnerLogos] = useState<string[]>(["", "", "", ""]);

  const [welcomeTitle, setWelcomeTitle] = useState("Welcome to IMRWG");
  const [welcomeText, setWelcomeText] = useState("");
  const [marqueeText, setMarqueeText] = useState("");

  const [heroImage, setHeroImage] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroButtonText, setHeroButtonText] = useState("");
  const [heroButtonLink, setHeroButtonLink] = useState("");

  const [footerLogo, setFooterLogo] = useState("");

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([emptySlide()]);

  const [infoItems, setInfoItems] = useState<InfoItem[]>([
    { date: "", location: "" },
  ]);

  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>([
    { title: "", content: "", postSlug: "" },
  ]);
  const [footerMailingText, setFooterMailingText] = useState("");
  const [footerContactText, setFooterContactText] = useState("");
  const [footerSocialText, setFooterSocialText] = useState("");

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/home`);
      const result = await res.json();

      console.log("HOME GET:", result);

      const data = result?.data;
      if (!data) return;

      setSiteName(data.siteName || "");
      setHeaderLogo(data.headerLogo || "");
      setFooterLogo(data.footerLogo || "");

      setPartnerLogos(
        Array.isArray(data.partnerLogos) && data.partnerLogos.length > 0
          ? [...data.partnerLogos, "", "", "", ""].slice(0, 4)
          : ["", "", "", ""]
      );

      setWelcomeTitle(data.welcomeTitle || "Welcome to IMRWG");
      setWelcomeText(data.welcomeText || "");
      setMarqueeText(data.marqueeText || "");

      setHeroImage(data.heroImage || "");
      setHeroTitle(data.heroTitle || "");
      setHeroDescription(data.heroDescription || "");
      setHeroButtonText(data.heroButtonText || "");
      setHeroButtonLink(data.heroButtonLink || "");

      if (Array.isArray(data.heroSlides) && data.heroSlides.length > 0) {
        setHeroSlides(
          data.heroSlides.map((slide: Partial<HeroSlide>) => ({
            image: slide.image || "",
            title: slide.title || "",
            description: slide.description || "",
            buttonText: slide.buttonText || "Know More",
            buttonLink: slide.buttonLink || "#",
          }))
        );
      } else if (data.heroImage) {
        setHeroSlides([
          {
            image: data.heroImage || "",
            title: data.heroTitle || "",
            description: data.heroDescription || "",
            buttonText: data.heroButtonText || "Know More",
            buttonLink: data.heroButtonLink || "#",
          },
        ]);
      } else {
        setHeroSlides([emptySlide()]);
      }

      if (Array.isArray(data.infoItems) && data.infoItems.length > 0) {
        setInfoItems(
          data.infoItems.map((item: Partial<InfoItem>) => ({
            date: item.date || "",
            location: item.location || "",
          }))
        );
      } else {
        setInfoItems([{ date: "", location: "" }]);
      }

      if (Array.isArray(data.attentionItems) && data.attentionItems.length > 0) {
        setAttentionItems(
          data.attentionItems.map((item: Partial<AttentionItem>) => ({
            title: item.title || "",
            content: item.content || "",
            postSlug: item.postSlug || "",
          }))
        );
      } else {
        setAttentionItems([{ title: "", content: "", postSlug: "" }]);
      }


      setFooterMailingText(data.footerMailingText || "");
      setFooterContactText(data.footerContactText || "");
      setFooterSocialText(data.footerSocialText || "");
    } catch (error) {
      console.error("FETCH HOME ERROR:", error);
      alert("Không lấy được dữ liệu home");
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("UPLOAD RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data.message || "Upload thất bại");
    }

    return data.url as string;
  };

  const handleFooterLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await uploadFile(file);
      setFooterLogo(url);
      alert("Upload logo footer thành công. Nhớ bấm Lưu toàn bộ Home.");
    } catch (error) {
      console.error("FOOTER LOGO UPLOAD ERROR:", error);
      alert(error instanceof Error ? error.message : "Upload thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await uploadFile(file);
      setHeaderLogo(url);
      alert("Upload logo chính thành công. Nhớ bấm Lưu toàn bộ Home.");
    } catch (error) {
      console.error("HEADER LOGO UPLOAD ERROR:", error);
      alert(error instanceof Error ? error.message : "Upload thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await uploadFile(file);
      const updated = [...partnerLogos];
      updated[index] = url;
      setPartnerLogos(updated);
      alert("Upload logo phụ thành công. Nhớ bấm Lưu toàn bộ Home.");
    } catch (error) {
      console.error("PARTNER LOGO UPLOAD ERROR:", error);
      alert(error instanceof Error ? error.message : "Upload thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSlideImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await uploadFile(file);
      updateHeroSlide(index, "image", url);
      alert("Upload ảnh slide thành công. Nhớ bấm Lưu toàn bộ Home.");
    } catch (error) {
      console.error("HERO SLIDE IMAGE UPLOAD ERROR:", error);
      alert(error instanceof Error ? error.message : "Upload thất bại");
    } finally {
      setLoading(false);
    }
  };

  const updateInfoItem = (
    index: number,
    field: keyof InfoItem,
    value: string
  ) => {
    const updated = [...infoItems];
    updated[index] = { ...updated[index], [field]: value };
    setInfoItems(updated);
  };

  const addInfoItem = () => {
    setInfoItems([...infoItems, { date: "", location: "" }]);
  };

  const removeInfoItem = (index: number) => {
    const updated = infoItems.filter((_, i) => i !== index);
    setInfoItems(updated.length ? updated : [{ date: "", location: "" }]);
  };

  const updateAttentionItem = (
    index: number,
    field: keyof AttentionItem,
    value: string
  ) => {
    const updated = [...attentionItems];
    updated[index] = { ...updated[index], [field]: value };

    // nếu sửa title mà slug đang trống hoặc muốn tự sync slug
    if (field === "title") {
      updated[index].postSlug = value
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }

    setAttentionItems(updated);
  };

  const addAttentionItem = () => {
    setAttentionItems([
      ...attentionItems,
      { title: "", content: "", postSlug: "" },
    ]);
  };

  const removeAttentionItem = (index: number) => {
    const updated = attentionItems.filter((_, i) => i !== index);
    setAttentionItems(
      updated.length ? updated : [{ title: "", content: "", postSlug: "" }]
    );
  };


  const updateHeroSlide = (
    index: number,
    field: keyof HeroSlide,
    value: string
  ) => {
    const updated = [...heroSlides];
    updated[index] = { ...updated[index], [field]: value };
    setHeroSlides(updated);
  };

  const addHeroSlide = () => {
    setHeroSlides([...heroSlides, emptySlide()]);
  };

  const removeHeroSlide = (index: number) => {
    const updated = heroSlides.filter((_, i) => i !== index);
    setHeroSlides(updated.length ? updated : [emptySlide()]);
  };

  const clearHeroSlideImage = (index: number) => {
    updateHeroSlide(index, "image", "");
  };

  const saveHome = async () => {
    try {
      setLoading(true);

      const cleanedHeroSlides = heroSlides.filter(
        (slide) =>
          slide.image.trim() !== "" ||
          slide.title.trim() !== "" ||
          slide.description.trim() !== "" ||
          slide.buttonText.trim() !== "" ||
          slide.buttonLink.trim() !== ""
      );

      const cleanedInfoItems = infoItems.filter(
        (item) => item.date.trim() !== "" || item.location.trim() !== ""
      );

      const cleanedAttentionItems = attentionItems.filter(
        (item) =>
          item.title.trim() !== "" ||
          item.content.trim() !== "" ||
          item.postSlug.trim() !== ""
      );

      const body = {
        siteName,
        headerLogo,
        welcomeTitle,
        welcomeText,
        marqueeText,

        heroImage: cleanedHeroSlides[0]?.image || heroImage || "",
        heroTitle: cleanedHeroSlides[0]?.title || heroTitle || "",
        heroDescription:
          cleanedHeroSlides[0]?.description || heroDescription || "",
        heroButtonText:
          cleanedHeroSlides[0]?.buttonText || heroButtonText || "Know More",
        heroButtonLink:
          cleanedHeroSlides[0]?.buttonLink || heroButtonLink || "#",

        heroSlides: cleanedHeroSlides,
        infoItems: cleanedInfoItems,
        attentionItems: cleanedAttentionItems,

        footerMailingText,
        footerContactText,
        footerSocialText,
        footerLogo,
        partnerLogos: partnerLogos.filter((item) => item.trim() !== ""),
      };

      console.log("SAVE HOME BODY:", body);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("adminToken") ||
        localStorage.getItem("accessToken");

      const res = await fetch(`${API_URL}/api/home`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      console.log("SAVE HOME RESPONSE:", result);

      if (!res.ok) {
        throw new Error(result.message || "Lưu Home thất bại");
      }

      alert("Lưu Home thành công");
      fetchHomeData();
    } catch (error) {
      console.error("SAVE HOME ERROR:", error);
      alert(error instanceof Error ? error.message : "Lưu Home thất bại");
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = (url: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };
  const getFileNameFromPath = (path: string) => {
  if (!path) return "";
  return path.split("/").pop() || "";
};

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">Quản lý Home</h1>

      <section className="rounded-xl border p-5">
        <h2 className="mb-4 text-xl font-semibold">Header</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-medium">Tên trang</label>
            <input
              className="w-full rounded border p-3"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Tên website"
            />
          </div>

          <div>
  <label className="mb-2 block font-medium">Logo chính</label>

  <input
    id="header-logo-upload"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleHeaderLogoUpload}
  />

  <div className="flex flex-wrap items-center gap-3">
  <label
    htmlFor="header-logo-upload"
    className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
  >
    Chọn logo từ máy
  </label>
</div>

  {headerLogo && (
    <img
      src={previewUrl(headerLogo)}
      alt="headerLogo"
      className="mt-3 h-20 w-20 rounded-full border object-cover"
    />
  )}
</div>

          <div>
  <p className="mb-2 font-medium">4 logo phụ</p>
  <div className="grid gap-4 md:grid-cols-2">
    {[0, 1, 2, 3].map((index) => (
      <div key={index} className="rounded-lg border p-4">
        <label className="mb-2 block font-medium">Logo phụ {index + 1}</label>

        <input
          id={`partner-logo-upload-${index}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handlePartnerLogoUpload(e, index)}
        />

        <div className="flex flex-wrap items-center gap-3">
  <label
    htmlFor={`partner-logo-upload-${index}`}
    className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
  >
    Chọn file
  </label>
</div>

        {partnerLogos[index] ? (
          <img
            src={previewUrl(partnerLogos[index])}
            alt={`partnerLogo-${index}`}
            className="mt-3 h-16 w-16 rounded-full border object-cover"
          />
        ) : (
          <div className="mt-3 flex h-16 w-16 items-center justify-center rounded-full border border-dashed text-xs text-gray-400">
            No image
          </div>
        )}
      </div>
    ))}
  </div>
</div>
        </div>
      </section>

      <section className="rounded-xl border p-5">
        <h2 className="mb-4 text-xl font-semibold">Nội dung đầu trang</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-medium">Welcome title</label>
            <input
              className="w-full rounded border p-3"
              value={welcomeTitle}
              onChange={(e) => setWelcomeTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Welcome text</label>
            <textarea
              className="w-full rounded border p-3"
              rows={5}
              value={welcomeText}
              onChange={(e) => setWelcomeText(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Marquee text</label>
            <input
              className="w-full rounded border p-3"
              value={marqueeText}
              onChange={(e) => setMarqueeText(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Slider giữa trang</h2>
          <button
            type="button"
            onClick={addHeroSlide}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            + Thêm slide
          </button>
        </div>

        <div className="space-y-6">
          {heroSlides.map((slide, index) => (
            <div key={index} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-lg font-semibold">Slide {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeHeroSlide(index)}
                  className="rounded bg-red-600 px-4 py-2 text-white"
                >
                  Xóa slide
                </button>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block font-medium">Ảnh</label>

                  <input
                    id={`hero-slide-image-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleHeroSlideImageUpload(e, index)}
                  />

                  <label
                    htmlFor={`hero-slide-image-${index}`}
                    className="inline-block cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
                  >
                    Chọn ảnh từ máy
                  </label>

                  {slide.image ? (
                    <div className="mt-3">
                      <img
                        src={previewUrl(slide.image)}
                        alt={`slide-${index}`}
                        className="h-48 w-full rounded border object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => clearHeroSlideImage(index)}
                        className="mt-3 rounded border border-red-600 px-4 py-2 text-red-600"
                      >
                        Xóa ảnh hiện tại
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 flex h-40 w-full items-center justify-center rounded border border-dashed text-gray-400">
                      Chưa có ảnh
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1 block font-medium">Tiêu đề</label>
                  <input
                    className="w-full rounded border p-3"
                    value={slide.title}
                    onChange={(e) =>
                      updateHeroSlide(index, "title", e.target.value)
                    }
                    placeholder="Nhập tiêu đề slide"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">Mô tả</label>
                  <textarea
                    className="w-full rounded border p-3"
                    rows={3}
                    value={slide.description}
                    onChange={(e) =>
                      updateHeroSlide(index, "description", e.target.value)
                    }
                    placeholder="Nhập mô tả slide"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-medium">Nút</label>
                    <input
                      className="w-full rounded border p-3"
                      value={slide.buttonText}
                      onChange={(e) =>
                        updateHeroSlide(index, "buttonText", e.target.value)
                      }
                      placeholder="Ví dụ: Know More"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-medium">Link nút</label>
                    <input
                      className="w-full rounded border p-3"
                      value={slide.buttonLink}
                      onChange={(e) =>
                        updateHeroSlide(index, "buttonLink", e.target.value)
                      }
                      placeholder="Ví dụ: /projects"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Bảng Thông tin</h2>
          <button
            type="button"
            onClick={addInfoItem}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            + Thêm dòng
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="grid grid-cols-[1fr_2fr_auto] bg-gray-100">
            <div className="border-r p-3 font-semibold">Date</div>
            <div className="border-r p-3 font-semibold">Location</div>
            <div className="p-3 font-semibold">Thao tác</div>
          </div>

          <div className="space-y-0">
            {infoItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_2fr_auto] border-t"
              >
                <input
                  className="border-r p-3 outline-none"
                  placeholder="Date"
                  value={item.date}
                  onChange={(e) => updateInfoItem(index, "date", e.target.value)}
                />
                <input
                  className="border-r p-3 outline-none"
                  placeholder="Location"
                  value={item.location}
                  onChange={(e) =>
                    updateInfoItem(index, "location", e.target.value)
                  }
                />
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => removeInfoItem(index)}
                    className="rounded bg-red-600 px-4 py-2 text-white"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Mỗi dòng là một mục thông tin sẽ hiển thị ở bảng bên ngoài trang chủ.
        </p>
      </section>
      <section className="rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Attention</h2>
          <button
            type="button"
            onClick={addAttentionItem}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            + Thêm bài
          </button>
        </div>

        <div className="space-y-6">
          {attentionItems.map((item, index) => (
            <div key={index} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-lg font-semibold">Bài {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeAttentionItem(index)}
                  className="rounded bg-red-600 px-4 py-2 text-white"
                >
                  Xóa
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block font-medium">Tiêu đề</label>
                  <input
                    className="w-full rounded border p-3"
                    value={item.title}
                    onChange={(e) =>
                      updateAttentionItem(index, "title", e.target.value)
                    }
                    placeholder="Nhập tiêu đề bài"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">Slug</label>
                  <input
                    className="w-full rounded border p-3"
                    value={item.postSlug}
                    onChange={(e) =>
                      updateAttentionItem(index, "postSlug", e.target.value)
                    }
                    placeholder="vi-du-ten-bai-viet"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">Nội dung</label>
                  <textarea
                    className="w-full rounded border p-3"
                    rows={6}
                    value={item.content}
                    onChange={(e) =>
                      updateAttentionItem(index, "content", e.target.value)
                    }
                    placeholder="Nhập nội dung bài viết"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      <section className="rounded-xl border p-5">
        <h2 className="mb-4 text-xl font-semibold">Footer</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block font-medium">Logo footer</label>

            <input
              id="footer-logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFooterLogoUpload}
            />

            <label
              htmlFor="footer-logo-upload"
              className="inline-block cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
            >
              Chọn logo từ máy
            </label>

            {footerLogo ? (
              <div className="mt-3">
                <img
                  src={previewUrl(footerLogo)}
                  alt="footerLogo"
                  className="h-24 w-24 rounded-full border object-cover"
                />
              </div>
            ) : (
              <div className="mt-3 flex h-24 w-24 items-center justify-center rounded-full border border-dashed text-sm text-gray-400">
                Chưa có logo
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Tên footer / mailing text
            </label>
            <input
              className="w-full rounded border p-3"
              value={footerMailingText}
              onChange={(e) => setFooterMailingText(e.target.value)}
              placeholder="Ví dụ: Join our Mailing List"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Thông tin liên hệ</label>
            <textarea
              className="w-full rounded border p-3"
              rows={4}
              value={footerContactText}
              onChange={(e) => setFooterContactText(e.target.value)}
              placeholder="Ví dụ: Contact us:"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Social / dòng mô tả phải
            </label>
            <textarea
              className="w-full rounded border p-3"
              rows={4}
              value={footerSocialText}
              onChange={(e) => setFooterSocialText(e.target.value)}
              placeholder="Ví dụ: We are on:"
            />
          </div>
        </div>
      </section>

      <button
        onClick={saveHome}
        className="rounded bg-black px-6 py-3 text-white"
      >
        Lưu toàn bộ Home
      </button>

      {loading && <p className="text-sm text-gray-500">Đang xử lý...</p>}
    </div>
  );
}