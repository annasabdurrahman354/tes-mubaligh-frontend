import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  Input,
  Button,
  cn,
  Image,
  CardBody,
  addToast,
} from "@heroui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import { useRFIDScanner } from "@/libs/rfid-scanner";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      className={cn("absolute", className)}
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        className="relative"
        style={{
          width,
          height,
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15] dark:border-black/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)] dark:after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.2),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginCredential, loginRFID } = useAuth();

  const onLoginSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const sessionData = await loginCredential(
        values.username,
        values.password,
      );

      if (sessionData) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        addToast({
          title: "Terjadi Kesalahan!",
          description: error.message,
          timeout: 3000,
          variant: "flat",
          color: "danger",
          shouldShowTimeoutProgess: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onLoginRFID = async (rfid: string) => {
    setLoading(true);
    try {
      // Attempt to login using the credentials
      const sessionData = await loginRFID(rfid);

      // If successful, redirect to home page
      if (sessionData) {
        console.log(sessionData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        addToast({
          title: "Terjadi Kesalahan!",
          description: error.message,
          timeout: 3000,
          variant: "flat",
          color: "danger",
          shouldShowTimeoutProgess: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (scannedCode: string) => {
    console.log("RFID scanned:", scannedCode);
    onLoginRFID(scannedCode);
  };

  useRFIDScanner(handleScan, {
    length: 10, // Expected barcode length
    timeout: 200, // Reset timeout in milliseconds
  });

  // Add effect to handle navigation after animation
  useEffect(() => {
    if (isLoggedIn) {
      // Wait for animation duration (1s) plus delay (0.5s) before navigating
      const timer = setTimeout(() => {
        navigate("/");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, navigate]);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Isi username terlebih dahulu!"),
    password: Yup.string().required("Isi password terlebih dahulu!"),
  });

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
    exit: {
      opacity: 0,
      y: -30,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-success-100 dark:bg-[#030303] transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] dark:from-indigo-500/[0.02] dark:to-rose-500/[0.02] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          delay={0.3}
          gradient="from-indigo-500/[0.15]"
          height={140}
          rotate={12}
          width={600}
        />

        <ElegantShape
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          delay={0.5}
          gradient="from-rose-500/[0.15]"
          height={120}
          rotate={-15}
          width={500}
        />

        <ElegantShape
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          delay={0.4}
          gradient="from-violet-500/[0.15]"
          height={80}
          rotate={-8}
          width={300}
        />

        <ElegantShape
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          delay={0.6}
          gradient="from-amber-500/[0.15]"
          height={60}
          rotate={20}
          width={200}
        />

        <ElegantShape
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          delay={0.7}
          gradient="from-cyan-500/[0.15]"
          height={40}
          rotate={-25}
          width={150}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            animate={isLoggedIn ? "exit" : "visible"}
            className="inline-flex items-center"
            custom={0}
            initial="hidden"
            variants={fadeUpVariants}
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              className="h-20 w-20 md:h-32 md:w-32 mb-4 backdrop-blur-sm"
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {!isLoggedIn && (
              <motion.div
                key="login-content"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeUpVariants}
              >
                <motion.h1
                  className="text-5xl sm:text-6xl font-bold mb-6 md:mb-8 tracking-tight"
                  custom={1}
                  variants={fadeUpVariants}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-success to-success/60 dark:from-white dark:to-white/80">
                    Tes Calon
                  </span>
                  <br />
                  <span
                    className={cn(
                      "bg-clip-text text-transparent bg-gradient-to-r from-success-300 via-lime/90 to-warning-300 dark:via-white/90 dark:to-warning-700 font-pacifico",
                    )}
                  >
                    Mubaligh
                  </span>
                </motion.h1>

                <motion.div
                  custom={2}
                  variants={fadeUpVariants}
                  className="w-full max-w-md mx-auto"
                >
                  <Card
                    className="border-small dark:border-0 bg-background/50 dark:bg-default-100/50 max-w-[610px] p-4"
                    shadow="sm"
                  >
                    <CardBody>
                      <Formik
                        initialValues={{ username: "", password: "" }}
                        validationSchema={validationSchema}
                        onSubmit={onLoginSubmit}
                      >
                        {({
                          isSubmitting,
                          values,
                          handleChange,
                          errors,
                          touched,
                        }) => (
                          <Form>
                            <div className="space-y-4">
                              <Input
                                color={errors.username && touched.username ? "danger" : "success"}
                                errorMessage={errors.username}
                                isInvalid={errors?.username && touched?.username}
                                label="Username"
                                name="username"
                                placeholder="Enter your username"
                                type="text" 
                                value={values.username}
                                variant="bordered"
                                onChange={handleChange}
                              />
                              <Input
                                color={errors.password && touched.password ? "danger" : "success"}
                                errorMessage={errors.password}
                                isInvalid={errors.password && touched.password}
                                label="Password"
                                name="password"
                                placeholder="Enter your password"
                                type="password" 
                                value={values.password}
                                variant="bordered"
                                onChange={handleChange}
                              />
                              <div className="w-full min-h-min pb-4">
                                <Button
                                  type="submit"
                                  color="success"
                                  variant="shadow"
                                  isLoading={loading}
                                  className="w-full text-white text-medium"
                                  disabled={isSubmitting || loading}
                                >
                                  {loading ? "Loading..." : "Masuk"}
                                </Button>
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </CardBody>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {isLoggedIn && (
              <motion.div
                key="success-message"
                animate="visible"
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-success-300 via-lime/90 to-warning-300 dark:via-white/90 dark:to-warning-700 -mt-32 font-notoarabic"
                exit="exit"
                initial="hidden"
                variants={fadeUpVariants}
              >
                ألسلام عليكم ورحمة الله وبركاته
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/80 dark:from-[#030303] dark:via-transparent dark:to-[#030303]/80 pointer-events-none" />
    </div>
  );
}
