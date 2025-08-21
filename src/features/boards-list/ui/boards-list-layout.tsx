type BoardsListLayoutProps = {
  header: React.ReactNode;
  filters?: React.ReactNode;
  list?: React.ReactNode;
  children: React.ReactNode;
};

export function BoardsListLayout({
  header,
  filters,
  list,
  children,
}: BoardsListLayoutProps) {
  return (
    <div className="container mx-auto p-4 flex flex-col gap-6">
      {header}
      {filters}
      {list}

      {children}
    </div>
  );
}

type BoardsListLayoutHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function BoardsListLayoutHeader({
  title,
  description,
  actions,
}: BoardsListLayoutHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-gray-500">{description}</p>}
      </div>

      {actions}
    </div>
  );
}

type BoardsListLayoutFiltersProps = {
  sort?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
};

export function BoardsListLayoutFilters({
  sort,
  filters,
  actions,
}: BoardsListLayoutFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      {filters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filter By</span>
          {filters}
        </div>
      )}
      {sort && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort By</span>
          {sort}
        </div>
      )}
      {actions && <div className="ml-auto">{actions}</div>}
    </div>
  );
}

type BoardsListProps = {
  children: React.ReactNode;
  isEmpty?: boolean;
  isPending?: boolean;
  isPendingNextPage?: boolean;
  cursorRef?: React.RefCallback<HTMLDivElement>;
  hasCursor?: boolean;
};

export function BoardsListLayoutContent({
  children,
  isEmpty,
  isPending,
  isPendingNextPage,
  cursorRef,
  hasCursor,
}: BoardsListProps) {
  return (
    <div>
      {isPending && <div className="text-center py-10">Loading...</div>}

      {!isPending && children}

      {isEmpty && !isPending && (
        <div className="text-center py-10">No boards found</div>
      )}

      {hasCursor && (
        <div ref={cursorRef} className="text-center py-8">
          {isPendingNextPage && "Loading more boards..."}
        </div>
      )}
    </div>
  );
}

type BoardsListCardsLayoutProps = {
  children: React.ReactNode;
};

export function BoardsListCardsLayout({
  children,
}: BoardsListCardsLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}

type BoardsListListLayoutProps = {
  children: React.ReactNode;
};

export function BoardsListListLayout({ children }: BoardsListListLayoutProps) {
  return <div className="flex flex-col gap-2">{children}</div>;
}
