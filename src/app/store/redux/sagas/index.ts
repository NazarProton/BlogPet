import { all, spawn } from "redux-saga/effects";
import PostsSaga from "./posts";
import UsersSaga from "./users";

export default function* rootSaga() {
  const sagas = [PostsSaga, UsersSaga];

  yield all(sagas.map((s) => spawn(s)));
}
