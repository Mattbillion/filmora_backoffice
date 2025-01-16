import * as React from "react";
import type { Editor } from "@tiptap/react";
import type { Level } from "@tiptap/extension-heading";
import type { FormatAction } from "../../types";
import type { VariantProps } from "class-variance-authority";
import type { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import {
  CaretDownIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignRightIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToolbarButton } from "../toolbar-button";
import { ShortcutKey } from "../shortcut-key";

type Alignment = "left" | "center" | "right" | "justify";

interface TextStyle
  extends Omit<FormatAction, "value" | "action" | "isActive" | "canExecute"> {
  align?: Alignment;
  className?: string;
}

const formatActions: TextStyle[] = [
  {
    label: "Left",
    align: "left",
    icon: <TextAlignLeftIcon />,
    shortcuts: ["mod", "shift", "L"],
  },
  {
    label: "Right",
    align: "right",
    icon: <TextAlignRightIcon />,
    shortcuts: ["mod", "shift", "R"],
  },
  {
    label: "Center",
    align: "center",
    icon: <TextAlignCenterIcon />,
    shortcuts: ["mod", "shift", "E"],
  },
  {
    label: "Justify",
    align: "justify",
    icon: <TextAlignJustifyIcon />,
    shortcuts: ["mod", "shift", "J"],
  },
];

interface TextAlignSectionProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
  activeLevels?: Level[];
}

export const TextAlignSection: React.FC<TextAlignSectionProps> = React.memo(
  ({ editor, size, variant }) => {
    const handleStyleChange = React.useCallback(
      (align?: Alignment) => {
        if (align) editor.chain().focus().setTextAlign(align).run();
        else editor.chain().focus().unsetTextAlign().run();
      },
      [editor]
    );

    const renderMenuItem = React.useCallback(
      ({ label, icon, align, shortcuts }: TextStyle) => (
        <DropdownMenuItem
          key={label}
          onClick={() => handleStyleChange(align)}
          className={cn("flex flex-row items-center justify-between gap-4", {
            "bg-accent": editor.isActive({ textAlign: align }),
          })}
          aria-label={label}
        >
          <span className="flex items-center gap-4">
            {icon}
            {label}
          </span>
          <ShortcutKey keys={shortcuts} />
        </DropdownMenuItem>
      ),
      [editor, handleStyleChange]
    );

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolbarButton
            isActive={editor.isActive("textAlign")}
            tooltip="Text align"
            aria-label="Text alignments"
            pressed={editor.isActive("textAlign")}
            className="w-12"
            disabled={editor.isActive("codeBlock")}
            size={size}
            variant={variant}
          >
            <TextAlignLeftIcon className="size-5" />
            <CaretDownIcon className="size-5" />
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-full">
          {formatActions.map(renderMenuItem)}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

TextAlignSection.displayName = "TextAlignSection";

export default TextAlignSection;
