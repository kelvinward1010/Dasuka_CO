import { HttpStatusCode } from "axios";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import { NotAuthorizationPage } from "./403";
import { NotFoundPage } from "./404";
import { ServerErrorPage } from "./500";

export function ErrorBoundaryPage(): JSX.Element {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === HttpStatusCode.NotFound) {
      return <NotFoundPage />;
    }
    if (error.status === HttpStatusCode.Unauthorized)
      return <NotAuthorizationPage />;
  }

  return <ServerErrorPage />;
}
