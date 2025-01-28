import { useState } from 'react';
import type { Editor } from '@tiptap/react';
import type { VariantProps } from 'class-variance-authority';
import { Youtube } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { toggleVariants } from '@/components/ui/toggle';

import ToolbarButton from '../../components/toolbar-button';

interface YoutubeDialogProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
}

const YoutubeDialog = ({ editor, size, variant }: YoutubeDialogProps) => {
  const [url, setUrl] = useState('');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ToolbarButton
          isActive={editor.isActive('youtube')}
          tooltip="Youtube url"
          aria-label="Youtube url"
          size={size}
          variant={variant}
        >
          <Youtube className="size-5" />
        </ToolbarButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Youtube video link</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Paste youtube url here"
          onChange={(e) => setUrl(e.target.value)}
        />
        <DialogFooter>
          <DialogClose>
            <Button
              type="button"
              disabled={!url}
              onClick={() =>
                editor.commands.setYoutubeVideo({
                  src: url,
                })
              }
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { YoutubeDialog };
