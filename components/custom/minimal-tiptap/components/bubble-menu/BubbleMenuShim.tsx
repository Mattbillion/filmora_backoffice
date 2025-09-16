// Temporary shim for Tiptap v3 BubbleMenu React component.
// TODO: replace with a proper floating-ui based bubble menu using @tiptap/extension-bubble-menu.
import * as React from 'react';

export const BubbleMenu: React.FC<{
  children?: React.ReactNode;
  // accept any props for compatibility
  [key: string]: any;
}> = ({ children }) => {
  return <>{children}</>;
};

export default BubbleMenu;
