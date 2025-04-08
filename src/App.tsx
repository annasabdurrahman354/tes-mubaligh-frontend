import { Navigate, Route, Routes } from "react-router-dom";

import { HomeLayout } from "./layouts/home";
import { AuthLayout } from "./layouts/auth";
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

import LoginPage from "@/pages/auth/login";
import AkunPage from "@/pages/home/akun";
import StatistikPage from "@/pages/home/statistik";
import IndexPage from "@/pages/home/index";
import PesertaKertosonoVerifikasiIndex from "@/pages/peserta-kertosono/verifikasi";
import PesertaKertosonoVerifikasiUpdate from "./pages/peserta-kertosono/verifikasi/update";

const App: React.FC = () => {
  useTheme();
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route
          element={user ? <Navigate replace to="/" /> : <LoginPage />}
          path="/login"
        />
      </Route>

      {/* Protected Routes (Requires Auth) */}
      {user ? (
        <>
          <Route element={<HomeLayout />}>
            <Route element={<IndexPage />} path="/" />
            <Route element={<StatistikPage />} path="/statistik" />
            <Route element={<AkunPage />} path="/akun" />
          </Route>

          {/* Peserta Kediri Routes */}
          <Route path="/peserta-kediri">
            <Route index element={<PesertaKediriIndex />} />
            <Route
              element={<DetailPesertaKediriPage />}
              path="detail"
            />
            <Route
              element={<PenilaianAkademikKediriPage />}
              path="penilaian-akademik"
            />
            <Route
              element={<PenilaianAkhlakKediriPage />}
              path="penilaian-akhlak"
            />
          </Route>

          {/* Peserta Kertosono Routes */}
          <Route path="/peserta-kertosono">
            <Route index element={<PesertaKertosonoIndex />} />
            <Route
              element={<DetailPesertaKertosonoPage />}
              path="detail"
            />
            <Route
              element={<PenilaianAkademikKertosonoPage />}
              path="penilaian-akademik"
            />
            <Route
              element={<PenilaianAkhlakKertosonoPage />}
              path="penilaian-akhlak"
            />
            {/* --- Verification Routes --- */}
            <Route path="verifikasi"> {/* Parent path for grouping */}
            {/* Index/List page for verification */}
            <Route
                index // This makes it the route for "/peserta-kertosono/verifikasi"
                element={<PesertaKertosonoVerifikasiIndex />}
            />
            {/* Update page with dynamic ID */}
            <Route
                path=":id_tes_santri" // This makes it the route for "/peserta-kertosono/verifikasi/:id"
                element={<PesertaKertosonoVerifikasiUpdate />}
            />
            </Route>
          </Route>
        </>
      ) : (
        // Redirect unauthenticated users to login
        <Route element={<Navigate replace to="/login" />} path="*" />
      )}
    </Routes>
  );
};

export default App;
