import * as React from 'react';
import type { Editor } from '@tiptap/core';
import { Placeholder } from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Typography } from '@tiptap/extension-typography';
import Youtube from '@tiptap/extension-youtube';
import type { Content, UseEditorOptions } from '@tiptap/react';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

import { cn } from '@/lib/utils';

import {
  CodeBlockLowlight,
  Color,
  HorizontalRule,
  Image,
  Link,
  ResetMarksOnEnter,
  Selection,
  UnsetAllMarks,
} from '../extensions';
import { useThrottle } from '../hooks/use-throttle';
import { getOutput } from '../utils';

export interface UseMinimalTiptapEditorProps extends UseEditorOptions {
  value?: Content;
  output?: 'html' | 'json' | 'text';
  placeholder?: string;
  editorClassName?: string;
  throttleDelay?: number;
  onUpdate?: (content: Content) => void;
  onBlur?: (content: Content) => void;
}

const createExtensions = (placeholder: string) => [
  StarterKit.configure({
    horizontalRule: false,
    codeBlock: false,
    paragraph: { HTMLAttributes: { class: 'text-node' } },
    heading: { HTMLAttributes: { class: 'heading-node' } },
    blockquote: { HTMLAttributes: { class: 'block-node' } },
    bulletList: { HTMLAttributes: { class: 'list-node' } },
    orderedList: { HTMLAttributes: { class: 'list-node' } },
    code: { HTMLAttributes: { class: 'inline', spellcheck: 'false' } },
    dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' },
    // image: { inline: true },
  }),
  Link,
  Image.configure({
    inline: true,
    allowBase64: false,
    HTMLAttributes: {
      class: 'image-node',
    },
  }),

  Color,
  TextStyle,
  Text,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Youtube.configure({
    disableKBcontrols: true,
  }),
  Selection,
  Typography,
  UnsetAllMarks,
  HorizontalRule,
  ResetMarksOnEnter,
  CodeBlockLowlight,
  Placeholder.configure({ placeholder: () => placeholder }),
];

export const useMinimalTiptapEditor = ({
  value,
  output = 'html',
  placeholder = '',
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  ...props
}: UseMinimalTiptapEditorProps) => {
  const throttledSetValue = useThrottle(
    (v: Content) => onUpdate?.(v),
    throttleDelay,
  );

  const handleUpdate = React.useCallback(
    (editor: Editor) => throttledSetValue(getOutput(editor, output)),
    [output, throttledSetValue],
  );

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) editor.commands.setContent(value)
    },
    [value],
  );

  const handleBlur = React.useCallback(
    (editor: Editor) => onBlur?.(getOutput(editor, output)),
    [output, onBlur],
  );

  const editor = useEditor({
    extensions: createExtensions(placeholder!),
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        class: cn('focus:outline-none', editorClassName),
      },
    },
    onUpdate: ({ editor: e }) => handleUpdate(e),
    onCreate: ({ editor: e }) => handleCreate(e),
    onBlur: ({ editor: e }) => handleBlur(e),
    ...props,
  });

  return editor;
};

export default useMinimalTiptapEditor;
