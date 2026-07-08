import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getAdminSummary, getGetAdminSummaryQueryKey, getGetAdminSummaryQueryOptions,
  useListProducts, getListProductsQueryKey, useCreateProduct, useUpdateProduct, useDeleteProduct,
  useListGalleryImages, getListGalleryImagesQueryKey, useCreateGalleryImage, useDeleteGalleryImage,
  listInquiries, getListInquiriesQueryKey, getListInquiriesQueryOptions, useUpdateInquiry, useDeleteInquiry,
  Product, GalleryImage, Inquiry
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useUser, useClerk } from "@clerk/react";
import { AdminAuthReady } from "@/components/AdminAuthReady";
import { ApiErrorState } from "@/components/ApiErrorState";
import { ImageUploadField } from "@/components/ImageUploadField";
import { resolveImageUrl } from "@/lib/images";
import { useAdminApi } from "@/hooks/use-admin-api";

import {
  LayoutDashboard, Package, Image as ImageIcon, MessageSquare, 
  Plus, Edit, Trash2, LogOut, CheckCircle, ExternalLink, Loader2,
  Clock,
  Mail,
  Phone
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

const TABS = {
  DASHBOARD: 'dashboard',
  PRODUCTS: 'products',
  GALLERY: 'gallery',
  INQUIRIES: 'inquiries'
};

const PRODUCT_CATEGORIES = [
  "Sofa Sets", "Bed Sets", "Dining Tables", "Dressing Tables", 
  "Coffee Tables", "Kitchen Cabinets", "Wedding Packages", "Other"
];

export default function Admin() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
  
  return (
    <AdminAuthReady>
    <div className="flex flex-col md:flex-row h-[100dvh] bg-muted/30 overflow-hidden font-sans">
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border shrink-0">
        <div className="min-w-0">
          <h1 className="font-serif font-bold text-lg text-foreground truncate">Nayab Admin</h1>
          <p className="text-[10px] text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => window.location.href = "/"} aria-label="View site">
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => signOut({ redirectUrl: "/" })} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <h1 className="font-serif font-bold text-xl text-foreground">Nayab Admin</h1>
          <p className="text-xs text-muted-foreground mt-1 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            label="Dashboard" 
            active={activeTab === TABS.DASHBOARD} 
            onClick={() => setActiveTab(TABS.DASHBOARD)} 
          />
          <NavItem 
            icon={<Package className="h-5 w-5" />} 
            label="Products" 
            active={activeTab === TABS.PRODUCTS} 
            onClick={() => setActiveTab(TABS.PRODUCTS)} 
          />
          <NavItem 
            icon={<ImageIcon className="h-5 w-5" />} 
            label="Gallery" 
            active={activeTab === TABS.GALLERY} 
            onClick={() => setActiveTab(TABS.GALLERY)} 
          />
          <NavItem 
            icon={<MessageSquare className="h-5 w-5" />} 
            label="Inquiries" 
            active={activeTab === TABS.INQUIRIES} 
            onClick={() => setActiveTab(TABS.INQUIRIES)} 
          />
        </nav>
        
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={() => signOut({ redirectUrl: "/" })}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
          <Button variant="link" className="w-full justify-start mt-2 text-xs text-muted-foreground" onClick={() => window.location.href = "/"}>
            <ExternalLink className="mr-2 h-3 w-3" /> View Public Site
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
        {activeTab === TABS.DASHBOARD && <DashboardView onNavigate={setActiveTab} />}
        {activeTab === TABS.PRODUCTS && <ProductsView />}
        {activeTab === TABS.GALLERY && <GalleryView />}
        {activeTab === TABS.INQUIRIES && <InquiriesView />}
      </main>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border safe-area-pb">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          <MobileNavItem icon={<LayoutDashboard className="h-5 w-5" />} label="Home" active={activeTab === TABS.DASHBOARD} onClick={() => setActiveTab(TABS.DASHBOARD)} />
          <MobileNavItem icon={<Package className="h-5 w-5" />} label="Products" active={activeTab === TABS.PRODUCTS} onClick={() => setActiveTab(TABS.PRODUCTS)} />
          <MobileNavItem icon={<ImageIcon className="h-5 w-5" />} label="Gallery" active={activeTab === TABS.GALLERY} onClick={() => setActiveTab(TABS.GALLERY)} />
          <MobileNavItem icon={<MessageSquare className="h-5 w-5" />} label="Inquiries" active={activeTab === TABS.INQUIRIES} onClick={() => setActiveTab(TABS.INQUIRIES)} />
        </div>
      </nav>
    </div>
    </AdminAuthReady>
  );
}

function MobileNavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 py-2 rounded-md text-[10px] font-medium transition-colors ${
        active ? "text-primary bg-primary/10" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${
        active 
          ? "bg-primary text-primary-foreground shadow-sm" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// --- Views ---

function DashboardView({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { withAuth, isReady } = useAdminApi();
  const summaryOptions = getGetAdminSummaryQueryOptions({
    query: { enabled: isReady },
  });
  const { data, isLoading, isError, refetch } = useQuery({
    ...summaryOptions,
    queryFn: async ({ signal }) =>
      getAdminSummary(await withAuth({ signal })),
    staleTime: 0,
    refetchOnMount: "always",
    retry: 1,
  });

  if (isLoading) return <LoadingState />;
  if (isError) {
    return (
      <ApiErrorState
        title="Could not load dashboard"
        message="Your admin session may have expired. Try again or sign out and sign back in."
        onRetry={() => refetch()}
      />
    );
  }
  if (!data) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Dashboard</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard title="Total Products" value={data.totalProducts} icon={<Package />} onClick={() => onNavigate(TABS.PRODUCTS)} />
        <StatCard title="Gallery Images" value={data.totalGalleryImages} icon={<ImageIcon />} onClick={() => onNavigate(TABS.GALLERY)} />
        <StatCard title="Total Inquiries" value={data.totalInquiries} icon={<MessageSquare />} onClick={() => onNavigate(TABS.INQUIRIES)} />
        <StatCard title="New Inquiries" value={data.newInquiries} icon={<MessageSquare className="text-primary" />} highlight onClick={() => onNavigate(TABS.INQUIRIES)} />
      </div>

      <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="font-serif font-bold text-lg">Recent Inquiries</h3>
          <Button variant="outline" size="sm" onClick={() => onNavigate(TABS.INQUIRIES)}>View All</Button>
        </div>
        <div className="divide-y divide-border">
          {data.recentInquiries?.length > 0 ? (
            data.recentInquiries.map(inquiry => (
              <div key={inquiry.id} className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{inquiry.name}</span>
                    {inquiry.status === 'new' && (
                      <span className="bg-primary/20 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">New</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{inquiry.phone} {inquiry.email && `• ${inquiry.email}`}</p>
                  <p className="text-sm text-foreground line-clamp-1 max-w-2xl">{inquiry.message}</p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(inquiry.createdAt), "MMM d, yyyy")}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">No recent inquiries.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, highlight = false, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`bg-card p-6 rounded-md border cursor-pointer hover:shadow-md transition-all ${highlight ? 'border-primary shadow-sm' : 'border-border shadow-sm'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function ProductsView() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useListProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);

  const openCreateDialog = () => {
    setEditingProduct(null);
    setName("");
    setCategory(PRODUCT_CATEGORIES[0]);
    setDescription("");
    setPriceLabel("Call for Price");
    setImageUrl("");
    setFeatured(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setDescription(product.description);
    setPriceLabel(product.priceLabel);
    setImageUrl(product.imageUrl);
    setFeatured(product.featured);
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: number) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!name || !category) {
      toast({ variant: "destructive", title: "Error", description: "Name and Category are required." });
      return;
    }

    const payload = { name, category, description, priceLabel, imageUrl, featured };

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() });
          setIsDialogOpen(false);
          toast({ title: "Success", description: "Product updated." });
        }
      });
    } else {
      createProduct.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() });
          setIsDialogOpen(false);
          toast({ title: "Success", description: "Product created." });
        }
      });
    }
  };

  const handleDelete = () => {
    if (!productToDelete) return;
    deleteProduct.mutate({ id: productToDelete }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() });
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
        toast({ title: "Success", description: "Product deleted." });
      }
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Products</h2>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card border border-border rounded-md shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium text-center">Featured</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products?.length ? products.map(product => (
                <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="w-12 h-12 rounded object-cover border border-border" loading="lazy" />
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{product.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                  <td className="px-6 py-4 text-muted-foreground">{product.priceLabel || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    {product.featured ? <CheckCircle className="h-4 w-4 text-primary mx-auto" /> : '-'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => confirmDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {products?.length ? products.map(product => (
          <div key={product.id} className="bg-card border border-border rounded-md p-4 flex gap-3">
            <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="w-16 h-16 rounded object-cover border border-border shrink-0" loading="lazy" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.category}</p>
              <p className="text-xs text-muted-foreground mt-1">{product.priceLabel || "Call for Price"}</p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                  <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => confirmDelete(product.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-8 text-center text-muted-foreground bg-card border border-border rounded-md">No products found.</div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Royal Walnut Sofa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Rich details about the piece..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceLabel">Price Label</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input id="priceLabel" value={priceLabel} onChange={e => setPriceLabel(e.target.value)} placeholder="e.g. Rs. 150,000" className="flex-1" />
                <Button type="button" variant="secondary" className="shrink-0" onClick={() => setPriceLabel("Call for Price")}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call for Price
                </Button>
              </div>
            </div>

            <ImageUploadField label="Product Image" value={imageUrl} onChange={setImageUrl} />

            <div className="flex items-center space-x-2 pt-2">
              <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
              <Label htmlFor="featured">Featured Product (Shows on Homepage)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createProduct.isPending || updateProduct.isPending}>
              {createProduct.isPending || updateProduct.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>Are you sure you want to delete this product? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteProduct.isPending}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GalleryView() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: images, isLoading } = useListGalleryImages();
  const createGalleryImage = useCreateGalleryImage();
  const deleteGalleryImage = useDeleteGalleryImage();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Sofa Sets"); // Reuse product categories or allow custom

  const handleSave = () => {
    if (!imageUrl || !caption || !category) {
      toast({ variant: "destructive", title: "Error", description: "All fields are required." });
      return;
    }
    
    createGalleryImage.mutate({ data: { imageUrl, caption, category } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListGalleryImagesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() });
        setIsDialogOpen(false);
        setImageUrl(""); setCaption(""); setCategory("Sofa Sets");
        toast({ title: "Success", description: "Image added to gallery." });
      }
    });
  };

  const handleDelete = (id: number) => {
    if(!confirm("Delete this image?")) return;
    deleteGalleryImage.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListGalleryImagesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() });
        toast({ title: "Success", description: "Image deleted." });
      }
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Gallery</h2>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" /> Add Image</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {images?.length ? images.map(img => (
          <div key={img.id} className="bg-card border border-border rounded-md overflow-hidden shadow-sm group">
            <div className="aspect-square relative overflow-hidden bg-muted">
              <img src={resolveImageUrl(img.imageUrl)} alt={img.caption} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(img.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{img.category}</span>
              <p className="text-sm font-medium text-foreground mt-1 line-clamp-2">{img.caption}</p>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-border rounded-md">No gallery images found.</div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Gallery Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <ImageUploadField label="Image" value={imageUrl} onChange={setImageUrl} required />
            <div className="space-y-2">
              <Label htmlFor="g-caption">Caption *</Label>
              <Input id="g-caption" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Brief description of the work" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="g-category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="g-category"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createGalleryImage.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InquiriesView() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { withAuth, isReady } = useAdminApi();
  const inquiryOptions = getListInquiriesQueryOptions({
    query: { enabled: isReady },
  });
  const { data: inquiries, isLoading } = useQuery({
    ...inquiryOptions,
    queryFn: async ({ signal }) =>
      listInquiries(await withAuth({ signal })),
    staleTime: 0,
    refetchOnMount: "always",
    retry: 1,
  });
  const updateInquiry = useUpdateInquiry();
  const deleteInquiry = useDeleteInquiry();

  const handleMarkRead = (id: number, currentStatus: string) => {
    if (currentStatus === 'read') return;
    updateInquiry.mutate({ id, data: { status: 'read' } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListInquiriesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() });
        toast({ title: "Marked as read" });
      }
    });
  };

  const handleDelete = (id: number) => {
    if(!confirm("Delete this inquiry?")) return;
    deleteInquiry.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListInquiriesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() });
        toast({ title: "Inquiry deleted" });
      }
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Inquiries</h2>

      <div className="space-y-4">
        {inquiries?.length ? inquiries.map(inq => (
          <div key={inq.id} className={`bg-card border rounded-md p-6 shadow-sm transition-colors ${inq.status === 'new' ? 'border-primary shadow-primary/10' : 'border-border'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif font-bold text-lg">{inq.name}</h3>
                  {inq.status === 'new' && <span className="bg-primary/20 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">New</span>}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {inq.phone}</span>
                  {inq.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {inq.email}</span>}
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(inq.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {inq.status === 'new' && (
                  <Button variant="outline" size="sm" onClick={() => handleMarkRead(inq.id, inq.status)}>
                    Mark Read
                  </Button>
                )}
                <a href={`https://api.whatsapp.com/send?phone=${inq.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border-[#25D366]/30">
                    Reply WhatsApp
                  </Button>
                </a>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(inq.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-foreground whitespace-pre-wrap">{inq.message}</p>
          </div>
        )) : (
          <div className="py-12 text-center text-muted-foreground bg-card border border-border rounded-md">No inquiries yet.</div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
