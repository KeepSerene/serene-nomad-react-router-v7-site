import { fetchAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/users";
import { Header } from "components";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "lib/utils";

export async function loader() {
  const { users, total } = await fetchAllUsers(10, 0);

  return { users, total };
}

function Users({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;

  return (
    <main className="users wrapper">
      <Header
        title="Manage users"
        desc="Filter, sort, and access detailed user profiles"
      />

      <GridComponent dataSource={users} gridLines="None">
        <ColumnsDirective>
          <ColumnDirective
            field="name"
            headerText="Name"
            width={200}
            textAlign="Left"
            template={(props: UserData) => (
              <div className="px-4 flex items-center gap-1.5">
                <img
                  src={props.imageUrl}
                  alt={props.name}
                  referrerPolicy="no-referrer"
                  className="aspect-square size-8 rounded-full"
                />

                <span>{props.name}</span>
              </div>
            )}
          />

          <ColumnDirective
            field="email"
            headerText="Email"
            width={200}
            textAlign="Left"
          />

          <ColumnDirective
            field="joinedAt"
            headerText="Date Joined"
            width={140}
            textAlign="Left"
            template={({ joinedAt }: { joinedAt: string }) =>
              formatDate(joinedAt)
            }
          />

          {/* <ColumnDirective
            field="itineraryCreated"
            headerText="Trip Created"
            width={130}
            textAlign="Left"
          /> */}

          <ColumnDirective
            field="status"
            headerText="Status"
            width={100}
            textAlign="Left"
            template={(props: UserData) => (
              <div
                className={cn(
                  "status-column",
                  props.status === "user" ? "bg-success-50" : "bg-light-300"
                )}
              >
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    props.status === "user" ? "bg-success-500" : "bg-gray-500"
                  )}
                />

                <span
                  className={cn(
                    "font-inter text-xs font-medium",
                    props.status === "user"
                      ? "text-success-700"
                      : "text-gray-500"
                  )}
                >
                  {props.status}
                </span>
              </div>
            )}
          />
        </ColumnsDirective>
      </GridComponent>
    </main>
  );
}

export default Users;
