import { useState } from 'react';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';
import InteractiveList from '../sharedComponents/InteractiveList';

const ITEMS = Array.from({ length: 14 }, (_, i) => `Task item #${i + 1}`);

export default function ListPerfDemo() {
  const [selected, setSelected] = useState(0);
  const [oldCount, setOldCount] = useState(0);

  function handleSelect(i: number) {
    setOldCount((c) => c + ITEMS.length); // simulate full-list re-render, O(n)
    setSelected(i);
  }

  return (
    <DemoPanel
      desc="At PlanRadar, selecting a row in a large list re-rendered every row via array-identity comparison — O(n²). I swapped it for a Set-membership lookup, so only the touched row re-renders. Click rows below."
      note="// Old: full list re-renders on every selection. New: only the touched row updates."
    >
      <div className="demo-box">
        <InteractiveList
          items={ITEMS}
          selectedIndex={selected}
          onSelect={handleSelect}
          renderLabel={(label) => label}
        />
        <div className="render-counter">
          <span>Old: <b>{oldCount}</b></span>
          <span>New: <b>1</b></span>
        </div>
      </div>
      <CodeTabs
        files={[
          {
            name: 'InventoryRow.tsx',
            code: `// before — memoized, but still O(n) per tap
const Row = React.memo(({ item, selectedIds, onToggle }: RowProps) => {
  const isSelected = selectedIds.includes(item.id); // array scan, n comparisons
  return (
    <Pressable onPress={() => onToggle(item.id)} style={styles.row}>
      <Text>{item.title}</Text>
      {isSelected && <Icon name="check" />}
    </Pressable>
  );
});
// selectedIds is a new array reference every toggle → every Row's
// props.selectedIds changes identity → React.memo bails, all 400 rows re-render.

// after — bool prop, stable identity per row
const Row = React.memo(
  ({ item, isSelected, onToggle }: RowProps) => (
    <Pressable onPress={() => onToggle(item.id)} style={styles.row}>
      <Text>{item.title}</Text>
      {isSelected && <Icon name="check" />}
    </Pressable>
  ),
  (prev, next) => prev.isSelected === next.isSelected, // custom comparator
);

// parent: <Row isSelected={selectedIds.has(item.id)} ... />`,
          },
          {
            name: 'useRowSelection.ts',
            code: `export function useRowSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const flush = useCallback(() => {
    offlineQueue.push({ type: 'BULK_SELECT', ids: Array.from(selectedIds) });
  }, [selectedIds]);

  return { selected: selectedIds, toggle, flush };
}

// only the touched row's boolean prop actually changes on toggle —
// the other 399 rows never re-render.`,
          },
        ]}
      />
    </DemoPanel>
  );
}
