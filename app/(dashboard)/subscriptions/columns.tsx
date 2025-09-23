'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { checkPermission } from '@/lib/permission';
import { useSession } from 'next-auth/react';
import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { Badge } from '@/components/ui/badge';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isUri, removeHTML, currencyFormat } from '@/lib/utils';

import { Button } from '@/components/ui/button';

export const subscriptionsColumns: ColumnDef<>[] = [];
