type BoardsListLayoutProps = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export function BoardsListLayout({ header, children }: BoardsListLayoutProps) {
  return (
    <div className="container mx-auto p-4">
      {header}
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
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-gray-500">{description}</p>}
      </div>

      {actions}
    </div>
  );
}

type BoardsListLayoutFiltersProps = {};

export function BoardsListLayoutFilters({}: BoardsListLayoutFiltersProps) {
  return <div className="mb-8"></div>;
}
