import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Trash2, Star, Loader2, Upload } from "lucide-react";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface Photo {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface PetPhotoUploadProps {
  petId: string;
  petName: string;
  photos: Photo[];
  onPhotosChange: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PHOTOS = 5;

export function PetPhotoUpload({ petId, petName, photos, onPhotosChange }: PetPhotoUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("El archivo es demasiado grande. Maximo 5MB");
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Tipo de archivo no permitido. Usa JPG, PNG o WebP");
      return;
    }

    // Check max photos
    if (photos.length >= MAX_PHOTOS) {
      toast.error(`Maximo ${MAX_PHOTOS} fotos por mascota`);
      return;
    }

    setUploading(true);
    try {
      const { data, error } = await api.uploadPetPhoto(petId, file);
      if (error) throw new Error(error);
      toast.success("Foto subida correctamente");
      onPhotosChange();
    } catch (error: any) {
      toast.error(error.message || "Error al subir la foto");
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm("¿Eliminar esta foto?")) return;

    setDeleting(photoId);
    try {
      const { error } = await api.deletePetPhoto(petId, photoId);
      if (error) throw new Error(error);
      toast.success("Foto eliminada");
      onPhotosChange();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar la foto");
    } finally {
      setDeleting(null);
    }
  };

  const handleSetPrimary = async (photoId: string) => {
    try {
      const { error } = await api.setPrimaryPetPhoto(petId, photoId);
      if (error) throw new Error(error);
      toast.success("Foto principal actualizada");
      onPhotosChange();
    } catch (error: any) {
      toast.error(error.message || "Error al establecer foto principal");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm">
          <Camera className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fotos de {petName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Photo grid */}
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden group">
                <img
                  src={photo.url}
                  alt={petName}
                  className="w-full h-full object-cover"
                />
                {photo.isPrimary && (
                  <div className="absolute top-1 left-1 bg-yellow-500 rounded-full p-1">
                    <Star className="h-3 w-3 text-white fill-white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!photo.isPrimary && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:text-yellow-500"
                      onClick={() => handleSetPrimary(photo.id)}
                      title="Establecer como principal"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:text-red-500"
                    onClick={() => handleDelete(photo.id)}
                    disabled={deleting === photo.id}
                    title="Eliminar"
                  >
                    {deleting === photo.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}

            {/* Upload button - show if under max */}
            {photos.length < MAX_PHOTOS && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer flex flex-col items-center justify-center transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Subir</span>
                  </>
                )}
              </label>
            )}
          </div>

          {/* Info */}
          <p className="text-xs text-muted-foreground text-center">
            {photos.length}/{MAX_PHOTOS} fotos. Max 5MB cada una. JPG, PNG o WebP.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
