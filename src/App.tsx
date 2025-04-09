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
import { ROLE } from "@/types/enum";
import LoginPage from "@/pages/auth/login";
import AkunPage from "@/pages/home/akun";
import StatistikPage from "@/pages/home/statistik";
import IndexPage from "@/pages/home/index";
import PesertaKertosonoVerifikasiIndex from "@/pages/peserta-kertosono/verifikasi";
import PesertaKertosonoVerifikasiUpdate from "./pages/peserta-kertosono/verifikasi/update";

const App: React.FC = () => {
  useTheme();
  const { user, hasRole } = useAuth();

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

          {/* Check if the user has ANY of the roles allowed in the Kediri section */}
          {(hasRole(ROLE.GURU_KEDIRI) ||
            hasRole(ROLE.ADMIN_KEDIRI) ||
            hasRole(ROLE.SUPERADMIN)) && (

            <Route path="/peserta-kediri">

              {/* Routes accessible by ALL roles listed above (GURU, ADMIN, SUPERADMIN) */}
              <Route index element={<PesertaKediriIndex />} />
              <Route
                element={<DetailPesertaKediriPage />}
                path="detail"
              />

              {/* --- Restricted Routes --- */}
              {/* Now, add routes ONLY accessible by GURU_KEDIRI or SUPERADMIN.
                  ADMIN_KEDIRI will NOT have access to these.
              */}
              {(hasRole(ROLE.GURU_KEDIRI) ||
                hasRole(ROLE.ADMIN_KEDIRI) ||
                hasRole(ROLE.SUPERADMIN)) && (
                  <> {/* Use a Fragment to group these routes */}
                    <Route
                      element={<PenilaianAkademikKediriPage />}
                      path="penilaian-akademik"
                    />
                    <Route
                      element={<PenilaianAkhlakKediriPage />}
                      path="penilaian-akhlak"
                    />
                  </>
              )}

            </Route>
          )}
          
          {/* First, check if the user has ANY of the required roles to access 
            at least *some* part of the /peserta-kertosono section.
          */}
          {(hasRole(ROLE.GURU_KERTOSONO) ||
            hasRole(ROLE.ADMIN_KERTOSONO) ||
            hasRole(ROLE.SUPERADMIN) ||
            hasRole(ROLE.KOMANDAN)) && (

            <Route path="/peserta-kertosono">

              {/* Routes accessible by ALL roles listed above (including KOMANDAN) */}
              <Route index element={<PesertaKertosonoIndex />} />
              <Route
                element={<DetailPesertaKertosonoPage />}
                path="detail"
              />
              {/* --- Verification Routes (accessible by all) --- */}
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

              {/* Now, add routes ONLY accessible by GURU, ADMIN, or SUPERADMIN.
                KOMANDAN will NOT have access to these because they are excluded
                from this inner condition.
              */}
              {(hasRole(ROLE.GURU_KERTOSONO) ||
                hasRole(ROLE.ADMIN_KERTOSONO) ||
                hasRole(ROLE.SUPERADMIN)) && (
                  <> {/* Use a Fragment to group these routes */}
                    <Route
                      element={<PenilaianAkademikKertosonoPage />}
                      path="penilaian-akademik"
                    />
                    <Route
                      element={<PenilaianAkhlakKertosonoPage />}
                      path="penilaian-akhlak"
                    />
                  </>
              )}

            </Route>
          )}
        </>
      ) : (
        // Redirect unauthenticated users to login
        <Route element={<Navigate replace to="/login" />} path="*" />
      )}
    </Routes>
  );
};

export default App;
