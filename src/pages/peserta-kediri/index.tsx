import { useNavigate, useSearchParams } from "react-router-dom";
import DaftarPesertaTopbar from "@/components/daftar-peserta-topbar";
import { Button } from "@heroui/react";
import { ListCollapse, PencilIcon, PlusCircle } from "lucide-react";
import PesertaRFIDScanner from "@/components/peserta-rfid-scanner";
import AnimatedPesertaCard from '@/components/animated-peserta-card';
import { AnimatePresence, motion } from "framer-motion";
import { usePeserta } from "@/hooks/use-peserta";
import EmptyState from "@/components/empty-state";
import { useCallback, useEffect, useRef, useState } from "react";
import LoadingState from "@/components/loading-state";
import ErrorState from "@/components/error-state";
import { useKediri } from "@/hooks/use-kediri";

export const PesertaKediriIndex = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action") ? searchParams.get("action") : "detail";
  const IconComponent = action === "penilaian-akademik" || action === "penilaian-akhlak" ? PencilIcon : ListCollapse;
  const filter = searchParams.get("filter");

  const { peserta, selectedPeserta, isSelectedPeserta, toggleSelectedPeserta } = usePeserta();
  const { getPesertaKediri } = useKediri();

  const [query, setQuery] = useState<Record<string, string>>({});
  const [visibleCount, setVisibleCount] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Observer for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleCount < peserta.length) {
        loadMore();
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [loading, visibleCount, peserta]);

  const fetchPeserta = async () => {
    // Use smooth scroll behavior
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth'
    });
    
    console.log(query);
    setLoading(true);
    setError(null);
    try {
      if (filter) {
        const updatedQuery = {
          ...query,
          filter: filter,
        };
        await getPesertaKediri(updatedQuery);
      }
      else{
        await getPesertaKediri(query);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeserta();
    setVisibleCount(30);
  }, [query]);

  // Debounced load more function to improve scroll performance
  const loadMore = useCallback(() => {
    // Use requestAnimationFrame for smoother UI updates
    requestAnimationFrame(() => {
      setVisibleCount((prev) => Math.min(prev + 30, peserta.length));
    });
  }, [peserta.length]);

  // Windowing optimization: only render visible items plus some buffer
  const visibleItems = peserta.slice(0, visibleCount);

  return (
    <div 
      className="min-h-screen bg-default-100 dark:bg-default-50/25 flex flex-col font-inter relative"
      ref={scrollRef}
    >
      <DaftarPesertaTopbar selectedPeserta={selectedPeserta} toggleSelectedPeserta={toggleSelectedPeserta} setQuery={setQuery} />
      <AnimatePresence mode="sync">
        {IconComponent && selectedPeserta.length !== 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed bottom-6 right-6 z-10"
          >
            <Button
              isIconOnly
              aria-label={action === "penilaian" ? "Mulai Penilaian" : "Lihat Detail"}
              size="lg"
              color="success"
              variant="shadow"
              className="rounded-medium border p-3 bg-success border-success-100"
              isDisabled={loading}
              onPress={() => navigate(`/peserta-kediri/${action}`)}
            >
              <IconComponent className="text-success-50" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow container mx-auto max-w-7xl py-4 px-4 md:py-6 md:px-6 flex flex-col gap-4 overflow-hidden">
        {
          loading && <LoadingState/>
        }
        {error ? (
          <ErrorState message={error} onPress={fetchPeserta} />
        ) : peserta !== undefined && peserta !== null ? (
          peserta.length > 0 ? (
            <>
              <div className="will-change-transform flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {visibleItems.map((peserta, index) => (
                    <div 
                      ref={index === visibleItems.length - 5 ? lastItemRef : null}
                      key={peserta.id}
                    >
                      <AnimatedPesertaCard
                        peserta={peserta}
                        isSelected={isSelectedPeserta(peserta)}
                        onPress={() => toggleSelectedPeserta(peserta)}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
              {visibleCount < peserta.length && (
                <div className="flex justify-center py-4">
                  <Button 
                    onPress={loadMore} 
                    color="primary" 
                    variant="shadow" 
                    size="md" 
                    startContent={<PlusCircle size={18} />}
                  >
                    Muat Lebih Banyak
                  </Button>
                </div>
              )}
            </>
          ) : (
            !loading && <EmptyState />
          )
        ) : <></>}
      </main>
      <PesertaRFIDScanner />
    </div>
  );
};

export default PesertaKediriIndex;