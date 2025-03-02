import { Navigate, Route, Routes } from "react-router-dom";
import { HomeLayout } from "./layouts/home";
import { AuthLayout } from "./layouts/auth";
import IndexPage from "@/pages/home/index";
import StatistikPage from "@/pages/home/statistik";
import AkunPage from "@/pages/home/akun";
import LoginPage from "@/pages/auth/login";
import PesertaKediriIndex from "./pages/peserta-kediri";
import DetailPesertaKediriPage from "./pages/peserta-kediri/detail";
import PenilaianAkademikKediriPage from "./pages/peserta-kediri/penilaian-akademik";
import PenilaianAkhlakKediriPage from "./pages/peserta-kediri/penilaian-akhlak";
import PesertaKertosonoIndex from "./pages/peserta-kertosono";
import DetailPesertaKertosonoPage from "./pages/peserta-kertosono/detail";
import PenilaianAkademikKertosonoPage from "./pages/peserta-kertosono/penilaian-akademik";
import PenilaianAkhlakKertosonoPage from "./pages/peserta-kertosono/penilaian-akhlak";

import { useTheme } from "./hooks/use-theme";
import { useAuth } from "./hooks/use-auth";

const App: React.FC = () => {
  useTheme();
  const { user } = useAuth();

  return (
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <LoginPage />} 
          />
        </Route>

        {/* Protected Routes (Requires Auth) */}
        {user ? (
          <>
            <Route element={<HomeLayout />}>
              <Route path="/" element={<IndexPage />} />
              <Route path="/statistik" element={<StatistikPage />} />
              <Route path="/akun" element={<AkunPage />} />
            </Route>

            {/* Peserta Kediri Routes */}
            <Route path="/peserta-kediri">
              <Route 
                index 
                element={<PesertaKediriIndex />} 
              />
              <Route path="detail" element={<DetailPesertaKediriPage />} />
              <Route path="penilaian-akademik" element={<PenilaianAkademikKediriPage />} />
              <Route path="penilaian-akhlak" element={<PenilaianAkhlakKediriPage />} />
            </Route>

            {/* Peserta Kertosono Routes */}
            <Route path="/peserta-kertosono">
              <Route 
                index 
                element={<PesertaKertosonoIndex />} 
              />
              <Route path="detail" element={<DetailPesertaKertosonoPage />} />
              <Route path="penilaian-akademik" element={<PenilaianAkademikKertosonoPage />} />
              <Route path="penilaian-akhlak" element={<PenilaianAkhlakKertosonoPage />} />
            </Route>
          </>
        ) : (
          // Redirect unauthenticated users to login
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
  );
};

export default App;
