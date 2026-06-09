import { Document } from "./tfidf";

const URLS = [
  "https://www.liputan6.com/showbiz/read/6288480/kim-soo-hyun-dilaporkan-bakal-comeback-via-drakor-knock-off",
  "https://www.liputan6.com/showbiz/read/6288090/film-kuyank-rangkul-1-juta-penonton-dalam-30-hari-dibintangi-putri-intan-dan-rio-dewanto",
  "https://www.liputan6.com/showbiz/read/6285788/film-laut-bercerita-siap-tayang-di-bioskop-tahun-ini-hadirkan-kisah-pilu-aktivis-1998",
  "https://www.liputan6.com/showbiz/read/6284572/ghost-in-the-cell-karya-joko-anwar-angkat-dinamika-kuasa-di-penjara-dibintangi-abimana-aryasatya",
  "https://www.liputan6.com/showbiz/read/6282215/ahmad-dhani-sebut-tyo-nugros-dan-once-mekel-sosok-di-balik-popularitas-dewa-19-di-malaysia",
  "https://www.liputan6.com/showbiz/read/6284075/film-triple-threat-dibintangi-iko-uwais-viral-soal-niat-putri-miliarder-berantas-sindikat-kejahatan",
  "https://www.liputan6.com/showbiz/read/6283556/trailer-toy-story-5-resmi-dirilis-woody-dan-buzz-lightyear-bakal-hadapi-tantangan-era-digital",
  "https://www.liputan6.com/showbiz/read/6281501/papa-zola-the-movie-menuju-500-ribu-penonton-di-indonesia-sukses-besar-di-kawasan-asia-tenggara",
  "https://www.liputan6.com/saham/read/6321409/penjelasan-bei-terkait-saham-dengan-konsentrasi-kepemilikan-tinggi",
  "https://www.liputan6.com/showbiz/read/6288659/candil-ogah-pakai-stuntman-untuk-adegan-baku-hantam-film-setannya-cuan-biar-kayak-jackie-chan",
  "https://www.liputan6.com/bisnis/read/6321776/gaji-ke-13-pns-cair-juni-2026-demi-jaga-ekonomi",
  "https://www.liputan6.com/news/read/6322157/wamendagri-luruskan-wacana-adanya-denda-ktp-hilang",
  "https://www.liputan6.com/surabaya/read/5543359/penampakan-gus-samsudin-pakai-rompi-tahanan-polda-jatim-usai-jadi-tersangka-konten-viral-bebas-tukar-pasangan",
  "https://www.liputan6.com/news/read/6321496/prabowo-diskusi-dengan-pm-australia-via-telepon-pastikan-kerja-sama-tetap-kuat-di-tengah-dinamika-global",
  "https://www.liputan6.com/news/read/5543347/menaker-ida-lantik-pengurus-lembaga-pelatihan-industri-daerah-jabar-periode-2024-2027",
  "https://www.liputan6.com/news/read/5543372/suara-golkar-melonjak-di-pemilu-2024-pengamat-sayangkan-jika-tak-dapat-kursi-dapil-jakarta-1",
  "https://www.liputan6.com/bisnis/read/5543368/36-perusahaan-amerika-hingga-jepang-pantau-investasi-smart-city-di-ikn",
  "https://www.liputan6.com/islami/read/5543364/10-resep-menu-sahur-praktis-kaya-nutrisi-cukupi-kebutuhan-gizi-selama-puasa",
  "https://www.liputan6.com/news/read/6321086/prabowo-bakal-kirim-wni-terbaik-untuk-ikut-program-kosmonot-rusia",
  "https://www.liputan6.com/citizen6/read/5543349/potret-siti-ruby-aliya-menantu-sby-abadikan-momen-kabisat-banyak-bersama-keluarga",
  "https://www.liputan6.com/health/read/5543332/mv-falling-slowly-daesung-big-bang-tembus-sejuta-views-moon-ga-young-tembak-mati-kim-seon-ho",
  "https://www.liputan6.com/otomotif/read/5543319/mewujudkan-masa-depan-panjang-pengisian-daya-nirkabel-untuk-mobil-listrik",
  "https://www.liputan6.com/lifestyle/read/5543310/sosok-sekretaris-pribadi-baru-kate-middleton-curi-perhatian-disebut-kembaran-petenis-roger-federer",
  "https://www.liputan6.com/citizen6/read/5543294/10-rekomendasi-soundtrack-bleach-yang-wajib-didengar-bagi-pecinta-anime",
  "https://www.liputan6.com/bisnis/read/5543301/china-tambah-anggaran-pertahanan-nilainya-tembus-rp-3656-triliun",
  "https://www.liputan6.com/health/read/5543276/pro-dan-kontra-kerok-bayi-dengan-bawang-merah-begini-kata-pakar",
  "https://www.liputan6.com/news/read/5543237/muncul-massa-tandingan-demo-hak-angket-di-depan-dpr-diwarnai-saling-lempar-botol",
  "https://www.liputan6.com/bisnis/read/6315916/pembiayaan-koperasi-desa-merah-putih-dari-apbn-bakal-dipantau-ketat",
  "https://www.liputan6.com/news/read/6311921/wacana-pemotongan-gaji-menteri-airlangga-belum-pernah-kita-bahas",
  "https://www.liputan6.com/lifestyle/read/5552419/atraksi-pangeran-duyung-berperut-buncit-menghibur-pengunjung-di-taman-hiburan-changchun-china-langsung-viral-dalam-semalam",
  "https://www.liputan6.com/health/read/6293845/kisah-vidi-aldiano-sering-berdonasi-diam-diam-dan-dukung-pembangunan-rs-di-gaza-terungkap",
  "https://www.liputan6.com/bisnis/read/6293233/lonjakan-harga-emas-jadi-penyebab-inflasi-indonesia",
  "https://www.liputan6.com/showbiz/read/6279102/anime-one-piece-comeback-april-mendatang-dengan-elbaph-arc-luffy-dkk-sampai-ke-negeri-para-raksasa",
  "https://www.liputan6.com/showbiz/read/6281621/ai-furihata-sang-pengisi-suara-ruby-chan-umumkan-kelulusan-dari-aiscream",
  "https://www.liputan6.com/showbiz/read/6290997/stalker-jungkook-bts-asal-brasil-ngaku-menguntit-sang-idol-karena-cinta",
  "https://www.liputan6.com/showbiz/read/6291360/sandara-park-tepis-tuduhan-park-bom-aku-tak-pernah-pakai-narkoba",
  "https://www.liputan6.com/showbiz/read/6290126/boa-resmi-dirikan-agensi-bapal-entertainment-usai-hengkang-dari-sm-entertainment",
  "https://www.liputan6.com/showbiz/read/6289990/nonton-chef-of-antarctica-di-vidio-variety-show-korea-tentang-misi-memasak-di-antartika",
  "https://www.liputan6.com/bisnis/read/6309688/indonesia-dan-korsel-bakal-manfaatkan-anjungan-lepas-pantai-jadi-carbon-capture-and-storage",
  "https://www.liputan6.com/showbiz/read/6278436/agensi-enhypen-rilis-aturan-baru-untuk-engene-tegaskan-batasan-demi-keselamatan-sang-idol",
  "https://www.liputan6.com/showbiz/read/6276755/dahyun-twice-terpaksa-absen-dari-tur-karena-cedera-ankle",
  "https://www.liputan6.com/bisnis/read/6293974/satgas-ramadan-pertamina-siaga-produksi-migas-dan-pasokan-gas-dipastikan-aman",
  "https://www.liputan6.com/news/read/6322053/alfian-nasution-dituntut-14-tahun-penjara-di-kasus-korupsi-minyak-mentah",
  "https://www.liputan6.com/bisnis/read/6293813/harga-minyak-dunia-tembus-di-atas-usd-100-per-barel-imbas-pemangkasan-produksi",
  "https://www.liputan6.com/bisnis/read/6293868/ketum-perbanas-hery-gunardi-ungkap-strategi-perbankan-ri-hadapi-ketidakpastian-ekonomi-global",
  "https://www.liputan6.com/bisnis/read/6293595/tantangan-industri-penerbangan-indonesia-delay-sedikit-langsung-viral",
  "https://www.liputan6.com/bisnis/read/6293549/lapangan-gas-mako-pasok-111-mmscfd-gas-untuk-pembangkit-listrik",
  "https://www.liputan6.com/bisnis/read/6293537/48-juta-hektare-lahan-sawit-rakyat-butuh-peremajaan",
  "https://www.liputan6.com/bisnis/read/6293533/industri-furnitur-ri-didominasi-usaha-kecil-dan-menengah-serap-819-ribu-pekerja",
  "https://www.liputan6.com/bisnis/read/6319627/aturan-rampung-pekan-depan-pemerintah-kebut-operasional-koperasi-desa-merah-putih",
];

export { URLS };

export async function scrapeArticle(url: string, no: number): Promise<Document | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const html = await res.text();

    // Parse title
    const titleMatch = html.match(/<h1[^>]*class="[^"]*read-page--header--title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
    const judul = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";

    // Parse content paragraphs
    const contentMatch = html.match(/<div[^>]*class="[^"]*article-content-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    let isi = "";
    if (contentMatch) {
      const paragraphs: string[] = [];
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      let m;
      while ((m = pRegex.exec(contentMatch[1])) !== null) {
        const text = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        if (text) paragraphs.push(text);
      }
      isi = paragraphs.join(" ").replace(/\s+/g, " ").trim();
    }

    return { no, url, judul, isi };
  } catch {
    return null;
  }
}
