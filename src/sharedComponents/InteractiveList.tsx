type InteractiveListProps<T> = {
  items: T[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  renderLabel: (item: T) => React.ReactNode;
};

/** The clickable row list every "click to select/resolve" demo shares. */
export default function InteractiveList<T>({
  items,
  selectedIndex,
  onSelect,
  renderLabel,
}: InteractiveListProps<T>) {
  return (
    <div className="fake-list">
      {items.map((item, i) => (
        <div
          key={i}
          className={'fake-row' + (i === selectedIndex ? ' selected' : '')}
          onClick={() => onSelect(i)}
        >
          {renderLabel(item)}
        </div>
      ))}
    </div>
  );
}
