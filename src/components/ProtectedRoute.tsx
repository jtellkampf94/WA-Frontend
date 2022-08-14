import { ApolloError } from "@apollo/client";
import { Navigate } from "react-router-dom";
import { GetCurrentUserQuery } from "../generated/graphql";
import QueryResult from "./QueryResult";

interface ProtectedRouteProps {
  user?: GetCurrentUserQuery;
  loading: boolean;
  error: ApolloError | undefined;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  user,
  loading,
  error,
}) => {
  console.log("hoooooooooooooeeeeeeeeeeeee");

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <QueryResult loading={loading} error={error}>
      {children}
    </QueryResult>
  );
};

export default ProtectedRoute;
