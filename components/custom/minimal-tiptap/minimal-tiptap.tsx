import * as React from 'react';
import type { Content, Editor } from '@tiptap/react';
import { EditorContent } from '@tiptap/react';

import './styles/index.css';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { ImageBubbleMenu } from './components/bubble-menu/image-bubble-menu';
import { LinkBubbleMenu } from './components/bubble-menu/link-bubble-menu';
import { SectionFive } from './components/section/five';
import { SectionFour } from './components/section/four';
import { SectionOne } from './components/section/one';
import { TextAlignSection } from './components/section/text-align';
import { SectionThree } from './components/section/three';
import { SectionTwo } from './components/section/two';
import type { UseMinimalTiptapEditorProps } from './hooks/use-minimal-tiptap';
import { useMinimalTiptapEditor } from './hooks/use-minimal-tiptap';

export interface MinimalTiptapProps
  extends Omit<UseMinimalTiptapEditorProps, 'onUpdate'> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="shrink-0 overflow-x-auto border-b p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <TextAlignSection editor={editor} />

      <SectionTwo
        editor={editor}
        activeActions={[
          'bold',
          'italic',
          'strikethrough',
          'code',
          'clearFormatting',
        ]}
        mainActionCount={2}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionThree editor={editor} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFour
        editor={editor}
        activeActions={['orderedList', 'bulletList']}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFive
        editor={editor}
        activeActions={['codeBlock', 'blockquote', 'horizontalRule']}
        mainActionCount={0}
      />
    </div>
  </div>
);

export const MinimalTiptapEditor = React.forwardRef<
  HTMLDivElement,
  MinimalTiptapProps
>(({ value, onChange, className, editorContentClassName, ...props }, ref) => {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    ...props,
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        'border-input focus-within:ring-ring flex h-auto min-h-0 w-full flex-col rounded-md border focus-within:ring-1',
        className,
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className={cn('minimal-tiptap-editor', editorContentClassName)}
      />
      <LinkBubbleMenu editor={editor} />
      <ImageBubbleMenu editor={editor} />
    </div>
  );
});

MinimalTiptapEditor.displayName = 'MinimalTiptapEditor';

export default MinimalTiptapEditor;
