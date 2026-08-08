import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';
import InteractiveList from '../sharedComponents/InteractiveList';

export default function ListPerfDemo() {
  const { t } = useTranslation();
  const ITEMS = Array.from({ length: 14 }, (_, i) => t('demoUI.list.taskItem', { n: i + 1 }));
  const [selected, setSelected] = useState(0);
  const [oldCount, setOldCount] = useState(0);

  function handleSelect(i: number) {
    setOldCount((c) => c + ITEMS.length); // simulate full-list re-render, O(n)
    setSelected(i);
  }

  return (
    <DemoPanel desc={t('demoText.list.desc')} note={t('demoText.list.note')}>
      <div className="demo-box">
        <InteractiveList
          items={ITEMS}
          selectedIndex={selected}
          onSelect={handleSelect}
          renderLabel={(label) => label}
        />
        <div className="render-counter">
          <span>{t('common.old')}: <b>{oldCount}</b></span>
          <span>{t('common.new')}: <b>1</b></span>
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
