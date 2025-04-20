import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Spinner } from "@heroui/react";
import { ListCollapse, PencilIcon, PlusCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import DaftarPesertaTopbar from "@/components/daftar-peserta-topbar";
import PesertaRFIDScanner from "@/components/peserta-rfid-scanner";
import AnimatedPesertaCard from "@/components/animated-peserta-card";
import { usePeserta } from "@/hooks/use-peserta";
import EmptyState from "@/components/empty-state";
import LoadingState from "@/components/loading-state";
import ErrorState from "@/components/error-state";
import { useKertosono } from "@/hooks/use-kertosono";
import StartState from "@/components/start-state";
import { PesertaKertosono } from "@/types/kertosono";

export const PesertaKertosonoIndex = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action") ? searchParams.get("action") : "detail";
  const kategori = searchParams.get("kategori");

  const IconComponent =
    action === "penilaian-akademik" || action === "penilaian-akhlak"
      ? PencilIcon
      : ListCollapse;

  const { selectedPeserta, isSelectedPeserta, toggleSelectedPeserta } = usePeserta();
  const { getPesertaKertosono } = useKertosono(); // Stable reference from hook

  const [pesertaList, setPesertaList] = useState<PesertaKertosono[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [query, setQuery] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Fetching Logic ---
  const fetchPeserta = useCallback(async (page = 1, append = false) => {
    if (Object.keys(query).length === 0 && !kategori) {
       setPesertaList([]);
       setCurrentPage(1);
       setLastPage(1);
       setTotalItems(0);
       setLoading(false);
       setError(null);
       return;
    }

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    try {
      const params: Record<string, string | number> = { ...query, page };
      if (kategori) params.kategori = kategori;

      const response = await getPesertaKertosono(params);

      // **** ADJUST CHECK AND ACCESS ****
      // Check if response exists and has the necessary top-level properties
      if (response && typeof response.total === 'number' && typeof response.last_page === 'number' && typeof response.current_page === 'number' && Array.isArray(response.data)) {
        setError(null); // Clear error on success

        // Access fields directly from response object
        setTotalItems(response.total);
        setLastPage(response.last_page);
        setCurrentPage(response.current_page);

        if (append) {
          setPesertaList((prev) => [...prev, ...response.data]);
        } else {
          setPesertaList(response.data);
        }
      } else {
         // Log the actual response if it's invalid but not null
         if (response) {
            console.error("Received invalid pagination structure:", response);
            setError("Struktur data pagination tidak sesuai.");
         } else {
            console.error("Received null response from API.");
            // Error might already be set by the hook's handleApiError
            // setError(prev => prev ?? "Gagal memuat data.");
         }

         if (!append) {
             setPesertaList([]);
             setCurrentPage(1);
             setLastPage(1);
             setTotalItems(0);
         }
      }
    } catch (error) {
      console.error("Failed to fetch peserta in component:", error);
      setError(error instanceof Error ? error.message : "Terjadi kesalahan.");
      if (!append) {
          setPesertaList([]);
          setCurrentPage(1);
          setLastPage(1);
          setTotalItems(0);
      }
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }, [query, kategori, getPesertaKertosono]);


  // --- Effect for initial fetch and query/filter changes ---
  useEffect(() => {
    fetchPeserta(1, false);
  }, [query, kategori, fetchPeserta]);


  // --- Load More Logic ---
  const loadMore = useCallback(() => {
    if (!loadingMore && currentPage < lastPage) {
      fetchPeserta(currentPage + 1, true);
    }
  }, [loadingMore, currentPage, lastPage, fetchPeserta]);


  // --- Infinite Scroll Observer ---
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingMore || currentPage >= lastPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { threshold: 0.5 },
      );

      if (node) observer.current.observe(node);
    },
    [loadingMore, currentPage, lastPage, loadMore],
  );

  // --- Render Logic (Unchanged) ---
  return (
    <div
      ref={scrollRef}
      className="min-h-screen bg-default-100 dark:bg-default-50/25 flex flex-col font-inter relative"
    >
      <DaftarPesertaTopbar
        selectedPeserta={selectedPeserta}
        setQuery={setQuery}
        toggleSelectedPeserta={toggleSelectedPeserta}
      />
      <AnimatePresence mode="sync">
        {IconComponent && selectedPeserta.length !== 0 && (
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className="fixed bottom-6 right-6 z-10"
            exit={{ scale: 0.8, opacity: 0 }}
            initial={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Button
              isIconOnly
              aria-label={ action === "penilaian" ? "Mulai Penilaian" : "Lihat Detail" }
              className="rounded-medium border p-3 bg-success border-success-100"
              color="success"
              isDisabled={loading}
              size="lg"
              variant="shadow"
              onPress={() => navigate(`/peserta-kertosono/${action}`)}
            >
              <IconComponent className="text-success-50" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow container mx-auto max-w-7xl py-4 px-4 md:py-6 md:px-6 flex flex-col gap-4 overflow-hidden">
        {/* Condition 1: Initial state */}
        {Object.keys(query).length === 0 && !kategori && !loading && !error && pesertaList.length === 0 && (
          <StartState />
        )}
        {/* Condition 2: Loading initial page */}
        {loading && !loadingMore && ( <LoadingState /> )}
        {/* Condition 3: Error occurred */}
        {error && ( <ErrorState message={error} onPress={() => fetchPeserta(1, false)} /> )}
        {/* Condition 4: Data loaded */}
        {!loading && !error && (Object.keys(query).length > 0 || kategori || pesertaList.length > 0) && (
             pesertaList.length > 0 ? (
                  <>
                    <div className="will-change-transform flex flex-col gap-4">
                      <AnimatePresence mode="popLayout">
                        {pesertaList.map((pesertaItem, index) => (
                          <div
                            ref={index === pesertaList.length - 5 ? lastItemRef : null}
                            // Use primary key if available and guaranteed unique
                            key={pesertaItem.id || `${pesertaItem.nispn}-${index}`}
                          >
                            <AnimatedPesertaCard
                              isSelected={isSelectedPeserta(pesertaItem)}
                              peserta={pesertaItem}
                              onPress={() => toggleSelectedPeserta(pesertaItem)}
                            />
                          </div>
                        ))}
                      </AnimatePresence>
                    </div>
                    {/* Loading more indicator or button */}
                    {loadingMore ? (
                        <div className="flex justify-center py-4">
                          <Spinner/>
                        </div>
                    ) : currentPage < lastPage ? (
                       <div className="flex justify-center py-4">
                        <Button
                          color="primary"
                          size="md"
                          startContent={<PlusCircle size={18} />}
                          variant="shadow"
                          onPress={loadMore}
                          isDisabled={loadingMore}
                        >
                          Muat Lebih Banyak
                        </Button>
                      </div>
                    ): null }
                  </>
             ) : (
                  // Condition 4b: No results after query/filter
                  <EmptyState />
             )
        )}
      </main>
      <PesertaRFIDScanner />
    </div>
  );
};

export default PesertaKertosonoIndex;