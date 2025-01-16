import * as React from "react";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/functions";

interface ImageEditBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  editor: Editor;
  close: () => void;
}

const ImageEditBlock = ({
  editor,
  className,
  close,
  ...props
}: ImageEditBlockProps) => {
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [link, setLink] = React.useState<string>("");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleLink = () => {
    editor.chain().focus().setImage({ src: link }).run();
    close();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", "image_block");

      if (file?.size >= 5000000) throw new Error("Зургийн хэмжээ том байна.");

      const { data } = (await uploadImage(formData, "large"))!;

      editor.chain().focus().setImage({ src: data.url }).run();

      close();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleLink();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={cn("space-y-6", className)} {...props}>
        <div className="space-y-1">
          <Label>Attach an image link</Label>
          <div className="flex">
            <Input
              type="url"
              required
              placeholder="https://example.com"
              value={link}
              className="grow"
              onChange={(e) => setLink(e.target.value)}
            />
            <Button type="submit" className="ml-2 inline-block h-11">
              Submit
            </Button>
          </div>
        </div>
        <Button className="w-full" onClick={handleClick} disabled={loading}>
          {loading ? "Uploading..." : "Upload from your computer"}
        </Button>
        {!!error && (
          <p className="text-[0.8rem] font-medium text-destructive !mt-1">
            {error}
          </p>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          multiple
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </form>
  );
};

export { ImageEditBlock };
