import { rqClient } from "@/shared/api/instance";
import { ROUTES } from "@/shared/model/routes";
import { useQueryClient } from "@tanstack/react-query";
import { href, Link } from "react-router-dom";

function BoardsListPage() {
  const queryClient = useQueryClient();
  const { data: boards } = rqClient.useQuery("get", "/boards");

  const createBoardMutation = rqClient.useMutation("post", "/boards", {
    onSettled: async () => {
      await queryClient.invalidateQueries(
        rqClient.queryOptions("get", "/boards"),
      );
    },
  });

  const deleteBoardMutation = rqClient.useMutation(
    "delete",
    "/boards/{boardId}",
    {
      onSettled: async () => {
        await queryClient.invalidateQueries(
          rqClient.queryOptions("get", "/boards"),
        );
      },
    },
  );

  return (
    <div>
      <h1>Boards list</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.target as HTMLFormElement);

          createBoardMutation.mutate({
            body: { name: formData.get("name") as string },
          });
        }}
      >
        <input type="text" name="name" />
        <button type="submit" disabled={createBoardMutation.isPending}>
          Create New Board
        </button>
      </form>

      <ul>
        {boards?.map((board) => (
          <li key={board.id}>
            <Link to={href(ROUTES.BOARD, { boardId: board.id })}>
              {board.name}
            </Link>
            <button
              disabled={deleteBoardMutation.isPending}
              onClick={() =>
                deleteBoardMutation.mutate({
                  params: { path: { boardId: board.id } },
                })
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Component = BoardsListPage;
