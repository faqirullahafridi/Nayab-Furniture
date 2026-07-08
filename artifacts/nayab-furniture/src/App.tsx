import { lazy, Suspense, useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useAuth } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { setAuthTokenGetter } from "@workspace/api-client-react";

import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PageLoader } from '@/components/PageLoader';
import { CatalogCacheSync } from '@/components/CatalogCacheSync';
import { PrefetchBootstrap } from '@/components/PrefetchBootstrap';
import { RouteTransition } from '@/components/RouteTransition';
import Layout from '@/components/layout/Layout';
import { queryClient } from '@/lib/query-client';

import Home from '@/pages/Home';
import { logoSrc } from '@/components/Logo';

const About = lazy(() => import('@/pages/About'));
const Products = lazy(() => import('@/pages/Products'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Contact = lazy(() => import('@/pages/Contact'));
const Admin = lazy(() => import('@/pages/Admin'));
const NotFound = lazy(() => import('@/pages/not-found'));

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: logoSrc,
  },
  variables: {
    colorPrimary: "hsl(43 60% 55%)",
    colorForeground: "hsl(28 45% 15%)",
    colorMutedForeground: "hsl(28 20% 45%)",
    colorDanger: "hsl(0 70% 50%)",
    colorBackground: "hsl(40 33% 98%)",
    colorInput: "hsl(30 20% 88%)",
    colorInputForeground: "hsl(28 45% 15%)",
    colorNeutral: "hsl(30 20% 88%)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    borderRadius: "0.25rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-md w-[440px] max-w-full overflow-hidden border border-border shadow-lg",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "font-serif text-2xl text-foreground",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "font-semibold text-foreground",
    formFieldLabel: "text-sm font-medium text-foreground",
    footerActionLink: "text-primary hover:text-primary/90 font-medium",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground text-xs",
    identityPreviewEditButton: "text-primary hover:text-primary/90",
    formFieldSuccessText: "text-green-600",
    alertText: "text-destructive",
    logoBox: "flex justify-center mb-4",
    logoImage: "h-16 w-auto object-contain",
    socialButtonsBlockButton: "border border-input hover:bg-muted/50 transition-colors",
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors",
    formFieldInput: "bg-background border-input text-foreground focus:ring-ring focus:border-ring",
    footerAction: "bg-muted/30 py-4 px-6 mt-4 border-t border-border",
    dividerLine: "bg-border",
    alert: "bg-destructive/10 border-destructive/20",
    otpCodeFieldInput: "border-input bg-background focus:ring-ring",
    formFieldRow: "mb-4",
    main: "p-8",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkAuthTokenBridge() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setAuthTokenGetter(null);
      return;
    }

    setAuthTokenGetter(async () => {
      try {
        return await getTokenRef.current();
      } catch {
        return null;
      }
    });

    return () => setAuthTokenGetter(null);
  }, [isLoaded, isSignedIn]);

  return null;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function ProtectedAdmin() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <PageLoader />;
  }

  return (
    <Show when="signed-in" fallback={<Redirect to="/sign-in" />}>
      <Suspense fallback={<PageLoader />}>
        <Admin />
      </Suspense>
    </Show>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Nayab Furniture Admin",
            subtitle: "Sign in to manage your showroom",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <CatalogCacheSync />
        <PrefetchBootstrap />
        <ClerkAuthTokenBridge />
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Suspense fallback={<PageLoader />}>
            <Switch>
              <Route path="/sign-in/*?" component={SignInPage} />
              <Route path="/sign-up/*?" component={SignUpPage} />
              <Route path="/admin" component={ProtectedAdmin} />
              <Route>
                <Layout>
                  <RouteTransition>
                    <Switch>
                      <Route path="/" component={Home} />
                      <Route path="/about" component={About} />
                      <Route path="/products/:id" component={ProductDetail} />
                      <Route path="/products" component={Products} />
                      <Route path="/gallery" component={Gallery} />
                      <Route path="/contact" component={Contact} />
                      <Route component={NotFound} />
                    </Switch>
                  </RouteTransition>
                </Layout>
              </Route>
            </Switch>
          </Suspense>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
