"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Globe, Save, Upload, X } from "lucide-react";
import Image from "next/image";

export default function GeneralSettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [generalInfo, setGeneralInfo] = useState({
    name: "Restaurante Demo",
    description: "O melhor restaurante da cidade com pratos deliciosos e ambiente aconchegante.",
    slug: "restaurante-demo",
    phone: "(11) 98765-4321",
    whatsapp: "(11) 98765-4321",
    email: "contato@restaurantedemo.com.br",
    website: "https://www.restaurantedemo.com.br"
  });

  const handleGeneralInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralInfo({ ...generalInfo, [name]: value });
  };

  const handleImageChange = (type: 'cover' | 'logo') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Formato de imagem não suportado");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'cover') {
          setCoverImage(result);
        } else {
          setLogoImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type: 'cover' | 'logo') => () => {
    if (type === 'cover') {
      setCoverImage(null);
    } else {
      setLogoImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulação de salvamento
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Informações gerais salvas com sucesso!");
    }, 1000);
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Globe className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Informações Gerais</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção de Imagens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagem de Capa */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Imagem de Capa
            </label>
            <div className="border-2 border-dashed rounded-lg p-4">
              {coverImage ? (
                <div className="relative">
                  <Image
                    src={coverImage}
                    alt="Capa do restaurante"
                    width={600}
                    height={200}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeImage('cover')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center py-6 px-4">
                  <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center mb-1">
                    Arraste uma imagem ou clique para fazer upload
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    PNG, JPG ou WEBP (max. 5MB)
                  </p>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange('cover')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-[#fcf8f2] transition-colors"
                  >
                    Escolher Arquivo
                  </button>
                </label>
              )}
            </div>
          </div>

          {/* Logotipo */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Logotipo
            </label>
            <div className="border-2 border-dashed rounded-lg p-4">
              {logoImage ? (
                <div className="relative">
                  <Image
                    src={logoImage}
                    alt="Logotipo do restaurante"
                    width={200}
                    height={200}
                    className="w-40 h-40 mx-auto object-contain rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeImage('logo')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center py-6 px-4">
                  <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center mb-1">
                    Arraste uma imagem ou clique para fazer upload
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    PNG, JPG ou WEBP (max. 5MB)
                  </p>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange('logo')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-[#fcf8f2] transition-colors"
                  >
                    Escolher Arquivo
                  </button>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nome do Estabelecimento
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={generalInfo.name}
                onChange={handleGeneralInfoChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={generalInfo.description}
                onChange={handleGeneralInfoChange}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-1">
                URL do Cardápio (slug)
              </label>
              <div className="flex items-center">
                <span className="text-muted-foreground text-sm mr-1">seusite.com/cardapio/</span>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={generalInfo.slug}
                  onChange={handleGeneralInfoChange}
                  className="flex-1 px-3 py-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Telefone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={generalInfo.phone}
                onChange={handleGeneralInfoChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium mb-1">
                WhatsApp
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="text"
                value={generalInfo.whatsapp}
                onChange={handleGeneralInfoChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={generalInfo.email}
                onChange={handleGeneralInfoChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="website" className="block text-sm font-medium mb-1">
                Website
              </label>
              <input
                id="website"
                name="website"
                type="url"
                value={generalInfo.website}
                onChange={handleGeneralInfoChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md"
          >
            {isSubmitting ? (
              <>Salvando...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Informações
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
} 