import React from "react";
import { Navigate, useParams } from "react-router-dom";
import EditUserPage from "./EditUserPage/editUserPage";
import UserPage from "./UserPage/userPage";
import UsersList from "./UsersListPage/usersList";
import ProtectedRoute from "../protectedRoutes/protectedRoute";
import { useTypedSelector } from "../../hooks/useTypedSelector";

const Users = () => {
  const params = useParams();
  const { userId, edit } = params;
  const currentUserId = useTypedSelector((s) => s.users.currentUser?._id);

  return (
    <>
      <ProtectedRoute>
        {userId ? (
          edit ? (
            userId === currentUserId ? (
              <EditUserPage />
            ) : (
              <Navigate to={`/users/${currentUserId}/edit`} />
            )
          ) : (
            <UserPage clickedUserId={userId} />
          )
        ) : (
          <UsersList />
        )}
      </ProtectedRoute>
    </>
  );
};

export default Users;
