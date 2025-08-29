import { Skeleton } from "@/shared/ui/kit/skeleton";
import type { ViewMode } from "./view-mode-toggle";

type BoardsListLayoutProps = {
  header: React.ReactNode;
  filters?: React.ReactNode;
  list?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  templates?: React.ReactNode;
};

export function BoardsListLayout({
  header,
  filters,
  list,
  children,
  sidebar,
  templates,
}: BoardsListLayoutProps) {
  return (
    <div className="container mx-auto">
      <div className="flex gap-4">
        {sidebar}
        <div className="flex-1 p-4 flex flex-col gap-6">
          {templates && (
            <div className="rounded-md bg-gray-100 p-4">{templates}</div>
          )}
          {header}
          {filters}
          {list}
          {children}
        </div>
      </div>
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

      <div className="flex gap-2">{actions}</div>
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
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Filter By
          </span>
          {filters}
        </div>
      )}
      {sort && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Sort By
          </span>
          {sort}
        </div>
      )}
      {actions && <div className="ml-auto">{actions}</div>}
    </div>
  );
}

type BoardsListLayoutContent = {
  children?: React.ReactNode;
  isEmpty?: boolean;
  isPending?: boolean;
  isPendingNextPage?: boolean;
  hasCursor?: boolean;
  mode: ViewMode;
  renderList?: () => React.ReactNode;
  renderGrid?: () => React.ReactNode;
  cursorRef?: React.RefCallback<HTMLDivElement>;
};

export function BoardsListLayoutContent({
  children,
  isEmpty,
  isPending,
  isPendingNextPage,
  hasCursor,
  mode,
  renderList,
  renderGrid,
  cursorRef,
}: BoardsListLayoutContent) {
  return (
    <div>
      {isPending && <div className="text-center py-10">Loading...</div>}

      {mode === "list" && renderList && (
        <BoardsListLayoutList>{renderList?.()}</BoardsListLayoutList>
      )}

      {mode === "grid" && renderGrid && (
        <BoardsListLayoutCards> {renderGrid?.()}</BoardsListLayoutCards>
      )}

      {!isPending && children}

      {isEmpty && !isPending && (
        <div className="text-center py-10">No boards found</div>
      )}

      {hasCursor && (
        <div ref={cursorRef} className="text-center py-8">
          {isPendingNextPage &&
            {
              list: (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-50 w-full" />
                  <Skeleton className="h-50 w-full" />
                </div>
              ),
              grid: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Skeleton className="h-50 w-full" />
                  <Skeleton className="h-50 w-full" />
                  <Skeleton className="h-50 w-full" />
                </div>
              ),
            }[mode]}
        </div>
      )}
    </div>
  );
}

type BoardsListLayoutCardsProps = {
  children: React.ReactNode;
};

export function BoardsListLayoutCards({
  children,
}: BoardsListLayoutCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}

type BoardsListLayoutListProps = {
  children: React.ReactNode;
};

export function BoardsListLayoutList({ children }: BoardsListLayoutListProps) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

type BoardsLayoutContentGroupsProps = {
  groups: {
    title: string;
    items: React.ReactNode;
  }[];
};

export function BoardsLayoutContentGroups({
  groups,
}: BoardsLayoutContentGroupsProps) {
  return (
    <div className="flex flex-col gap-2">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="text-lg font-bold mb-2">{group.title}</p>
          {group.items}
        </div>
      ))}
    </div>
  );
}
