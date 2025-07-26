'use client';

import { useEffect, useState, useTransition } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { idRegex, translationMap } from '../seatmap/constants';
import { usePurchasableUpdate } from '../seatmap/context/purchasable-context';
import { useStage } from '../seatmap/context/stage';
import { KGroup, KNode } from '../seatmap/types';

function canRender(node: KNode) {
  const notText = node.getClassName?.() !== 'Text';
  const idMatch = idRegex.test(node.id?.() ?? '');
  const type = node.getAttr?.('data-type');
  const seat = node.getAttr?.('data-seat');
  const table = node.getAttr?.('data-table');

  if (!notText || !idMatch) return false;
  if (type === 'seat' && !seat) return false;
  if (type === 'table' && !table) return false;

  return true;
}

function Node({ node }: { node: KNode }) {
  const { updatePurchasable, updatedPurchasable } = usePurchasableUpdate();
  const isPurchasable = updatedPurchasable[node.id()];

  const handleToggle = (checked: boolean) =>
    updatePurchasable({ [node.id()]: checked });

  const seatNo = node.getAttr?.('data-seat');
  const tableNo = node.getAttr?.('data-table');

  return (
    <button
      type="button"
      onClick={() => handleToggle(!isPurchasable)}
      className="rounded-md border p-4"
    >
      {seatNo || tableNo}
      {String(isPurchasable)}
    </button>
  );
}

function NodeGroup({ node }: { node: KGroup }) {
  const { updatePurchasable } = usePurchasableUpdate();
  const { containPurchasableNode, getTicketsRef } = useStage();
  const [open, setOpen] = useState(false);
  const [purchasable, setPurchasable] = useState(containPurchasableNode(node));
  const [_, startCheckTransition] = useTransition();

  function elemIncludesParentGroups(elemId: string, parentId: string): boolean {
    const parentParts = parentId.split('-');
    const regex = new RegExp(
      parentParts.map((part) => `(?=.*${part})`).join(''),
    );
    return regex.test(elemId);
  }

  const handleToggle = (checked: boolean) => {
    // node.setAttr('data-purchasable', checked);
    startCheckTransition(() => {
      getTicketsRef().find((c: KNode) => {
        const idIncluded = elemIncludesParentGroups(c.id(), node.id());
        const isSeat = c.attrs['data-seat'] || c.attrs['data-table'];

        if (idIncluded && isSeat) updatePurchasable({ [c.id()]: checked });
      });
    });
    setPurchasable(checked);
  };

  const children = node.getChildren?.((c) => canRender(c)) ?? [];

  const dataType = node.attrs['data-type'];
  return (
    <div className="my-2 ml-4">
      <div className="flex items-center space-x-2">
        {children.length > 0 ? (
          <button
            onClick={() => setOpen(!open)}
            className="text-xs"
            aria-label="Toggle children"
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="inline-block w-[14px]" />
        )}
        <input
          type="checkbox"
          checked={purchasable}
          onChange={(e) => handleToggle(e.target.checked)}
        />
        <span className="text-sm font-medium">
          {translationMap[dataType]}: {node.attrs[`data-${dataType}`]}
        </span>
      </div>

      {open && children.length > 0 && (
        <div className="mt-2 border-l border-gray-300 pl-4">
          {children.map((child) => (
            <PurchasableNode key={child._id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function PurchasableNode({ node }: { node: KNode | KGroup }) {
  if (node.getClassName() === 'Group')
    return <NodeGroup node={node as KGroup} />;
  return <Node node={node as KNode} />;
}

export default function PurchasableList() {
  const { updatePurchasable } = usePurchasableUpdate();
  const { getTicketsRef, seatsLoaded } = useStage();

  useEffect(() => {
    console.log(
      getTicketsRef()
        ?.find((c: KNode) => typeof c.attrs['data-purchasable'] === 'boolean')
        .reduce(
          (acc, cur) => ({
            ...acc,
            [cur.id()]: cur.attrs['data-purchasable'],
          }),
          {},
        ),
    );
    updatePurchasable(
      getTicketsRef()
        ?.find((c: KNode) => typeof c.attrs['data-purchasable'] === 'boolean')
        .reduce(
          (acc, cur) => ({
            ...acc,
            [cur.id()]: cur.attrs['data-purchasable'],
          }),
          {},
        ),
    );
  }, [seatsLoaded]);

  if (!seatsLoaded) return null;
  return (
    <>
      {(getTicketsRef()?.getChildren((c) => idRegex.test(c.id())) ?? []).map(
        (node) => (
          <PurchasableNode key={node._id} node={node} />
        ),
      )}
    </>
  );
}
