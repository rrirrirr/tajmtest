import { useRouteError } from "react-router-dom";

export default function UserError() {
  const error = useRouteError();

  return (
    <div>
      <h1>Oops!</h1>
      <p>Något gick fel.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

